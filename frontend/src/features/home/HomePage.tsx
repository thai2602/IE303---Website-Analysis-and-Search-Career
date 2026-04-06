import { Link } from "react-router-dom";
import {
   ArrowRight,
   Briefcase,
   Building2,
   CalendarDays,
   Clock3,
   FileText,
   Flame,
   MapPin,
   Sparkles,
   TrendingUp,
   Users,
   Wallet,
   Zap,
} from "lucide-react";

const quickLinks = [
   {
      title: "Tìm việc nhanh",
      desc: "Lọc theo vị trí, cấp bậc, hình thức làm việc và lương mong muốn.",
      to: "/tim-viec",
      icon: Briefcase,
      accent: "#059669",
      bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      badge: "3,200+ việc làm",
   },
   {
      title: "Danh sách công ty",
      desc: "So sánh môi trường, đánh giá và cơ hội ứng tuyển theo ngành.",
      to: "/cong-ty",
      icon: Building2,
      accent: "#0284c7",
      bg: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)",
      badge: "500+ công ty",
   },
   {
      title: "Kho CV mẫu",
      desc: "Chọn bố cục CV phù hợp với ngành nghề và cấp độ kinh nghiệm.",
      to: "/cv-mau",
      icon: FileText,
      accent: "#7c3aed",
      bg: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)",
      badge: "40+ mẫu CV",
   },
];

const featuredJobs = [
   {
      title: "Frontend React Developer",
      company: "NovaTech",
      place: "TP. HCM",
      type: "Full-time",
      salary: "25–35 triệu",
      tags: ["React", "TypeScript", "Figma"],
      companyColor: "#059669",
      hot: true,
   },
   {
      title: "UI/UX Designer",
      company: "BluePixel",
      place: "Hà Nội",
      type: "Hybrid",
      salary: "18–28 triệu",
      tags: ["Figma", "Research", "Design System"],
      companyColor: "#0284c7",
      hot: false,
   },
   {
      title: "Backend Node.js Engineer",
      company: "ScaleHub",
      place: "Đà Nẵng",
      type: "Remote",
      salary: "30–45 triệu",
      tags: ["Node.js", "MongoDB", "Docker"],
      companyColor: "#7c3aed",
      hot: true,
   },
];

const bannerHighlights = [
   "3,200+ việc làm mới",
   "500+ doanh nghiệp tuyển dụng",
   "Tư vấn CV và lương theo ngành",
   "Cập nhật cơ hội mỗi ngày",
];

const webOrbitItems = [
   {
      label: "Tìm kiếm nhanh",
      text: "Lọc theo vị trí, ngành, mức lương và hình thức làm việc.",
      accent: "#059669",
   },
   {
      label: "Công ty rõ ràng",
      text: "Thông tin doanh nghiệp, môi trường và phúc lợi được trình bày gọn.",
      accent: "#0284c7",
   },
   {
      label: "CV hỗ trợ",
      text: "Mẫu CV và gợi ý nội dung giúp bạn hoàn thiện hồ sơ nhanh hơn.",
      accent: "#7c3aed",
   },
   {
      label: "Cơ hội cập nhật",
      text: "Việc mới và nội dung hướng dẫn được làm mới mỗi ngày.",
      accent: "#f59e0b",
   },
];

const jobCards = [
   {
      title: "3,200+ việc làm",
      desc: "Dữ liệu tuyển dụng được làm mới liên tục theo từng ngành.",
      accent: "#059669",
   },
   {
      title: "28 ngành nghề",
      desc: "Từ công nghệ, thiết kế đến kinh doanh và vận hành.",
      accent: "#0284c7",
   },
   {
      title: "Mức lương rõ ràng",
      desc: "Dễ so sánh thu nhập để chọn đúng vị trí mong muốn.",
      accent: "#7c3aed",
   },
];

const companyCards = [
   {
      title: "500+ công ty",
      desc: "Các doanh nghiệp đồng hành đến từ nhiều lĩnh vực khác nhau.",
      accent: "#0284c7",
   },
   {
      title: "95% xác thực",
      desc: "Ưu tiên nhà tuyển dụng có thông tin minh bạch và nhu cầu thật.",
      accent: "#059669",
   },
   {
      title: "63 tỉnh thành",
      desc: "Kết nối cơ hội trên toàn quốc và nhiều vị trí remote.",
      accent: "#7c3aed",
   },
];

