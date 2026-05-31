import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateSlug } from "../../utils/slug";
import { Clock3, MapPin, Wallet, Search, Flame, Bookmark, X, Building2, CalendarClock, Trash2, SlidersHorizontal, Briefcase, Award, CheckCircle2, History } from "lucide-react";
import image1 from "../../assets/company_logo/image_1.png";
import image2 from "../../assets/company_logo/image_2.png";
import image3 from "../../assets/company_logo/image_3.png";
import { companies as companiesCatalog } from "../companies/CompaniesPage";
import { readAuthUser } from "../../utils/auth";
import { getApplicationStatusMeta } from "../../utils/application";
import { hasCreatedCv } from "../../utils/cv";
import { toVietnameseJobTitle } from "../../utils/jobTitle";

type Job = {
   title: string;
   company: string;
   companyColor: string;
   companyDescription: string;
   description: string;
   place: string;
   field: string;
   type: string;
   salary: string;
   tags: string[];
   hot: boolean;
   posted: string;
   image: string;
   companyUrl: string;
   slug?: string;
   requirements?: string;
   benefits?: string;
   jobLevel?: string;
   experienceYears?: string;
   expiredAt?: string;
   locationAddress?: string;
};

const jobs: Job[] = [
   {
      title: "Frontend React Developer",
      company: "NovaTech",
      companyColor: "#6366f1",
      companyDescription: "NovaTech là công ty công nghệ hàng đầu, chuyên phát triển phần mềm và giải pháp số cho doanh nghiệp.",
      description: "Phát triển giao diện người dùng với React, TypeScript và Figma. Tham gia vào các dự án web hiện đại.",
      place: "TP. HCM",
      field: "Công nghệ thông tin",
      type: "Full-time",
      salary: "25–35 triệu",
      tags: ["React", "TypeScript", "Figma"],
      hot: true,
      posted: "2 ngày trước",
      image: image1,
      companyUrl: "/cong-ty",
   },
   {
      title: "UI/UX Designer",
      company: "BluePixel",
      companyColor: "#ec4899",
      companyDescription: "BluePixel chuyên thiết kế trải nghiệm người dùng sáng tạo và giải pháp thiết kế đồ họa.",
      description: "Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng di động và web. Sử dụng Figma và prototyping.",
      place: "Hà Nội",
      field: "Công nghệ thông tin",
      type: "Hybrid",
      salary: "18–28 triệu",
      tags: ["Figma", "Prototyping", "User Research"],
      hot: false,
      posted: "1 ngày trước",
      image: image2,
      companyUrl: "/cong-ty",
   },
   {
      title: "Backend Node.js Engineer",
      company: "ScaleHub",
      companyColor: "#f59e0b",
      companyDescription: "ScaleHub cung cấp dịch vụ đám mây và hạ tầng kỹ thuật cho các doanh nghiệp quy mô lớn.",
      description: "Xây dựng hệ thống backend với Node.js, MongoDB và Docker. Đảm bảo hiệu suất và bảo mật.",
      place: "Đà Nẵng",
      field: "Công nghệ thông tin",
      type: "Remote",
      salary: "30–45 triệu",
      tags: ["Node.js", "MongoDB", "Docker"],
      hot: true,
      posted: "Hôm nay",
      image: image3,
      companyUrl: "/cong-ty",
   },
   {
      title: "Chuyên viên Digital Marketing",
      company: "GrowthBee",
      companyColor: "#14b8a6",
      companyDescription: "GrowthBee tập trung vào tăng trưởng thương hiệu thông qua dữ liệu và performance marketing.",
      description: "Xây dựng chiến dịch quảng cáo đa kênh, tối ưu chuyển đổi và báo cáo hiệu quả theo tuần.",
      place: "TP. HCM",
      field: "Marketing/Quảng cáo",
      type: "Full-time",
      salary: "18–30 triệu",
      tags: ["Google Ads", "Meta Ads", "GA4"],
      hot: false,
      posted: "3 ngày trước",
      image: image2,
      companyUrl: "/cong-ty",
   },
   {
      title: "Nhân viên kinh doanh B2B",
      company: "SaleSphere",
      companyColor: "#0ea5e9",
      companyDescription: "SaleSphere là nền tảng hỗ trợ bán hàng B2B cho doanh nghiệp vừa và nhỏ.",
      description: "Tìm kiếm khách hàng doanh nghiệp, tư vấn giải pháp và chốt hợp đồng theo chỉ tiêu tháng.",
      place: "Hà Nội",
      field: "Kinh doanh/Bán hàng",
      type: "Full-time",
      salary: "15–25 triệu",
      tags: ["Tư vấn", "Đàm phán", "CRM"],
      hot: true,
      posted: "Hôm qua",
      image: image1,
      companyUrl: "/cong-ty",
   },
   {
      title: "Kế toán tổng hợp",
      company: "Finverse",
      companyColor: "#f59e0b",
      companyDescription: "Finverse cung cấp dịch vụ tài chính số và quản lý tài sản cá nhân.",
      description: "Theo dõi dòng tiền, lập báo cáo tài chính và phối hợp với kiểm toán nội bộ.",
      place: "Đà Nẵng",
      field: "Kế toán",
      type: "Hybrid",
      salary: "15–25 triệu",
      tags: ["Excel", "MISA", "Thuế"],
      hot: false,
      posted: "4 ngày trước",
      image: image3,
      companyUrl: "/cong-ty",
   },
];

