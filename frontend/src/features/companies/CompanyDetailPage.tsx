import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, MapPin, Star, Users, Wallet, Briefcase, ArrowUpRight, Check } from "lucide-react";
import { mockCompanies as companies } from "./mockCompanies";
import { companyAvatars, companyImages } from "./companyAssets";
import { generateSlug } from "../../utils/slug";

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

/**
 * Chuyển tên tiếng Việt thành slug ASCII chuẩn.
 * Ví dụ: "Công ty Cổ phần" → "cong-ty-co-phan"
 * Bước 1: Chuẩn hoá NFD để tách dấu ra khỏi ký tự gốc
 * Bước 2: Xử lý riêng 'đ' / 'Đ' vì chúng không tách được qua NFD
 * Bước 3: Strip toàn bộ combining diacritical marks (U+0300–U+036F)
 * Bước 4: Chỉ giữ lại a-z, 0-9, thay phần còn lại bằng '-'
 */
const normalizeName = (name: string) =>
   name
      .trim()
      .normalize("NFD")
      .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
      .replace(/[\u0300-\u036f]/g, "")
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
   "Môi trường làm chuyên nghiệp",
   "Chế độ đãi ngộ hấp dẫn",
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
   const navigate = useNavigate();
   const [company, setCompany] = useState<CompanyItem | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (!companySlug) {
         setIsLoading(false);
         return;
      }
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
      fetch(`${apiBase}/api/companies/${companySlug}`)
         .then((res) => {
            if (!res.ok) throw new Error("API error");
            return res.json();
         })
         .then((apiItem) => {
            const staticMatch = companies.find((c) => normalizeName(c.name) === normalizeName(apiItem.name));
            if (staticMatch) {
               setCompany({ ...staticMatch });
               return;
            }

            const benefitsArr = apiItem.benefits?.split(",").map((b: string) => b.trim()).filter(Boolean) ?? [];
            const mappedPositions = apiItem.positions?.map((pos: any) => ({
               id: pos.id,
               title: pos.title,
               salary: pos.salaryMin && pos.salaryMax ? `${pos.salaryMin} - ${pos.salaryMax} triệu` : "Thỏa thuận",
               workingHours: pos.jobType || "Toàn thời gian",
               description: pos.description || "Mô tả công việc đang được cập nhật.",
               skills: [pos.jobLevel || "Nhân viên", "Kinh nghiệm " + (pos.experienceYears || "1 năm")]
            })) || [];

            setCompany({
               name: apiItem.name,
               field: "Technology",
               rating: "4.5",
               employees: apiItem.size ?? "Đang cập nhật",
               location: "Việt Nam",
               openJobs: mappedPositions.length,
               color: apiItem.color || "#6366f1",
               bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
               initial: apiItem.name.charAt(0).toUpperCase(),
               description: apiItem.description ?? "Thông tin đang được cập nhật.",
               benefits: benefitsArr.length ? benefitsArr : ["Phúc lợi cạnh tranh"],
               positions: mappedPositions,
            } as CompanyItem);
         })
         .catch(() => {
            // Fallback to static
            const fallback = companies.find((item) => normalizeName(item.name) === companySlug);
            setCompany(fallback || null);
         })
         .finally(() => setIsLoading(false));
   }, [companySlug]);

   if (isLoading) {
      return (
         <div className="mx-auto max-w-4xl p-10 text-center">
            <p className="text-slate-500">Đang tải thông tin công ty...</p>
         </div>
      );
   }

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
                     <div className="space-y-4 md:max-w-[60%]">
                        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 border border-slate-200/50">
                           {selectedCompany.field}
                        </span>
                        <h1 className="text-4xl font-black text-slate-900">{selectedCompany.name}</h1>
                        <p className="max-w-3xl text-base leading-7 text-slate-650">{selectedCompany.description}</p>
                        <div className="flex flex-wrap gap-3">
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/60">
                              <Star className="h-4 w-4 text-amber-500" /> {selectedCompany.rating}/5
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/60">
                              <Users className="h-4 w-4 text-slate-500" /> {selectedCompany.employees}
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/60">
                              <MapPin className="h-4 w-4 text-slate-500" /> {selectedCompany.location}
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm border border-slate-200/60">
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

               <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                     <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-4">Phúc lợi</h3>
                     <div className="grid gap-3">
                        {selectedCompany.benefits.map((benefit) => (
                           <article key={benefit} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-2">
                              <div className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200">
                                 <Star className="h-5 w-5 text-amber-500" />
                              </div>
                              <div className="flex-1 text-sm text-slate-700 font-medium text-left">
                                 {benefit}
                              </div>
                           </article>
                        ))}
                     </div>
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-4">Điều khoản</h3>
                     <div className="grid gap-3">
                        {getDefaultTerms().map((term) => (
                           <article key={term} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-2">
                              <div className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200">
                                 <Check className="h-5 w-5 text-sky-600" />
                              </div>
                              <div className="flex-1 text-sm text-slate-700 font-medium text-left">{term}</div>
                           </article>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-6 mt-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black text-slate-950">Vị trí đang tuyển</h2>
                     <span className="text-[12.5px] font-extrabold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100/50">
                        {selectedCompany.positions.length} cơ hội mở
                     </span>
                  </div>
                  <div className="space-y-4">
                     {selectedCompany.positions.map((position) => {
                        const jobSlug = generateSlug(`${position.title} ${selectedCompany.name}`);
                        return (
                           <article
                              key={position.title}
                              onClick={() => navigate(`/tim-viec/${jobSlug}`)}
                              className="group relative bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                              style={{ borderLeft: `4px solid ${selectedCompany.color || '#6366f1'}` }}
                           >
                              <div className="space-y-3 flex-1 min-w-0">
                                 <div className="flex flex-wrap gap-2 items-center">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-transparent border border-indigo-100/40 px-2 py-0.5 rounded">
                                       <Briefcase className="w-3.5 h-3.5" /> {position.workingHours}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-transparent border border-emerald-100/40 px-2 py-0.5 rounded">
                                       <Wallet className="w-3.5 h-3.5" /> {position.salary}
                                    </span>
                                 </div>

                                 <h3 className="text-[17px] font-black text-slate-950 truncate group-hover:text-indigo-600 transition-colors">
                                    {position.title}
                                 </h3>

                                 <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2">
                                    {position.description}
                                 </p>

                                 <div className="flex flex-wrap gap-1.5 pt-1">
                                    {position.skills.map((skill) => (
                                       <span key={skill} className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                                          {skill}
                                       </span>
                                    ))}
                                 </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-3">
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       navigate(`/tim-viec/${jobSlug}`);
                                    }}
                                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-[12.5px] rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                    style={{ backgroundColor: selectedCompany.color }}
                                 >
                                    Xem chi tiết <ArrowUpRight className="w-4 h-4" />
                                 </button>
                              </div>
                           </article>
                        );
                     })}
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
