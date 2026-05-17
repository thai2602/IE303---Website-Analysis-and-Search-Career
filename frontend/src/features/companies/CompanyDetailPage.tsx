import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, Star, Users, Wallet } from "lucide-react";
import { companies, companyAvatars, companyImages } from "./CompaniesPage";

type CompanyPosition = {
   id?: number;
   title: string;
   salary: string;
   workingHours: string;
   description: string;
   skills: string[];
};

type CompanyItem = {
   name: string;
   field: string;
   rating: string;
   employees: string;
   location: string;
   openJobs: number;
   color: string;
   bg: string;
   initial: string;
   description: string;
   introduction?: string;
   benefits: string[];
   positions: CompanyPosition[];
   image?: string;
   companyImage?: string;
   contact?: {
      email: string;
      phone: string;
      website: string;
   };
   terms?: string[];
};

const normalizeName = (name: string) =>
   name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

const getDefaultContact = (companyName: string) => ({
   email: `contact@${normalizeName(companyName)}.com`,
   phone: "(+84) 28 1234 5678",
   website: `www.${normalizeName(companyName)}.com`,
});

const getDefaultTerms = () => [
   "Chính sách bảo mật thông tin",
   "Môi trường làm việc chuyên nghiệp",
   "Chế độ đãi ngộ cạnh tranh",
];

const getCompanyIntroduction = (company: CompanyItem) => {
   const introText = company.introduction?.trim() || company.description;
   const benefitText = company.benefits?.length ? `Phúc lợi nổi bật gồm: ${company.benefits.join(", ")}.` : "";
   const positionText = company.positions?.length
      ? `Hiện tại ${company.name} đang mở ${company.positions.length} vị trí trong lĩnh vực ${company.field}, phù hợp với ứng viên muốn phát triển sự nghiệp chuyên sâu.`
      : "";

   return [
      introText,
      `${company.name} có trụ sở tại ${company.location} và đội ngũ ${company.employees}.`,
      benefitText,
      positionText,
   ].filter(Boolean);
};

const mergeCompany = (company: CompanyItem) => {
   const contact = company.contact || getDefaultContact(company.name);
   const terms = company.terms?.length ? company.terms : getDefaultTerms();

   return {
      ...company,
      contact,
      terms,
   };
};

const getCompanyLogo = (company: CompanyItem) => {
   const index = companies.findIndex((item) => item.name === company.name);
   return companyAvatars[index >= 0 ? index % companyAvatars.length : 0];
};

const getCompanyImage = (company: CompanyItem) => {
   const index = companies.findIndex((item) => item.name === company.name);
   return company.companyImage ?? companyImages[index >= 0 ? index % companyImages.length : 0];
};