const levelMap: Record<string, string> = {
   FRESHER: "Fresher",
   JUNIOR: "Junior",
   SENIOR: "Senior",
   LEADER: "Leader",
   DIRECTOR: "Giám đốc",
};

const fallbackImages = [image1, image2, image3];

const fieldNameMap: Record<string, string> = {
   "Technology": "Công nghệ thông tin",
   "Ecommerce": "Kinh doanh/Bán hàng",
   "Healthcare": "Nhóm ngành khác",
   "Finance": "Tài chính/Ngân hàng",
   "Design": "Marketing/Quảng cáo",
   "Education": "Nhóm ngành khác",
   "Gaming": "Công nghệ thông tin",
   "Logistics": "Logistics/Kho vận",
   "Manufacturing": "Lao động phổ thông",
   "Consulting": "Kinh doanh/Bán hàng",
   "Real Estate": "Bất động sản",
   "Automotive": "Tài xế",
   "Food & Beverage": "Lao động phổ thông",
   "Travel": "Tài xế",
   "Energy": "Xây dựng",
   "Fashion": "Marketing/Quảng cáo",
   "Agriculture": "Lao động phổ thông",
};

const toVietnameseField = (field: string) => fieldNameMap[field] ?? "Nhóm ngành khác";

const seedJobsFromKnownCompanies: Job[] = jobs
   .filter((job) => companiesCatalog.some((company) => company.name === job.company))
   .map((job) => ({ ...job, title: toVietnameseJobTitle(job.title), field: toVietnameseField(job.field) }));

const companyJobsFromCatalog: Job[] = companiesCatalog.flatMap((company, companyIndex) => {
   const displayField = toVietnameseField(company.field);

   return company.positions.map((position, positionIndex) => ({
      title: toVietnameseJobTitle(position.title),
      company: company.name,
      companyColor: company.color,
      companyDescription: company.description,
      description: position.description,
      place: company.location,
      field: displayField,
      type: positionIndex % 3 === 0 ? "Full-time" : positionIndex % 3 === 1 ? "Hybrid" : "Remote",
      salary: position.salary,
      tags: position.skills,
      hot: positionIndex === 0,
      posted: "Mới cập nhật",
      image: fallbackImages[companyIndex % fallbackImages.length],
      companyUrl: "/cong-ty",
   }));
});

export const companyJobs: Job[] = [
   ...seedJobsFromKnownCompanies,
   ...companyJobsFromCatalog,
].filter((job, index, list) => list.findIndex((item) => item.company === job.company && item.title === job.title) === index);