const stats = [
   { label: "Việc làm mới/tuần", value: "1.2K+", icon: TrendingUp },
   { label: "Ứng viên hài lòng", value: "98%", icon: Users },
   { label: "Kết nối thành công", value: "15K+", icon: Zap },
];

const platformStats = [
   { value: "3,200+", label: "Việc làm đang tuyển dụng" },
   { value: "500+", label: "Doanh nghiệp hợp tác" },
   { value: "120K+", label: "Hồ sơ ứng viên" },
   { value: "15K+", label: "Kết nối thành công" },
   { value: "98%", label: "Độ hài lòng" },
   { value: "24/7", label: "Hỗ trợ cập nhật" },
];

function OrbitSection({
   title,
   centerIcon: CenterIcon,
   centerBg,
   accent,
   items,
   linkTo,
   linkLabel,
}: {
   title: string;
   centerIcon: typeof Briefcase;
   centerBg: string;
   accent: string;
   items: Array<{ label: string; text: string; accent: string }>;
   linkTo: string;
   linkLabel: string;
}) {
   const [topLeft, topRight, bottomLeft, bottomRight] = items;

   return (
      <section className="space-y-5">
         <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
            </div>
            <Link to={linkTo} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-600">
               {linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
         </div>

         <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr_1.1fr] lg:items-stretch">
               <div className="flex flex-col justify-between gap-4 p-6 lg:p-8">
                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{topLeft.label}</p>
                     <p className="mt-3 text-sm leading-7 text-slate-600">{topLeft.text}</p>
                  </div>
                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{bottomLeft.label}</p>
                     <p className="mt-3 text-sm leading-7 text-slate-600">{bottomLeft.text}</p>
                  </div>
               </div>

               <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-10 lg:py-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_46%)]" />
                  <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/80" />
                  <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70" />

                  <div className="relative grid h-[220px] w-[220px] place-items-center rounded-[42px] border border-white/80 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
                     <div className="grid h-28 w-28 place-items-center rounded-[34px] border border-white/70" style={{ background: centerBg, color: accent }}>
                        <CenterIcon className="h-14 w-14" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-between gap-4 p-6 lg:p-8">
                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{topRight.label}</p>
                     <p className="mt-3 text-sm leading-7 text-slate-600">{topRight.text}</p>
                  </div>
                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{bottomRight.label}</p>
                     <p className="mt-3 text-sm leading-7 text-slate-600">{bottomRight.text}</p>
                  </div>
               </div>
            </div>
         </article>
      </section>
   );
}