export default function CompanyDetailPage() {
   const { companySlug } = useParams<{ companySlug: string }>();
   const company = companySlug
      ? companies.find((item) => normalizeName(item.name) === companySlug)
      : null;

   if (!company) {
      return (
         <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900">Công ty không tìm thấy</h1>
            <p className="mt-4 text-slate-600">Vui lòng quay lại danh sách công ty để chọn lại.</p>
            <Link to="/cong-ty" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
               Quay lại trang công ty
            </Link>
         </div>
      );
   }

   const selectedCompany = mergeCompany(company);
   const selectedCompanyLogo = getCompanyLogo(selectedCompany);
   const selectedCompanyImage = getCompanyImage(selectedCompany);

   return (
      <div className="mx-auto max-w-6xl space-y-8">
         <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-lg">
            <div className="relative">
               <img src={selectedCompanyImage} alt={`${selectedCompany.name} hero`} className="h-72 w-full object-cover object-center" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
               <div className="p-8 relative z-10">
                  <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                     <div className="space-y-4 text-white md:max-w-[60%]">
                        <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                           {selectedCompany.field}
                        </span>
                        <h1 className="text-4xl font-black text-white">{selectedCompany.name}</h1>
                        <p className="max-w-3xl text-base leading-7 text-white/90">{selectedCompany.description}</p>
                        <div className="flex flex-wrap gap-3">
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                              <Star className="h-4 w-4 text-amber-500" /> {selectedCompany.rating}/5
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                              <Users className="h-4 w-4 text-slate-500" /> {selectedCompany.employees}
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                              <MapPin className="h-4 w-4 text-slate-500" /> {selectedCompany.location}
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                              <Building2 className="h-4 w-4 text-slate-500" /> {selectedCompany.positions.length} vị trí đang mở
                           </span>
                        </div>
                     </div>
                     <div className="flex items-start md:items-end">
                        <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                           <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden">
                                 <img src={selectedCompanyLogo} alt={`${selectedCompany.name} logo`} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Liên hệ</p>
                                 <p className="text-base font-semibold text-slate-900">{selectedCompany.contact?.email}</p>
                              </div>
                           </div>
                           <div className="space-y-2 text-sm text-slate-600">
                              <p>Điện thoại: {selectedCompany.contact?.phone}</p>
                              <p>Website: {selectedCompany.contact?.website}</p>
                           </div>
                           <Link to="/cong-ty" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                              Quay lại danh sách công ty
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <section className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
               <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-950">Giới thiệu công ty</h2>
                  {getCompanyIntroduction(selectedCompany).map((line, index) => (
                     <p key={index} className="text-slate-600 leading-7">{line}</p>
                  ))}
               </div>

               <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-6">
                     <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Phúc lợi</h3>
                     <ul className="mt-4 space-y-3 text-sm text-slate-700">
                        {selectedCompany.benefits.map((benefit) => (
                           <li key={benefit} className="flex items-start gap-3">
                              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">★</span>
                              <span>{benefit}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-6">
                     <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Điều khoản</h3>
                     <ul className="mt-4 space-y-3 text-sm text-slate-700">
                        {getDefaultTerms().map((term) => (
                           <li key={term} className="flex items-start gap-3">
                              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">✓</span>
                              <span>{term}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-950">Vị trí đang tuyển</h2>
                  <div className="space-y-4">
                     {selectedCompany.positions.map((position) => (
                        <article key={position.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                           <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                 <h3 className="text-xl font-semibold text-slate-950">{position.title}</h3>
                                 <p className="mt-2 text-sm text-slate-600">{position.description}</p>
                              </div>
                              <div className="space-y-2 text-right">
                                 <p className="font-semibold text-slate-900">{position.salary}</p>
                                 <p className="text-sm text-slate-500">{position.workingHours}</p>
                              </div>
                           </div>
                           <div className="mt-4 flex flex-wrap gap-2">
                              {position.skills.map((skill) => (
                                 <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </article>
                     ))}
                  </div>
               </div>
            </section>

            <aside className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
               <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-950">Thông tin công ty</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                     <p>
                        <span className="font-semibold text-slate-900">Lĩnh vực:</span> {selectedCompany.field}
                     </p>
                     <p>
                        <span className="font-semibold text-slate-900">Địa điểm:</span> {selectedCompany.location}
                     </p>
                     <p>
                        <span className="font-semibold text-slate-900">Nhân sự:</span> {selectedCompany.employees}
                     </p>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-950">Liên hệ nhanh</h3>
                  <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                     <p className="font-semibold text-slate-900">Email:</p>
                     <p>{selectedCompany.contact?.email}</p>
                     <p className="mt-4 font-semibold text-slate-900">Điện thoại:</p>
                     <p>{selectedCompany.contact?.phone}</p>
                     <p className="mt-4 font-semibold text-slate-900">Website:</p>
                     <p>{selectedCompany.contact?.website}</p>
                  </div>
               </div>

               <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
                  <div className="mb-4 flex items-center gap-3 text-slate-900">
                     <Wallet className="h-4 w-4" />
                     <span className="font-semibold">Thông báo</span>
                  </div>
                  <p>Trang này hiển thị thông tin chi tiết và các vị trí tuyển dụng của công ty.</p>
               </div>
            </aside>
         </div>
      </div>
   );
}