const hiringPromotions = [
   {
      title: "Tuần lễ tuyển dụng IT 2026",
      subtitle: "200+ vị trí Frontend, Backend, Product",
      description: "Kết nối trực tiếp với nhà tuyển dụng công nghệ lớn, phỏng vấn nhanh trong 24h và nhận phản hồi hồ sơ ngay trong sự kiện. Ứng viên còn được tư vấn định hướng nghề nghiệp, chuẩn hóa CV theo từng vị trí và tham gia phiên hỏi đáp cùng các trưởng nhóm kỹ thuật.",
      cta: "Khám phá sự kiện",
      accent: "from-indigo-600 to-violet-600",
      accentBorder: "border-indigo-100",
      textAccent: "text-indigo-600",
   },
   {
      title: "Top công ty hybrid linh hoạt",
      subtitle: "Mô hình làm việc 2-3 ngày tại văn phòng",
      description: "Danh sách doanh nghiệp có chính sách hybrid rõ ràng, phù hợp ứng viên trẻ muốn cân bằng hiệu suất và trải nghiệm cá nhân. Mỗi tin tuyển dụng đi kèm thông tin về thời gian làm việc, phúc lợi và lộ trình tăng trưởng trong 6-12 tháng. Đây có lẽ sẽ là xu hướng làm việc chính trong năm 2026.",
      cta: "Xem danh sách",
      accent: "from-emerald-600 to-teal-600",
      accentBorder: "border-emerald-100",
      textAccent: "text-emerald-600",
   },
   {
      title: "Mega Career Fair tháng 5",
      subtitle: "Workshop CV + phỏng vấn thử miễn phí",
      description: "Được review CV 1-1 bởi recruiter, tham gia chuỗi mini talk kỹ năng nghề nghiệp và thực hành phỏng vấn thử với bộ câu hỏi bám sát nhu cầu doanh nghiệp. Sự kiện ưu tiên các vị trí IT, Marketing, Sales và nhóm công việc đang tăng trưởng mạnh.",
      cta: "Đăng ký ngay",
      accent: "from-pink-600 to-rose-600",
      accentBorder: "border-pink-100",
      textAccent: "text-pink-600",
   },
];

const jobArticles = [
   {
      title: "5 cách tối ưu CV cho vị trí Frontend React Developer",
      category: "CV & Portfolio",
      readTime: "8 phút đọc",
      summary: "Các mục cần nhấn mạnh trong CV công nghệ để tăng tỉ lệ qua vòng lọc hồ sơ, từ cấu trúc dự án đến cách mô tả impact bằng số liệu. Bài viết kèm ví dụ thực tế cho Fresher và Mid-level.",
      image: image1,
   },
   {
      title: "Checklist chuẩn bị phỏng vấn cho ứng viên trái ngành",
      category: "Phỏng vấn",
      readTime: "6 phút đọc",
      summary: "Danh sách các câu hỏi thường gặp và cách trả lời thuyết phục với recruiter, đặc biệt cho ứng viên chuyển ngành. Có mẫu câu trả lời STAR, checklist luyện tập và lỗi cần tránh trước vòng phỏng vấn cuối.",
      image: image2,
   },
   {
      title: "Xu hướng lương ngành IT, Marketing, Sales năm 2026",
      category: "Báo cáo thị trường",
      readTime: "10 phút đọc",
      summary: "Tổng hợp mức lương theo vị trí và kinh nghiệm tại các thành phố lớn, bao gồm biên độ lương theo cấp bậc và kỹ năng. Dữ liệu cập nhật theo nhóm ngành để bạn đặt kỳ vọng đàm phán phù hợp hơn.",
      image: image3,
   },
];

