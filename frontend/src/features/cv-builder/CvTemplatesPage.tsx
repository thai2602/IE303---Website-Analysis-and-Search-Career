import { FileText, Sparkles, Eye, Download } from "lucide-react";

const templates = [
   {
      name: "CV Fresher",
      level: "0–1 năm kinh nghiệm",
      tag: "Phổ biến",
      tagColor: "#10b981",
      accent: "#10b981",
      preview: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
      lines: ["#34d399", "#6ee7b7", "#a7f3d0", "#34d399", "#6ee7b7"],
   },
   {
      name: "CV Chuyên viên",
      level: "2–5 năm kinh nghiệm",
      tag: "Chuyên nghiệp",
      tagColor: "#6366f1",
      accent: "#6366f1",
      preview: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%)",
      lines: ["#818cf8", "#a5b4fc", "#c7d2fe", "#818cf8", "#a5b4fc"],
   },
   {
      name: "CV Quản lý",
      level: "5+ năm kinh nghiệm",
      tag: "Leadership",
      tagColor: "#0ea5e9",
      accent: "#0ea5e9",
      preview: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #7dd3fc 100%)",
      lines: ["#38bdf8", "#7dd3fc", "#bae6fd", "#38bdf8", "#7dd3fc"],
   },
   {
      name: "CV Designer",
      level: "Mọi cấp độ",
      tag: "Creative",
      tagColor: "#ec4899",
      accent: "#ec4899",
      preview: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
      lines: ["#f472b6", "#f9a8d4", "#fbcfe8", "#f472b6", "#f9a8d4"],
   },
];

export default function CvTemplatesPage() {
   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-50px", right: "-30px", width: "220px", height: "220px",
               borderRadius: "50%", background: "rgba(196,181,253,0.2)", filter: "blur(40px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-40px", left: "30%", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(167,139,250,0.15)", filter: "blur(35px)",
            }} />
            <span style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               background: "rgba(196,181,253,0.25)", border: "1px solid rgba(196,181,253,0.4)",
               borderRadius: "999px", padding: "4px 14px", fontSize: "11px",
               color: "#ddd6fe", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
            }}>
               <FileText style={{ width: 11, height: 11 }} />
               40+ MẪU CV CHUẨN ATS
            </span>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Kho <span style={{ color: "#c4b5fd" }}>CV mẫu</span>
            </h1>
            <p style={{ color: "#c4b5fd", fontSize: "15px", lineHeight: 1.7 }}>
               Lựa chọn bộ mẫu CV theo ngành và cấp độ, có sẵn gợi ý nội dung để sửa nhanh.
            </p>
         </div>

         {/* Templates */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templates.map((t) => (
               <article key={t.name} style={{
                  background: "#fff", borderRadius: "20px",
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  cursor: "pointer",
               }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${t.accent}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
               >
                  {/* Preview area */}
                  <div style={{ position: "relative", background: t.preview, padding: "24px 20px", height: "160px" }}>
                     {/* Mini CV skeleton */}
                     <div style={{
                        background: "rgba(255,255,255,0.85)", borderRadius: "10px",
                        padding: "12px", backdropFilter: "blur(8px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                     }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                           <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: t.accent }} />
                           <div>
                              <div style={{ width: "60px", height: "5px", borderRadius: "99px", background: t.lines[0], marginBottom: "3px" }} />
                              <div style={{ width: "40px", height: "3px", borderRadius: "99px", background: t.lines[1] }} />
                           </div>
                        </div>
                        {t.lines.map((c, i) => (
                           <div key={i} style={{
                              height: "3px", borderRadius: "99px", background: c,
                              width: `${[100, 85, 75, 90, 60][i]}%`,
                              marginBottom: "4px", opacity: 0.6,
                           }} />
                        ))}
                     </div>
                     {/* Hover overlay */}
                     <div style={{
                        position: "absolute", inset: 0, background: `${t.accent}15`,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        opacity: 0, transition: "opacity 0.2s",
                     }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                     >
                        <button style={{
                           background: "#fff", borderRadius: "8px", padding: "6px 12px",
                           fontSize: "12px", fontWeight: 700, color: t.accent,
                           border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
                        }}>
                           <Eye style={{ width: 12, height: 12 }} /> Xem
                        </button>
                     </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "18px 20px" }}>
                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{t.name}</h3>
                        <span style={{
                           background: `${t.accent}18`, color: t.accent,
                           borderRadius: "999px", padding: "2px 8px", fontSize: "10px", fontWeight: 700,
                        }}>
                           {t.tag}
                        </span>
                     </div>
                     <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>{t.level}</p>
                     <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{
                           flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px",
                           background: t.accent, color: "#fff",
                           borderRadius: "10px", padding: "8px 12px",
                           fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer",
                           boxShadow: `0 4px 12px ${t.accent}35`,
                        }}>
                           <Sparkles style={{ width: 12, height: 12 }} /> Dùng mẫu
                        </button>
                        <button style={{
                           width: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center",
                           background: "#f8fafc", border: "1px solid #e2e8f0",
                           borderRadius: "10px", cursor: "pointer", color: "#64748b",
                        }}>
                           <Download style={{ width: 14, height: 14 }} />
                        </button>
                     </div>
                  </div>
               </article>
            ))}
         </div>

         {/* Bottom CTA */}
         <div style={{
            borderRadius: "16px", background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
            border: "1px solid #ddd6fe", padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
         }}>
            <div>
               <h4 style={{ fontSize: "17px", fontWeight: 800, color: "#4c1d95", marginBottom: "4px" }}>
                  Cần hỗ trợ tạo CV chuyên nghiệp?
               </h4>
               <p style={{ fontSize: "13px", color: "#7c3aed" }}>
                  Chuyên gia JobPilot sẽ giúp bạn tối ưu CV vượt qua ATS.
               </p>
            </div>
            <button style={{
               background: "#7c3aed", color: "#fff", borderRadius: "10px",
               padding: "10px 22px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
               boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
            }}>
               Tư vấn CV — Miễn phí
            </button>
         </div>
      </div>
   );
}