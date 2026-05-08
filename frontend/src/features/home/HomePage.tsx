import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
   ArrowRight,
   Briefcase,
   Building2,
   FileText,
   MapPin,
   Compass,
   ShieldCheck,
   Users,
   Wallet,
   Star,
   TrendingUp,
   PieChart as PieChartIcon,
   BarChart3,
} from "lucide-react";
import {
   LineChart,
   Line,
   BarChart,
   Bar,
   PieChart,
   Pie,
   Cell,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from "recharts";
import mascotImage from "../../assets/linh_vật_web_xóa nền.png";
import companyLogo1 from "../../assets/company_logo/image_1.png";
import companyLogo4 from "../../assets/company_logo/image_4.png";
import companyLogo7 from "../../assets/company_logo/image_7.png";
import companyLogo8 from "../../assets/company_logo/image_8.png";
import { readAuthUser } from "../../utils/auth";
import { hasCreatedCv } from "../../utils/cv";

const quickLinks = [
   {
      title: "Tìm việc nhanh",
      desc: "Tìm đúng cơ hội theo vị trí, cấp bậc, hình thức làm việc và mức thu nhập kỳ vọng.",
      to: "/tim-viec",
      icon: Briefcase,
      accent: "#059669",
      bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
   },
   {
      title: "Danh sách công ty",
      desc: "Đánh giá doanh nghiệp theo văn hóa, phúc lợi và nhu cầu tuyển dụng theo từng ngành.",
      to: "/cong-ty",
      icon: Building2,
      accent: "#0284c7",
      bg: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)",
   },
   {
      title: "Kho CV mẫu",
      desc: "Lựa chọn mẫu CV chuyên nghiệp theo ngành nghề và cấp độ kinh nghiệm của bạn.",
      to: "/cv-mau",
      icon: FileText,
      accent: "#7c3aed",
      bg: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)",
   },
];

// Dữ liệu cơ hội việc làm top ngành nghề nổi bật
const topIndustryJobs = [
   {
      industry: "Công nghệ thông tin",
      color: "#059669",
      jobs: [
         {
            title: "Lập trình viên Frontend React",
            company: "NovaTech",
            place: "TP. HCM",
            salary: "25–35 triệu",
            tags: ["React", "TypeScript"],
         },
         {
            title: "Kỹ sư Backend Node.js",
            company: "ScaleHub",
            place: "Đà Nẵng",
            salary: "30–45 triệu",
            tags: ["Node.js", "MongoDB"],
         },
         {
            title: "Kỹ sư DevOps",
            company: "CloudTech",
            place: "Hà Nội",
            salary: "35–50 triệu",
            tags: ["Docker", "AWS"],
         },
      ],
   },
   {
      industry: "Tài chính - Ngân hàng",
      color: "#0284c7",
      jobs: [
         {
            title: "Chuyên viên tín dụng",
            company: "FinBank",
            place: "TP. HCM",
            salary: "18–30 triệu",
            tags: ["Phân tích", "Tín dụng"],
         },
         {
            title: "Nhân viên ngân hàng",
            company: "VietBank",
            place: "Hà Nội",
            salary: "12–20 triệu",
            tags: ["Khách hàng", "Giao dịch"],
         },
         {
            title: "Kế toán viên",
            company: "Finverse",
            place: "Đà Nẵng",
            salary: "15–25 triệu",
            tags: ["Kế toán", "Báo cáo"],
         },
      ],
   },
   {
      industry: "Kinh doanh - Buôn bán",
      color: "#7c3aed",
      jobs: [
         {
            title: "Nhân viên kinh doanh",
            company: "SalesPro",
            place: "TP. HCM",
            salary: "15–25 triệu",
            tags: ["Bán hàng", "Khách hàng"],
         },
         {
            title: "Trưởng phòng kinh doanh",
            company: "BizHub",
            place: "Hà Nội",
            salary: "30–50 triệu",
            tags: ["Lãnh đạo", "Chiến lược"],
         },
         {
            title: "Nhân viên kinh doanh BĐS",
            company: "RealEstate Plus",
            place: "Đà Nẵng",
            salary: "20–35 triệu",
            tags: ["Bất động sản", "Tư vấn"],
         },
      ],
   },
];

