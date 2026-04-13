const fs = require('fs');

const file_path = 'frontend/src/features/cv-builder/CvTemplatesPage.tsx';
let content = fs.readFileSync(file_path, 'utf-8');

const upstreamStart = content.indexOf('<<<<<<< Updated upstream');
const splitPoint = content.indexOf('=======');
const stashedEnd = content.indexOf('>>>>>>> Stashed changes');

if (upstreamStart === -1 || splitPoint === -1 || stashedEnd === -1) {
  console.log('Conflict markers not found');
  process.exit(1);
}

const beforeConflict = content.substring(0, upstreamStart);
const upstreamSection = content.substring(upstreamStart + '<<<<<<< Updated upstream\n'.length, splitPoint).trim();
const stashedSection = content.substring(splitPoint + '=======\n'.length, stashedEnd).trim();
const afterConflict = content.substring(stashedEnd + '>>>>>>> Stashed changes\n'.length);

// In UpstreamSection, locate the return statement.
const returnIndex = upstreamSection.indexOf('return (');
const upstreamFunctions = upstreamSection.substring(0, returnIndex);
const upstreamReturn = upstreamSection.substring(returnIndex);

// In UpstreamReturn, locate the '<section' which is the Guidelines.
const guidelinesIndex = upstreamReturn.indexOf('<section');
const guidelinesAndModals = upstreamReturn.substring(guidelinesIndex);

// In StashedSection, fix the button handlers (since the CSS refactor seemingly removed them or they weren't matched)
let fixedStashed = stashedSection;

// Xem button
fixedStashed = fixedStashed.replace(
  'aria-label={`Xem mẫu ${t.name}`} \n                >',
  'aria-label={`Xem mẫu ${t.name}`}\n                  onClick={(e) => { e.stopPropagation(); openTemplatePreview(t.name); }}\n                >'
);
// For the 2nd button (in grid)
fixedStashed = fixedStashed.replace(
  'aria-label={`Xem mẫu ${t.name}`}\n                >',
  'aria-label={`Xem mẫu ${t.name}`}\n                  onClick={(e) => { e.stopPropagation(); openTemplatePreview(t.name); }}\n                >'
);
// Fix all instances of Xem buttons more robustly:
fixedStashed = fixedStashed.replace(
  /className="tmpl-preview-btn([^>]+)>/g,
  'className="tmpl-preview-btn$1 onClick={(e) => { e.stopPropagation(); openTemplatePreview(t.name); }}>'
);
fixedStashed = fixedStashed.replace(
  /className="tmpl-use-btn([^>]+)>/g,
  'className="tmpl-use-btn$1 onClick={(e) => { e.stopPropagation(); openTemplatePreview(t.name); }}>'
);

// The bottom CTA has a button:
// aria-label="Tư vấn CV miễn phí"
// >
fixedStashed = fixedStashed.replace(
  /aria-label="Tư vấn CV miễn phí"[\s\n]*>/,
  'aria-label="Tư vấn CV miễn phí"\n          onClick={openCreateCvModal}\n        >'
);

// Note: stashedSection ends with </div>\n  );\n}
// We want to combine fixedStashed and throw guidelinesAndModals right before the last closing tags.
// Let's locate the last "    </div>\n  );\n}" in fixedStashed
let tailString = null;
if (fixedStashed.includes('    </div>\n  );\n}')) tailString = '    </div>\n  );\n}';
else if (fixedStashed.includes('    </div>\r\n  );\r\n}')) tailString = '    </div>\r\n  );\r\n}';
else if (fixedStashed.includes('    </div>\n  );')) tailString = '    </div>\n  );';

if (tailString) {
  fixedStashed = fixedStashed.replace(tailString, '      ' + guidelinesAndModals + '\n' + tailString);
} else {
  // Just append and hope
  fixedStashed = fixedStashed + '\n' + guidelinesAndModals;
}

const finalFile = beforeConflict + upstreamFunctions + fixedStashed + afterConflict;
fs.writeFileSync(file_path, finalFile, 'utf-8');
console.log('Successfully merged!');