function SplitCardSection({
   title,
   linkTo,
   linkLabel,
   mainTitle,
   mainDesc,
   mainAccent,
   mainIcon: MainIcon,
   cards,
   reverse = false,
}: {
   title: string;
   linkTo: string;
   linkLabel: string;
   mainTitle: string;
   mainDesc: string;
   mainAccent: string;
   mainIcon: typeof Briefcase;
   cards: Array<{ title: string; desc: string; accent: string }>;
   reverse?: boolean;
}) {
   return (
      <section className="space-y-5">
         <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
            </div>
            <Link to={linkTo} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-600">
               {linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
         </div>

         <article className="grid gap-5 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
            <div className={`flex items-center ${reverse ? "lg:order-2" : ""}`}>
               <div className="w-full rounded-[30px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
                  <div className="flex items-center gap-4">
                     <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] border border-white/70 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]" style={{ background: `linear-gradient(135deg, ${mainAccent}22, ${mainAccent}10)`, color: mainAccent }}>
                        <MainIcon className="h-8 w-8" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Điểm nhấn</p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{mainTitle}</h3>
                     </div>
                  </div>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{mainDesc}</p>
               </div>
            </div>

            <div className={`grid gap-3 ${reverse ? "lg:order-1" : ""}`}>
               {cards.map((card, index) => (
                  <div
                     key={card.title}
                     className={`rounded-[24px] border border-slate-200 bg-slate-50 p-5 ${index === 0 ? "lg:ml-8" : index === 2 ? "lg:mr-8" : ""}`}
                  >
                     <div className="flex items-start gap-3">
                        <span className="mt-1 h-3 w-3 rounded-full shrink-0" style={{ background: card.accent }} />
                        <div>
                           <h4 className="text-base font-bold tracking-tight text-slate-900">{card.title}</h4>
                           <p className="mt-1 text-sm leading-7 text-slate-600">{card.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </article>
      </section>
   );
}

export default function HomePage() {
   return (
      <div className="space-y-10">
         <section className="relative overflow-hidden rounded-[28px] border border-emerald-900/10 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_-24px_rgba(15,23,42,0.55)] md:px-10 md:py-12">
            <div className="home-banner-orb home-banner-orb-1" />
            <div className="home-banner-orb home-banner-orb-2" />
            <div className="home-banner-grid pointer-events-none absolute inset-0 opacity-20" />

            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
               <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                     <Sparkles className="h-3.5 w-3.5" />
                     JobPilot
                  </span>

                  <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
                     Việc tốt, công ty tốt, ứng tuyển nhanh.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                     JobPilot tổng hợp việc làm mới mỗi ngày, giới thiệu về doanh nghiệp, hỗ trợ tối ưu CV và gợi ý cơ hội phù hợp để bạn ra quyết định nhanh hơn.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                     <Link
                        to="/tim-viec"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
                     >
                        Khám phá việc làm <ArrowRight className="h-4 w-4" />
                     </Link>
                     <Link
                        to="/dang-ky"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors duration-200 hover:bg-white/15"
                     >
                        Tạo tài khoản miễn phí
                     </Link>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                     {bannerHighlights.map((item) => (
                        <span
                           key={item}
                           className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200"
                        >
                           <span className="h-2 w-2 rounded-full bg-emerald-400" />
                           {item}
                        </span>
                     ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                     {stats.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                           <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                                 <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                 <p className="text-lg font-bold leading-none text-white">{value}</p>
                                 <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                                    {label}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="home-banner-card rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                     <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                           <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Việc làm nổi bật</p>
                           <h2 className="mt-2 text-xl font-bold text-white">Cơ hội mới trong ngày</h2>
                        </div>
                        <div className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                           Live
                        </div>
                     </div>

                     <div className="mt-4 space-y-3">
                        {featuredJobs.map((job, index) => (
                           <div
                              key={job.title}
                              className="home-banner-list-item rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                              style={{ animationDelay: `${index * 120}ms` }}
                           >
                              <div className="flex items-start justify-between gap-3">
                                 <div>
                                    <div className="flex items-center gap-2">
                                       {job.hot ? (
                                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">
                                             <Flame className="h-3 w-3" /> Hot
                                          </span>
                                       ) : null}
                                       <span className="text-sm font-semibold text-white">{job.title}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-300">{job.company}</p>
                                 </div>
                                 <div className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: job.companyColor }}>
                                    {job.company.slice(0, 1)}
                                 </div>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                                 <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-emerald-300" /> {job.place}
                                 </span>
                                 <span className="inline-flex items-center gap-1.5">
                                    <Clock3 className="h-3.5 w-3.5 text-emerald-300" /> {job.type}
                                 </span>
                                 <span className="inline-flex items-center gap-1.5">
                                    <Wallet className="h-3.5 w-3.5 text-emerald-300" /> {job.salary}
                                 </span>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                 {job.tags.map((tag) => (
                                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                                       {tag}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="home-banner-float absolute -right-2 -top-4 rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 shadow-xl">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Cập nhật hôm nay</p>
                     <p className="mt-1 text-sm font-bold">+128 việc mới</p>
                  </div>
               </div>
            </div>
         </section>

         <OrbitSection
            title="Nền tảng tìm việc toàn diện"
            centerIcon={Sparkles}
            centerBg="linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
            accent="#059669"
            items={webOrbitItems}
            linkTo="/cam-nang"
            linkLabel="Xem cẩm nang"
         />

         <SplitCardSection
            title="Tình hình tuyển dụng hiện tại"
            linkTo="/tim-viec"
            linkLabel="Bắt đầu tìm việc"
            mainTitle="Việc làm"
            mainDesc="Nổi bật các cơ hội, mức lương và vị trí để bạn chọn nhanh hơn."
            mainAccent="#059669"
            mainIcon={Briefcase}
            cards={jobCards}
         />

         <SplitCardSection
            title="Doanh nghiệp uy tín"
            linkTo="/cong-ty"
            linkLabel="Xem công ty"
            mainTitle="Công ty"
            mainDesc="Giới thiệu rõ lĩnh vực, quy mô và môi trường làm việc trước khi ứng tuyển."
            mainAccent="#0284c7"
            mainIcon={Building2}
            cards={companyCards}
            reverse
         />

         <section className="rounded-[28px] border border-emerald-100/60 bg-gradient-to-br from-emerald-50/80 via-white to-cyan-50/60 p-6 shadow-[0_12px_32px_-8px_rgba(5,150,105,0.08)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-3xl">
                     Thống kê phát triển JobPilot
                  </h2>
               </div>
               <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
                  Cập nhật hàng tuần
               </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {platformStats.map((item) => (
                  <article key={item.label} className="group rounded-[24px] border border-emerald-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200">
                     <p className="text-4xl font-black tracking-tight text-emerald-700">{item.value}</p>
                     <p className="mt-3 text-sm font-semibold text-slate-600">{item.label}</p>
                  </article>
               ))}
            </div>
         </section>

         <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                     Cơ hội việc làm nổi bật
                  </h2>
               </div>
               <Link to="/tim-viec" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-600">
                  Xem tất cả <ArrowRight className="h-4 w-4" />
               </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
               {featuredJobs.map((job) => (
                  <article key={job.title} className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                     <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-bold text-white" style={{ background: job.companyColor }}>
                                 {job.company.slice(0, 1)}
                              </div>
                              <div>
                                 <div className="flex flex-wrap items-center gap-2">
                                    {job.hot ? (
                                       <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
                                          <Flame className="h-3 w-3" /> Hot
                                       </span>
                                    ) : null}
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                       Mới
                                    </span>
                                 </div>
                                 <h3 className="mt-3 max-w-xs text-lg font-bold tracking-tight text-slate-900">{job.title}</h3>
                                 <p className="mt-1 text-sm font-semibold text-slate-600">{job.company}</p>
                              </div>
                           </div>
                        </div>

                        <div className="mt-5 space-y-2.5 text-sm text-slate-600">
                           <div className="flex items-center gap-2.5">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                              <span>{job.place}</span>
                           </div>
                           <div className="flex items-center gap-2.5">
                              <CalendarDays className="h-4 w-4 text-emerald-600" />
                              <span>{job.type}</span>
                           </div>
                           <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                              <Wallet className="h-4 w-4 text-emerald-600" />
                              <span>{job.salary}</span>
                           </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                           {job.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                 {tag}
                              </span>
                           ))}
                        </div>

                        <Link
                           to="/tim-viec"
                           className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                           Xem chi tiết <ArrowRight className="h-4 w-4" />
                        </Link>
                     </div>
                  </article>
               ))}
            </div>
         </section>

         <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 shadow-lg md:px-10 md:py-12">
            <div className="space-y-6 lg:space-y-4 lg:flex lg:items-center lg:justify-between">
               <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                     Bắt đầu hành trình tìm việc
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300 max-w-xl">
                     Đăng ký miễn phí để lưu việc làm, theo dõi công ty yêu thích và sử dụng công cụ hỗ trợ tìm việc của JobPilot.
                  </p>
               </div>
               <Link
                  to="/dang-ky"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold tracking-tight text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 lg:shrink-0"
               >
                  Đăng ký tài khoản <Sparkles className="h-4 w-4" />
               </Link>
            </div>
         </section>

         <section>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                     Khám phá các chuyên mục
                  </h2>
               </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
               {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                     <Link
                        key={item.to}
                        to={item.to}
                        className="group relative overflow-hidden rounded-[24px] border border-slate-200/70 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        style={{ background: item.bg }}
                     >
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `${item.accent}08` }} />
                        <div className="relative p-7">
                           <div className="flex items-center justify-between gap-4">
                              <div
                                 className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-md"
                                 style={{ background: item.accent }}
                              >
                                 <Icon className="h-5 w-5" />
                              </div>
                              <span className="rounded-full bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
                                 {item.badge}
                              </span>
                           </div>
                           <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                           <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                           <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1" style={{ color: item.accent }}>
                              Xem ngay <ArrowRight className="h-4 w-4" />
                           </span>
                        </div>
                     </Link>
                  );
               })}
            </div>
         </section>
      </div>
   );
}