// Dữ liệu công ty nổi bật
const featuredCompanies = [
   {
      name: "NovaTech",
      rating: "4.8",
      employees: "500-1000",
      location: "TP. HCM",
      openJobs: 24,
      color: "#059669",
      initial: "N",
      avatar: companyLogo1,
      category: "Technology",
   },
   {
      name: "BluePixel",
      rating: "4.7",
      employees: "100-500",
      location: "Hà Nội",
      openJobs: 12,
      color: "#0284c7",
      initial: "B",
      avatar: companyLogo7,
      category: "Design",
   },
   {
      name: "ScaleHub",
      rating: "4.9",
      employees: "1000+",
      location: "Đà Nẵng",
      openJobs: 18,
      color: "#7c3aed",
      initial: "S",
      avatar: companyLogo8,
      category: "Technology",
   },
   {
      name: "CloudWorks",
      rating: "4.6",
      employees: "200-500",
      location: "TP. HCM",
      openJobs: 15,
      color: "#ea580c",
      initial: "C",
      avatar: companyLogo4,
      category: "Technology",
   },
];

// Dữ liệu tuyển dụng theo tháng
const recruitmentTrendData = [
   { month: "T1", jobs: 450, companies: 85, salary: 28 },
   { month: "T2", jobs: 520, companies: 92, salary: 29 },
   { month: "T3", jobs: 580, companies: 102, salary: 30 },
   { month: "T4", jobs: 720, companies: 118, salary: 31 },
   { month: "T5", jobs: 890, companies: 135, salary: 33 },
   { month: "T6", jobs: 1050, companies: 156, salary: 34 },
];

// Dữ liệu phân bố việc làm theo ngành
const jobDistributionData = [
   { name: "Công nghệ", value: 780, color: "#059669" },
   { name: "Marketing", value: 450, color: "#0284c7" },
   { name: "Thiết kế", value: 320, color: "#7c3aed" },
   { name: "Nhân sự", value: 280, color: "#ea580c" },
   { name: "Bán hàng", value: 370, color: "#facc15" },
];

// Dữ liệu mức lương theo vị trí
const salaryByPositionData = [
   { position: "Intern", salary: 5, applicants: 450 },
   { position: "Junior", salary: 12, applicants: 680 },
   { position: "Senior", salary: 28, applicants: 320 },
   { position: "Lead", salary: 40, applicants: 180 },
   { position: "Manager", salary: 50, applicants: 120 },
];

const companyHighlights = [
   {
      title: "Công ty đã xác minh",
      desc: "Nhà tuyển dụng được kiểm duyệt trước khi đăng tin.",
      accent: "#059669",
      icon: ShieldCheck,
   },
   {
      title: "Phủ sóng 34 tỉnh thành",
      desc: "Cơ hội việc làm rộng khắp, dễ chọn nơi làm phù hợp.",
      accent: "#0284c7",
      icon: Compass,
   },
   {
      title: "Minh bạch thu nhập",
      desc: "Khoảng lương hiển thị rõ trước khi bạn ứng tuyển.",
      accent: "#7c3aed",
      icon: Wallet,
   },
];

const bannerMarketStats = [
   { label: "Việc mới hôm nay", value: "25", accent: "#f59e0b" },
   { label: "Việc làm đang tuyển", value: "320+", accent: "#22c55e" },
   { label: "Ứng viên hài lòng", value: "98%", accent: "#6366f1" },
];

const platformStats = [
   { value: "320+", label: "Việc làm đang tuyển dụng" },
   { value: "50+", label: "Doanh nghiệp hợp tác" },
   { value: "12k+", label: "Hồ sơ ứng viên" },
   { value: "1.5k+", label: "Kết nối thành công" },
   { value: "98%", label: "Độ hài lòng" },
   { value: "24/7", label: "Hỗ trợ cập nhật" },
];

const platformGrowthData = [
   { month: "T1", value: 1200 },
   { month: "T2", value: 1450 },
   { month: "T3", value: 1680 },
   { month: "T4", value: 1970 },
   { month: "T5", value: 2230 },
   { month: "T6", value: 2480 },
];

// ============ COMPONENTS ============