export default function JobsPage() {
   const navigate = useNavigate();
   const [applications, setApplications] = useState<any[]>([]);
   const [savedJobs, setSavedJobs] = useState<any[]>([]);
   const [showTray, setShowTray] = useState(false);
   const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);

   // --- API jobs state ---
   const [apiJobs, setApiJobs] = useState<Job[]>([]);

   // --- Filters State ---
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
   const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
   const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

   // Fetch công việc từ API, fallback về data tĩnh nếu thất bại
   useEffect(() => {
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
      fetch(`${apiBase}/api/jobs`)
         .then((res) => {
            if (!res.ok) throw new Error("API error");
            return res.json() as Promise<Array<{
               id: number; title: string; slug: string;
               company: { name: string; color: string; description: string; logoUrl?: string; slug?: string };
               jobType: string; jobLevel?: string; experienceYears?: string;
               locationCity: string; locationAddress?: string;
               description: string; requirements?: string; benefits?: string;
               salaryMin: number; salaryMax: number; expiredAt?: string;
            }>>;
         })
         .then((apiData) => {
            if (!apiData || apiData.length === 0) {
               setApiJobs(companyJobs);
               return;
            }
            const mapped: Job[] = apiData.map((apiItem) => ({
               title: apiItem.title,
               company: apiItem.company.name,
               companyColor: apiItem.company.color || "#0ea5e9",
               companyDescription: apiItem.company.description || "",
               description: apiItem.description,
               requirements: apiItem.requirements,
               benefits: apiItem.benefits,
               place: apiItem.locationCity,
               locationAddress: apiItem.locationAddress,
               field: toVietnameseField(apiItem.title), // Phân loại tự động dựa trên tiêu đề
               type: apiItem.jobType === "FULL_TIME" ? "Full-time" : apiItem.jobType === "REMOTE" ? "Remote" : "Hybrid",
               salary: `${Math.round((apiItem.salaryMin ?? 0) / 1_000_000)}–${Math.round((apiItem.salaryMax ?? 0) / 1_000_000)} triệu`,
               tags: [
                  apiItem.jobLevel ? (levelMap[apiItem.jobLevel] ?? apiItem.jobLevel) : null,
                  apiItem.experienceYears ? `${apiItem.experienceYears} năm KN` : null,
                  apiItem.locationCity || null,
               ].filter((t): t is string => Boolean(t)),
               hot: false,
               posted: "Vừa cập nhật",
               image: apiItem.company.logoUrl || image1,
               companyUrl: `/cong-ty/${apiItem.company.slug ?? ""}`,
               slug: apiItem.slug,
               jobLevel: apiItem.jobLevel,
               experienceYears: apiItem.experienceYears,
               expiredAt: apiItem.expiredAt,
            }));
            setApiJobs(mapped);
         })
         .catch(() => {
            setApiJobs([]);
         })
         .finally(() => {});
   }, []);

   const rawJobsList = apiJobs;

   // --- Instant Filter Logic ---
   const filteredJobs = rawJobsList.filter(job => {
      // 1. Search term match (title, company, description, tags)
      const matchesSearch = searchTerm.trim() === "" ||
         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Location match
      const matchesLocation = !selectedLocation || 
         job.place.toLowerCase().includes(selectedLocation.toLowerCase());

      // 3. Job Type match
      const matchesJobType = !selectedJobType || 
         job.type.toLowerCase() === selectedJobType.toLowerCase();

      // 4. Job Level match
      const matchesLevel = !selectedLevel || 
         job.tags.some(tag => tag.toLowerCase().includes(selectedLevel.toLowerCase())) ||
         (job.jobLevel && job.jobLevel.toLowerCase() === selectedLevel.toLowerCase());

      return matchesSearch && matchesLocation && matchesJobType && matchesLevel;
   });

   useEffect(() => {
      const savedApplications = localStorage.getItem("jobpilot_applications");
      const savedSavedJobs = localStorage.getItem("jobpilot_saved_jobs");
      if (savedApplications) {
         const parsed = JSON.parse(savedApplications);
         setApplications(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
      }
      if (savedSavedJobs) {
         const parsed = JSON.parse(savedSavedJobs);
         setSavedJobs(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
      }
   }, []);

   useEffect(() => {
      localStorage.setItem("jobpilot_applications", JSON.stringify(applications));
   }, [applications]);

   useEffect(() => {
      localStorage.setItem("jobpilot_saved_jobs", JSON.stringify(savedJobs));
   }, [savedJobs]);

   useEffect(() => {
      if (!toast) return;
      const timeoutId = window.setTimeout(() => setToast(null), 2600);
      return () => window.clearTimeout(timeoutId);
   }, [toast]);

   const showToast = (message: string, kind: "success" | "error" = "success") => {
      setToast({ message, kind });
   };

   const addApplication = (job: any, e: React.MouseEvent) => {
      e.stopPropagation(); // Ngăn chặn chuyển trang khi click button
      if (!readAuthUser()) {
         showToast("Bạn cần đăng nhập trước khi ứng tuyển.", "error");
         return;
      }

      if (!hasCreatedCv()) {
         showToast("Bạn chưa có CV. Vui lòng tạo CV trước khi ứng tuyển.", "error");
         return;
      }

      if (applications.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Bạn đã ứng tuyển vị trí này rồi.", "error");
         return;
      }

      const id = `${job.company}-${job.title}-${Date.now()}`;
      setApplications([
         {
            ...job,
            id,
            appliedAt: new Date().toLocaleString("vi-VN"),
            status: "Đang chờ xác nhận",
            trackingNote: "Hồ sơ đã được ghi nhận và đang đợi nhà tuyển dụng phản hồi.",
         },
         ...applications,
      ]);
      showToast(`Đã ứng tuyển thành công: ${job.title} tại ${job.company}.`);
   };

   const addSavedJob = (job: any, e: React.MouseEvent) => {
      e.stopPropagation(); // Ngăn chặn chuyển trang
      if (savedJobs.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Công việc này đã có trong mục đã lưu.", "error");
         return;
      }
      const id = `${job.company}-${job.title}-${Date.now()}`;
      setSavedJobs([{ ...job, id, savedAt: new Date().toLocaleString("vi-VN") }, ...savedJobs]);
      showToast(`Đã lưu công việc: ${job.title} tại ${job.company}.`);
   };

   const removeApplication = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setApplications((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa hồ sơ ứng tuyển.");
   };

   const removeSavedJob = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSavedJobs((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa mục đã lưu.");
   };

   const clearFilters = () => {
      setSearchTerm("");
      setSelectedLocation(null);
      setSelectedJobType(null);
      setSelectedLevel(null);
   };

   const hasFiltersActive = searchTerm || selectedLocation || selectedJobType || selectedLevel;

   return (
      <div className="space-y-10 pb-16">
         {/* Toast Notification */}
         {toast && (
            <div className={`fixed bottom-6 right-6 z-[2000] px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up border transition-all ${
               toast.kind === "success" 
                  ? "bg-slate-900 border-slate-800 text-white" 
                  : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
               <CheckCircle2 className={`w-5 h-5 shrink-0 ${toast.kind === "success" ? "text-emerald-400" : "text-rose-500"}`} />
               <span className="text-[13.5px] font-bold">{toast.message}</span>
            </div>
         )}

         {/* ── Hero Banner Section (Glassmorphism & Rich Gradient) ── */}
         <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/70 to-slate-950 px-6 sm:px-12 py-16 sm:py-20 shadow-[0_28px_80px_rgba(4,120,87,0.15)] border border-emerald-900/30">
            {/* Blurry abstract glow items */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative max-w-4xl mx-auto text-center space-y-6">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-extrabold tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Xu hướng tuyển dụng 2026
               </span>
               <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Khám phá cơ hội nghề nghiệp <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">bứt phá tương lai</span>
               </h1>
               <p className="text-[14px] sm:text-[16px] text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                  Kết nối trực tiếp cùng các nhà tuyển dụng hàng đầu. Sử dụng bộ lọc thông minh tức thì và ứng tuyển siêu tốc chỉ với một cú click chuột.
               </p>

               {/* Search Bar */}
               <div className="pt-4 max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                     <div className="flex-1 flex items-center gap-3 px-3 py-2">
                        <Search className="w-5 h-5 text-emerald-400 shrink-0" />
                        <input
                           type="text"
                           placeholder="Nhập vị trí, công ty hoặc từ khóa kỹ năng (VD: React, Node...)"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="bg-transparent border-none outline-none text-white text-[14.5px] w-full placeholder:text-slate-400 font-medium"
                        />
                        {searchTerm && (
                           <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                              <X className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                     <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[14px] rounded-xl transition-all shadow-[0_12px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_16px_32px_rgba(16,185,129,0.35)] active:scale-95 cursor-pointer shrink-0">
                        Tìm kiếm ngay
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* ── Main Layout: Filters sidebar + Jobs List grid ── */}
         <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            
            {/* 1. Left Sidebar: Interactive Filters */}
            <aside className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-8 z-10">
               <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-black text-slate-900 flex items-center gap-2">
                     <SlidersHorizontal className="w-4.5 h-4.5 text-slate-500" /> Bộ lọc thông minh
                  </h2>
                  {hasFiltersActive && (
                     <button 
                        onClick={clearFilters}
                        className="text-[11.5px] font-extrabold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                     >
                        Xóa tất cả
                     </button>
                  )}
               </div>

               <hr className="border-slate-100" />

               {/* Filter Location */}
               <div className="space-y-3">
                  <h3 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider">Địa điểm làm việc</h3>
                  <div className="flex flex-col gap-1.5">
                     {["TP. HCM", "Hà Nội", "Đà Nẵng", "Remote"].map(loc => {
                        const active = selectedLocation === loc;
                        return (
                           <button
                              key={loc}
                              type="button"
                              onClick={() => setSelectedLocation(active ? null : loc)}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-left transition-all duration-300 cursor-pointer flex items-center justify-between border bg-white ${
                                 active 
                                    ? "border-slate-900 -translate-y-1 shadow-[0_12px_24px_rgba(0,0,0,0.06)] scale-[1.02] border-2 text-slate-900" 
                                    : "border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-sm"
                              }`}
                           >
                              <span>{loc}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />}
                           </button>
                        );
                     })}
                  </div>
               </div>

               <hr className="border-slate-100" />

               {/* Filter Job Type */}
               <div className="space-y-3">
                  <h3 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider">Hình thức làm việc</h3>
                  <div className="flex flex-col gap-1.5">
                     {["Full-time", "Hybrid", "Remote"].map(type => {
                        const active = selectedJobType === type;
                        return (
                           <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedJobType(active ? null : type)}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-left transition-all duration-300 cursor-pointer flex items-center justify-between border bg-white ${
                                 active 
                                    ? "border-slate-900 -translate-y-1 shadow-[0_12px_24px_rgba(0,0,0,0.06)] scale-[1.02] border-2 text-slate-900" 
                                    : "border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-sm"
                              }`}
                           >
                              <span>{type}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />}
                           </button>
                        );
                     })}
                  </div>
               </div>

               <hr className="border-slate-100" />

               {/* Filter Level */}
               <div className="space-y-3">
                  <h3 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider">Cấp bậc yêu cầu</h3>
                  <div className="flex flex-col gap-1.5">
                     {Object.entries(levelMap).map(([key, label]) => {
                        const active = selectedLevel === key;
                        return (
                           <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedLevel(active ? null : key)}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] font-bold text-left transition-all duration-300 cursor-pointer flex items-center justify-between border bg-white ${
                                 active 
                                    ? "border-slate-900 -translate-y-1 shadow-[0_12px_24px_rgba(0,0,0,0.06)] scale-[1.02] border-2 text-slate-900" 
                                    : "border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-sm"
                              }`}
                           >
                              <span>{label}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />}
                           </button>
                        );
                     })}
                  </div>
               </div>
            </aside>

            {/* 2. Right: Jobs List Rendering */}
            <main className="space-y-6">
               <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
                  <p className="text-[13.5px] font-bold text-slate-500">
                     Tìm thấy <span className="text-slate-900 font-extrabold">{filteredJobs.length}</span> vị trí phù hợp
                  </p>
                  {hasFiltersActive && (
                     <span className="text-[12px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                        Bộ lọc đang hoạt động
                     </span>
                  )}
               </div>

               <div className="flex flex-col gap-4">
                  {filteredJobs.length === 0 ? (
                     <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl space-y-4">
                        <Briefcase className="w-16 h-16 text-slate-200 mx-auto" />
                        <h3 className="text-lg font-extrabold text-slate-800">Không tìm thấy công việc phù hợp</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                           Hãy thử thay đổi từ khóa tìm kiếm hoặc tắt bớt các điều kiện lọc để tiếp cận nhiều cơ hội việc làm hơn.
                        </p>
                        <button 
                           onClick={clearFilters}
                           className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[13px] font-bold transition-all active:scale-95 cursor-pointer"
                        >
                           Xóa bộ lọc để thử lại
                        </button>
                     </div>
                  ) : (
                     filteredJobs.map((job) => {
                        const jobSlug = job.slug ?? generateSlug(`${job.title} ${job.company}`);
                        const isSaved = savedJobs.some((item) => item.company === job.company && item.title === job.title);

                        return (
                           <article
                              key={`${job.title}-${job.company}`}
                              onClick={() => navigate(`/tim-viec/${jobSlug}`, { state: { job, relatedJobs: rawJobsList.filter((j) => j.title !== job.title || j.company !== job.company).slice(0, 3) } })}
                              className="group relative bg-white border border-slate-100 rounded-[24px] p-5 sm:p-6 shadow-sm hover:border-emerald-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                           >
                              {/* Company Logo wrapper with dynamic color border */}
                              <div 
                                 className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2.5 shrink-0 transition-all duration-300 group-hover:scale-105"
                                 style={{ borderLeft: `4px solid ${job.companyColor}` }}
                              >
                                 <img src={job.image} className="w-full h-full object-contain" alt={job.company} />
                              </div>

                              {/* Core Content */}
                              <div className="flex-1 min-w-0 space-y-2">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors">{job.company}</span>
                                    {job.hot && (
                                       <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600 text-[9.5px] font-extrabold uppercase">
                                          <Flame className="w-3 h-3 text-amber-500" /> Hot
                                       </span>
                                    )}
                                 </div>
                                 <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors truncate">
                                    {job.title}
                                 </h3>
                                 
                                 {/* Badges / Tags metadata */}
                                 <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/50 text-[11.5px] font-bold">
                                       <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.place}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/50 text-[11.5px] font-bold">
                                       <Wallet className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/50 text-[11.5px] font-bold">
                                       <Clock3 className="w-3.5 h-3.5 text-slate-400" /> {job.type}
                                    </span>
                                    
                                    {/* Tech Tag highlights */}
                                    {job.tags.slice(0, 3).map((tag, tIdx) => (
                                       <span key={tIdx} className="inline-flex items-center px-3 py-1 rounded-xl bg-emerald-50/50 text-emerald-700 border border-emerald-100/60 text-[11px] font-extrabold uppercase">
                                          {tag}
                                       </span>
                                    ))}
                                 </div>
                              </div>

                              {/* Call to Actions (CTA) */}
                              <div className="w-full sm:w-auto shrink-0 flex sm:flex-col gap-2.5 items-center sm:items-end justify-between border-t border-slate-50 sm:border-t-0 pt-4 sm:pt-0">
                                 <span className="text-[11.5px] font-bold text-slate-400">{job.posted}</span>
                                 <div className="flex items-center gap-2">
                                    <button 
                                       onClick={(e) => addSavedJob(job, e)}
                                       className={`p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                                          isSaved 
                                             ? "bg-rose-50 border-rose-100 text-rose-500 shadow-sm" 
                                             : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                                       }`}
                                       title={isSaved ? "Bỏ lưu tin" : "Lưu tin tuyển dụng"}
                                    >
                                       <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                                    </button>
                                    <button 
                                       onClick={(e) => addApplication(job, e)}
                                       className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[13.5px] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                                    >
                                       Ứng tuyển
                                    </button>
                                 </div>
                              </div>
                           </article>
                        );
                     })
                  )}
               </div>
            </main>
         </div>

         {/* ── Hiring Promotions Grid (Tailwind Styled) ── */}
         <section className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-inner space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
               <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-emerald-500" /> Quảng cáo tuyển dụng nổi bật
               </h2>
               <span className="text-[12.5px] text-slate-400 font-extrabold uppercase tracking-wider">Đối tác tin cậy của JobPilot</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {hiringPromotions.map((promo) => (
                  <article key={promo.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-emerald-500/20 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                     <div className="space-y-3">
                        <span className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded bg-slate-50 border border-slate-200/50 tracking-wider uppercase ${promo.textAccent}`}>
                           SPONSORED
                        </span>
                        <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors pt-2">{promo.title}</h3>
                        <p className="text-[13px] text-slate-700 font-extrabold">{promo.subtitle}</p>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{promo.description}</p>
                     </div>
                     <button 
                        onClick={() => {
                           if (promo.title.toLowerCase().includes("it")) {
                              setSearchTerm("React");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              showToast("Đã lọc các vị trí IT / React Developer nổi bật!");
                           } else if (promo.title.toLowerCase().includes("hybrid")) {
                              setSelectedJobType("Hybrid");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              showToast("Đã lọc các công việc có chính sách Hybrid!");
                           } else if (promo.title.toLowerCase().includes("mega")) {
                              showToast("Đăng ký Mega Career Fair thành công! Vé tham dự đã được gửi vào email của bạn.");
                           }
                        }}
                        className={`mt-6 w-full py-3 bg-gradient-to-r ${promo.accent} text-white font-extrabold text-[13px] rounded-xl hover:opacity-90 shadow-md active:scale-95 cursor-pointer transition-all`}
                     >
                        {promo.cta}
                     </button>
                  </article>
               ))}
            </div>
         </section>

         {/* ── Related Job Articles Grid ── */}
         <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
               <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <CalendarClock className="w-6 h-6 text-slate-500" /> Bài viết cẩm nang sự nghiệp
               </h2>
                <Link to="/cam-nang" className="text-[13px] font-extrabold text-sky-600 hover:text-sky-700 hover:underline">Xem tất cả bài viết ↗</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {jobArticles.map((article) => (
                  <article key={article.title} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group">
                     <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute top-4 left-4 text-[10.5px] font-extrabold bg-sky-50 border border-sky-100 text-sky-600 px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                           {article.category}
                        </span>
                     </div>
                     <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                           <span className="text-[11px] text-slate-400 font-bold">{article.readTime}</span>
                           <h3 className="text-[15.5px] font-black text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">{article.title}</h3>
                           <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{article.summary}</p>
                        </div>
                     </div>
                  </article>
               ))}
            </div>
         </section>

         {/* ── Floating History & Saved Drawer Toggle ── */}
         <button 
            onClick={() => setShowTray(true)}
            className="fixed bottom-6 left-6 z-[1000] px-5 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 font-bold text-[13.5px]"
         >
            <History className="w-5 h-5 text-emerald-400" />
            <span>Lịch sử & Đã lưu ({applications.length + savedJobs.length})</span>
         </button>

         {/* Drawer Overlay & Content */}
         {showTray && (
            <>
               <div 
                  onClick={() => setShowTray(false)}
                  className="fixed inset-0 z-[1500] bg-slate-950/40 backdrop-blur-sm transition-all"
               />
               <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] z-[1600] bg-white border-l border-slate-100 shadow-[0_0_60px_rgba(0,0,0,0.1)] flex flex-col justify-between animate-slide-left">
                  {/* Drawer Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
                     <div className="flex items-center gap-2.5">
                        <History className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-black text-slate-900">Thông tin cá nhân & Đã lưu</h3>
                     </div>
                     <button 
                        onClick={() => setShowTray(false)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                     >
                        <X className="w-4.5 h-4.5" />
                     </button>
                  </div>

                  {/* Drawer Scrollable Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                     
                     {/* 1. Applied Applications */}
                     <div className="space-y-4">
                        <h4 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                           <span>Hồ sơ đã ứng tuyển</span>
                           <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold">{applications.length}</span>
                        </h4>
                        
                        {applications.length === 0 ? (
                           <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-[13px] font-medium leading-relaxed">
                              Bạn chưa nộp hồ sơ vào vị trí nào.<br />Hãy chọn một công việc hấp dẫn để ứng tuyển ngay!
                           </div>
                        ) : (
                           <div className="space-y-4">
                              {applications.map((app) => {
                                 const statusMeta = getApplicationStatusMeta(app.status);
                                 return (
                                    <div key={app.id} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 space-y-3 relative group">
                                       <button 
                                          onClick={(e) => removeApplication(app.id, e)}
                                          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                          title="Xóa lịch sử"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                       <div className="flex justify-between items-start pr-6">
                                          <div className="space-y-1">
                                             <h5 className="font-extrabold text-[14.5px] text-slate-900 leading-snug">{toVietnameseJobTitle(app.title)}</h5>
                                             <p className="text-[12px] text-slate-500 font-bold flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.company}</p>
                                          </div>
                                       </div>
                                       <div className="flex flex-wrap gap-2">
                                          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-100">{app.place}</span>
                                          <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">{app.type}</span>
                                          <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase border border-amber-100">{statusMeta.label}</span>
                                       </div>
                                       <p className="text-[11.5px] text-slate-400 font-semibold flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> Nộp lúc {app.appliedAt}</p>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                     <hr className="border-slate-100" />

                     {/* 2. Saved Jobs */}
                     <div className="space-y-4">
                        <h4 className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                           <span>Tin tuyển dụng đã lưu</span>
                           <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold">{savedJobs.length}</span>
                        </h4>

                        {savedJobs.length === 0 ? (
                           <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-[13px] font-medium leading-relaxed">
                              Chưa có tin tuyển dụng nào được lưu.
                           </div>
                        ) : (
                           <div className="space-y-4">
                              {savedJobs.map((job) => (
                                 <div 
                                    key={job.id} 
                                    onClick={() => { setShowTray(false); navigate(`/tim-viec/${job.slug ?? generateSlug(`${job.title} ${job.company}`)}`, { state: { job, relatedJobs: rawJobsList.filter((j) => j.title !== job.title || j.company !== job.company).slice(0, 3) } }) }}
                                    className="bg-slate-50/50 border border-slate-200/60 hover:border-indigo-200/80 rounded-2xl p-4.5 space-y-3 relative group cursor-pointer transition-all"
                                 >
                                    <button 
                                       onClick={(e) => removeSavedJob(job.id, e)}
                                       className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                       title="Xóa lưu tin"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="flex justify-between items-start pr-6">
                                       <div className="space-y-1">
                                          <h5 className="font-extrabold text-[14.5px] text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{toVietnameseJobTitle(job.title)}</h5>
                                          <p className="text-[12px] text-slate-500 font-bold flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}</p>
                                       </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                       <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-100">{job.place}</span>
                                       <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">{job.type}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                  </div>
               </div>
            </>
         )}
      </div>
   );
}