function CompanyCard({ company }: { company: (typeof featuredCompanies)[0] }) {
   return (
      <Link
         to="/cong-ty"
         className="group relative overflow-hidden rounded-[20px] border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
         <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
               <div
                  className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gray-100"
               >
                  {company.avatar ? (
                     <img src={company.avatar} alt={company.name} className="h-full w-full object-cover" />
                  ) : (
                     <span className="font-bold text-white" style={{ color: company.color }}>
                        {company.initial}
                     </span>
                  )}
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{company.name}</h3>
                  <p className="mt-1 text-xs text-slate-700">{company.category}</p>
               </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
               <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
               <span className="text-xs font-bold text-amber-700">{company.rating}</span>
            </div>
         </div>
         <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
               <MapPin className="h-3.5 w-3.5 text-gray-400" />
               <span className="text-xs">{company.location}</span>
            </div>
            <div className="flex items-center gap-2">
               <Users className="h-3.5 w-3.5 text-gray-400" />
               <span className="text-xs">{company.employees}</span>
            </div>
         </div>
         <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2">
            <p className="text-xs font-semibold text-emerald-700">{company.openJobs} việc mở</p>
         </div>
      </Link>
   );
}

function TopIndustryCard({
   industry,
   appliedJobIds,
   onApply,
}: {
   industry: (typeof topIndustryJobs)[0];
   appliedJobIds: Set<string>;
   onApply: (industryName: string, job: (typeof topIndustryJobs)[0]["jobs"][0]) => void;
}) {
   return (
      <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
         <div className="flex items-center gap-3 mb-4">
            <div
               className="h-3 w-3 rounded-full"
               style={{ backgroundColor: industry.color }}
            />
            <h3 className="text-lg font-bold text-gray-900">{industry.industry}</h3>
         </div>
         <div className="space-y-3">
            {industry.jobs.map((job, index) => (
               <div key={index} className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                     <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{job.title}</h4>
                        <p className="text-xs text-slate-700 mt-1">{job.company}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                           <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              <MapPin className="h-3 w-3 text-slate-600" />
                              {job.place}
                           </span>
                           <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <Wallet className="h-3 w-3 text-emerald-600" />
                              {job.salary}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                     {job.tags.map((tag) => (
                        <span
                           key={tag}
                           className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-slate-700 border border-gray-200"
                        >
                           {tag}
                        </span>
                     ))}
                  </div>
                  <button
                     type="button"
                     onClick={() => onApply(industry.industry, job)}
                     disabled={appliedJobIds.has(`${industry.industry}-${job.company}-${job.title}`)}
                     className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                     {appliedJobIds.has(`${industry.industry}-${job.company}-${job.title}`) ? "Đã ứng tuyển" : "Ứng tuyển"}
                  </button>
               </div>
            ))}
         </div>
         <Link
            to="/tim-viec"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-slate-800 hover:text-slate-900 transition-colors"
         >
            Xem thêm <ArrowRight className="h-4 w-4" />
         </Link>
      </div>
   );
}

export default function HomePage() {
   const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => {
      try {
         const raw = localStorage.getItem("jobpilot_applications");
         if (!raw) return new Set<string>();
         const saved = JSON.parse(raw) as Array<{ id?: string; company?: string; title?: string; industry?: string }>;
         const ids = saved
            .map((item) => item.id ?? `${item.industry ?? ""}-${item.company ?? ""}-${item.title ?? ""}`)
            .filter((id): id is string => Boolean(id));
         return new Set(ids);
      } catch {
         return new Set<string>();
      }
   });
   const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);

   useEffect(() => {
      if (!toast) {
         return;
      }

      const timeoutId = window.setTimeout(() => setToast(null), 2600);
      return () => window.clearTimeout(timeoutId);
   }, [toast]);

   const showToast = (message: string, kind: "success" | "error" = "success") => {
      setToast({ message, kind });
   };

   const handleApplyJob = (industryName: string, job: (typeof topIndustryJobs)[0]["jobs"][0]) => {
      if (!readAuthUser()) {
         showToast("Bạn cần đăng nhập trước khi ứng tuyển.", "error");
         return;
      }

      if (!hasCreatedCv()) {
         showToast("Bạn chưa có CV. Vui lòng tạo CV trước khi ứng tuyển.", "error");
         return;
      }

      const id = `${industryName}-${job.company}-${job.title}`;
      if (appliedJobIds.has(id)) {
         showToast("Bạn đã ứng tuyển vị trí này rồi.", "error");
         return;
      }

      const application = {
         id,
         company: job.company,
         title: job.title,
         salary: job.salary,
         place: job.place,
         industry: industryName,
         appliedAt: new Date().toLocaleString("vi-VN"),
         status: "Đang chờ xác nhận",
         trackingNote: "Hồ sơ đã được ghi nhận và đang đợi nhà tuyển dụng phản hồi.",
      };

      try {
         const raw = localStorage.getItem("jobpilot_applications");
         const current = raw ? (JSON.parse(raw) as Array<Record<string, string>>) : [];
         const updated = [application, ...current.filter((item) => item.id !== id)];
         localStorage.setItem("jobpilot_applications", JSON.stringify(updated));
         setAppliedJobIds((prev) => new Set([...prev, id]));
         showToast(`Đã ứng tuyển thành công: ${job.title} tại ${job.company}.`);
      } catch {
         showToast("Không thể lưu hồ sơ ứng tuyển vào trình duyệt.", "error");
      }
   };

   return (
      <div className="space-y-12">
         {/* ===== BANNER SECTION ===== */}
         <section className="relative overflow-hidden rounded-[16px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 px-6 py-10 shadow-[0_4px_16px_rgba(16,185,129,0.08)] md:px-10 md:py-14">
            <div className="home-banner-orb home-banner-orb-1" />
            <div className="home-banner-orb home-banner-orb-2" />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
               <div className="space-y-6">
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                     Nền tảng tìm việc đáng tin cậy
                  </span>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                     Tìm việc dễ, ứng tuyển nhanh
                  </h1>

                  <p className="max-w-2xl text-base leading-7 text-emerald-800">
                     JobPilot tổng hợp việc làm mới mỗi ngày, giới thiệu doanh nghiệp uy tín và hỗ trợ tối ưu hồ sơ để bạn ứng tuyển nhanh, chính xác.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                     <Link to="/tim-viec" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-700">
                        Khám phá việc làm <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link to="/dang-ky" className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">
                        Tạo tài khoản miễn phí
                     </Link>
                  </div>
               </div>

               <div className="relative mx-auto w-full max-w-[420px]">
                  <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                     <div className="flex flex-col items-center text-center gap-4">
                        <div className="ai-mascot-wrap inline-flex h-32 w-32 md:h-36 md:w-36">
                           <img src={mascotImage} alt="Linh vật" className="ai-mascot-image rounded-lg" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Gợi ý việc phù hợp</h3>
                        <p className="text-sm text-slate-700">Giao diện gọn, màu sáng dễ nhìn, tập trung vào nội dung.</p>

                        <div className="mt-4 grid w-full gap-2 sm:grid-cols-3">
                           {bannerMarketStats.map((stat) => (
                              <div key={stat.label} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left">
                                 <p className="text-[10px] uppercase tracking-wide text-slate-900 font-semibold">{stat.label}</p>
                                 <p className="mt-1 text-lg font-semibold" style={{ color: stat.accent }}>{stat.value}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ===== RECRUITMENT STATISTICS SECTION ===== */}
         <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                     <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Tình hình tuyển dụng hiện tại
                     </h2>
                     <p className="mt-1 text-sm text-slate-900 font-medium">Xu hướng thị trường việc làm theo từng tháng</p>
                  </div>
               </div>
               <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 flex-shrink-0">
                  Cập nhật hàng tháng
               </span>
            </div>

            <div className="grid gap-6">
               {/* Recruitment Trend Chart */}
               <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                     <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                        <TrendingUp className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-slate-900">Tăng trưởng việc làm & Công ty</h3>
                        <p className="mt-0.5 text-sm text-slate-700">Số lượng việc làm mới và công ty tuyển dụng mỗi tháng</p>
                     </div>
                  </div>

                  <div className="mt-6">
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={recruitmentTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                           <XAxis dataKey="month" />
                           <YAxis />
                           <Tooltip
                              contentStyle={{
                                 backgroundColor: "#fff",
                                 border: "1px solid #e2e8f0",
                                 borderRadius: "8px",
                              }}
                           />
                           <Legend />
                           <Line
                              type="monotone"
                              dataKey="jobs"
                              stroke="#059669"
                              name="Số việc làm"
                              strokeWidth={2}
                              dot={{ fill: "#059669", r: 4 }}
                           />
                           <Line
                              type="monotone"
                              dataKey="companies"
                              stroke="#0284c7"
                              name="Số công ty tuyển"
                              strokeWidth={2}
                              dot={{ fill: "#0284c7", r: 4 }}
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Job Distribution & Salary Charts */}
               <div className="grid gap-6 lg:grid-cols-2">
                  {/* Job Distribution Pie Chart */}
                  <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white p-6 shadow-sm">
                     <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                           <PieChartIcon className="h-5 w-5" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-900">Phân bố việc làm theo ngành</h3>
                           <p className="mt-0.5 text-sm text-slate-700">Tổng <span className="font-bold">{jobDistributionData.reduce((a, b) => a + b.value, 0)}+</span> việc làm mở</p>
                        </div>
                     </div>

                     <div className="mt-6">
                        <ResponsiveContainer width="100%" height={250}>
                           <PieChart>
                              <Pie
                                 data={jobDistributionData}
                                 cx="50%"
                                 cy="50%"
                                 labelLine={false}
                                 label={({ name, value }) => `${name}: ${value}`}
                                 outerRadius={80}
                                 fill="#8884d8"
                                 dataKey="value"
                              >
                                 {jobDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                              <Tooltip />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Salary by Position */}
                  <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white p-6 shadow-sm">
                     <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                           <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-900">Mức lương theo cấp độ</h3>
                           <p className="mt-0.5 text-sm text-slate-700">Mức lương trung bình (triệu VND)</p>
                        </div>
                     </div>

                     <div className="mt-6">
                        <ResponsiveContainer width="100%" height={250}>
                           <BarChart data={salaryByPositionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="position" />
                              <YAxis />
                              <Tooltip
                                 contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                 }}
                              />
                              <Bar dataKey="salary" fill="#7c3aed" name="Lương (triệu)" radius={[8, 8, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ===== FEATURED COMPANIES SECTION ===== */}
         <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-700 flex-shrink-0">
                     <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Doanh nghiệp uy tín hàng đầu
                     </h2>
                     <p className="mt-1 text-sm text-emerald-700 font-medium">Những công ty hàng đầu đang tuyển dụng</p>
                  </div>
               </div>
               <Link to="/cong-ty" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex-shrink-0">
                  Xem tất cả <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
               {featuredCompanies.map((company) => (
                  <CompanyCard key={company.name} company={company} />
               ))}
            </div>
         </section>

         {/* ===== COMPANY HIGHLIGHTS ===== */}
         <section className="rounded-[16px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8">
            <div className="flex items-start gap-3 mb-6">
               <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                  <Star className="h-6 w-6" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Tại sao chọn JobPilot</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
               {companyHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                     <div key={item.title} className="flex flex-col items-start gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-lg text-white" style={{ background: item.accent }}>
                           <Icon className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900">{item.title}</h4>
                           <p className="mt-1 text-sm text-emerald-800">{item.desc}</p>
                        </div>
                     </div>
                  );
               })}
            </div>
         </section>

         {/* ===== PLATFORM STATS ===== */}
         <section className="rounded-[16px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-[0_4px_16px_rgba(16,185,129,0.08)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
               <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                     <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-3xl">
                        Thống kê tăng trưởng JobPilot
                     </h2>
                     <p className="mt-1 text-sm text-emerald-700 font-medium">Những con số ấn tượng và xu hướng phát triển của nền tảng</p>
                  </div>
               </div>
               <span className="rounded-full border border-emerald-300 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 flex-shrink-0">
                  Cập nhật hàng tuần
               </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {platformStats.map((item) => (
                     <article key={item.label} className="group rounded-[12px] border border-emerald-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-300">
                        <p className="text-4xl font-bold tracking-tight text-emerald-700">{item.value}</p>
                        <p className="mt-3 text-sm font-semibold text-emerald-800">{item.label}</p>
                     </article>
                  ))}
               </div>

               <div className="rounded-[12px] border border-emerald-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-4">
                     <div>
                        <h3 className="text-lg font-bold text-slate-900">Biểu đồ tăng trưởng</h3>
                        <p className="mt-1 text-sm text-emerald-700">Lượt kết nối ứng viên theo từng tháng</p>
                     </div>
                     <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 flex-shrink-0">
                        6 tháng
                     </span>
                  </div>

                  <div className="mt-6 h-56">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformGrowthData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                           <XAxis dataKey="month" tickLine={false} axisLine={false} />
                           <YAxis tickLine={false} axisLine={false} />
                           <Tooltip
                              contentStyle={{
                                 backgroundColor: "#fff",
                                 border: "1px solid #e2e8f0",
                                 borderRadius: "8px",
                              }}
                           />
                           <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
         </section>

         {/* ===== TOP INDUSTRY JOBS ===== */}
         <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-100 text-purple-700 flex-shrink-0">
                     <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Cơ hội việc làm top ngành nghề
                     </h2>
                     <p className="mt-1 text-sm text-emerald-700 font-medium">Khám phá cơ hội trong các ngành hot nhất hiện nay</p>
                  </div>
               </div>
               <Link to="/tim-viec" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex-shrink-0">
                  Xem tất cả <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
               {topIndustryJobs.map((industry) => (
                  <TopIndustryCard
                     key={industry.industry}
                     industry={industry}
                     appliedJobIds={appliedJobIds}
                     onApply={handleApplyJob}
                  />
               ))}
            </div>
         </section>

         {/* ===== CTA SECTION ===== */}
         <section className="rounded-[16px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-6 py-8 shadow-[0_4px_16px_rgba(16,185,129,0.08)] md:px-10 md:py-12">
            <div className="space-y-6 lg:space-y-4 lg:flex lg:items-center lg:justify-between">
               <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                     Bắt đầu hành trình tìm việc
                  </h2>
                  <p className="mt-4 text-base leading-7 text-emerald-800 max-w-xl">
                     Đăng ký miễn phí để lưu việc làm, theo dõi công ty yêu thích và sử dụng công cụ hỗ trợ tìm việc của JobPilot.
                  </p>
               </div>
               <Link
                  to="/dang-ky"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow transition-colors lg:shrink-0"
               >
                  Đăng ký tài khoản
               </Link>
            </div>
         </section>

         {/* ===== QUICK LINKS ===== */}
         <section>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
               <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-100 text-orange-700 flex-shrink-0">
                     <Compass className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                        Khám phá các chuyên mục
                     </h2>
                  </div>
               </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
               {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                     <Link
                        key={item.to}
                        to={item.to}
                        className="group relative overflow-hidden rounded-[12px] border border-emerald-200 transition-all duration-300 hover:shadow-lg"
                        style={{ background: item.bg }}
                     >
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `${item.accent}08` }} />
                        <div className="relative p-7">
                           <div className="flex items-center justify-between gap-4">
                              <div className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-md" style={{ background: item.accent }}>
                                 <Icon className="h-5 w-5" />
                              </div>
                           </div>
                           <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                           <p className="mt-2 text-sm leading-6 text-slate-900">{item.desc}</p>
                           <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1" style={{ color: item.accent }}>
                              Xem ngay <ArrowRight className="h-4 w-4" />
                           </span>
                        </div>
                     </Link>
                  );
               })}
            </div>
         </section>

         {toast && (
            <div style={{ position: "fixed", left: "50%", top: 24, transform: "translateX(-50%)", zIndex: 1300, minWidth: "min(520px, calc(100vw - 24px))" }}>
               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderRadius: 14, border: `1px solid ${toast.kind === "success" ? "#86efac" : "#fca5a5"}`, background: toast.kind === "success" ? "linear-gradient(135deg, #f0fdf4, #ffffff)" : "linear-gradient(135deg, #fff1f2, #ffffff)", boxShadow: "0 18px 50px rgba(15,23,42,0.16)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                     <div style={{ width: 10, height: 10, borderRadius: 999, background: toast.kind === "success" ? "#16a34a" : "#dc2626", flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontWeight: 700 }}>×</button>
               </div>
            </div>
         )}
      </div>
   );
}
