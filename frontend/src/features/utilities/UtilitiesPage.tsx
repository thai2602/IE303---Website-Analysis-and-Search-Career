import { useMemo, useState } from "react";
import { BadgeDollarSign, Gift, Banknote, Store, Columns, TrendingUp } from "lucide-react";

const tools = [
   {
      id: "salary-estimate",
      title: "Ước tính lương",
      desc: "So sánh mức lương theo cấp bậc, khu vực và ngành nghề với dữ liệu thực tế.",
      icon: BadgeDollarSign,
      accent: "#10b981",
      badge: "Phổ biến nhất",
   },
   {
      id: "benefit-compare",
      title: "So sánh đãi ngộ",
      desc: "Tổng hợp bảo hiểm, thưởng và phúc lợi theo công ty.",
      icon: Gift,
      accent: "#10b981",
      badge: "Mới cập nhật",
   },
   {
      id: "net-gross",
      title: "Công cụ lương Net/Gross",
      desc: "Tính nhanh lương take-home hoặc quy đổi từ lương net sang gross.",
      icon: Banknote,
      accent: "#10b981",
      badge: "Tiện lợi",
   },
   {
      id: "salary-jobs",
      title: "Gợi ý việc làm",
      desc: "Nhập mức lương mong muốn để nhận gợi ý ngành và vị trí phù hợp.",
      icon: Store,
      accent: "#10b981",
      badge: "Tùy chỉnh",
   },
   {
      id: "industry-compare",
      title: "So sánh lương ngành",
      desc: "Nhận diện ngành nào đang trả lương tốt hơn cho bạn.",
      icon: Columns,
      accent: "#10b981",
      badge: "Phân tích",
   },
   {
      id: "market-trends",
      title: "Xu hướng thị trường",
      desc: "Theo dõi biến động tuyển dụng và xu hướng lương.",
      icon: TrendingUp,
      accent: "#10b981",
      badge: "Realtime",
   },
];

const salaryAverages = [
   { title: "Frontend Developer", avg: "28 triệu", range: "22-35 triệu" },
   { title: "Backend Developer", avg: "30 triệu", range: "24-40 triệu" },
   { title: "Nhân viên tài chính", avg: "18 triệu", range: "14-25 triệu" },
   { title: "Chuyên viên kinh doanh", avg: "20 triệu", range: "15-30 triệu" },
   { title: "HR Recruiter", avg: "16 triệu", range: "12-22 triệu" },
   { title: "Marketing Specialist", avg: "19 triệu", range: "15-28 triệu" },
];

const benefitPolicies = [
   { title: "Bảo hiểm sức khỏe toàn diện", desc: "Bảo hiểm y tế 24/7, khám chữa bệnh miễn phí với gói doanh nghiệp." },
   { title: "Chính sách lương thưởng", desc: "Thưởng hiệu suất, lương tháng 13 và review lương 6 tháng/lần." },
   { title: "Ngày nghỉ và phúc lợi", desc: "PCC, nghỉ phép năm, hỗ trợ du lịch và team-building." },
];

const industrySalaryComparison = [
   { industry: "Công nghệ thông tin", avg: 32, color: "#0f766e" },
   { industry: "Tài chính - Ngân hàng", avg: 24, color: "#2563eb" },
   { industry: "Kinh doanh - Buôn bán", avg: 20, color: "#c026d3" },
   { industry: "Marketing", avg: 19, color: "#dc2626" },
   { industry: "Thiết kế", avg: 18, color: "#0ea5e9" },
];

const marketTrends = [
   { label: "Tăng tuyển dụng", value: "+14%", desc: "Ngành CNTT vẫn dẫn đầu nhu cầu tuyển dụng." },
   { label: "Lương cạnh tranh", value: "+12%", desc: "Nhân sự tài chính và sales tăng lương nhanh." },
   { label: "Uy tín doanh nghiệp", value: "75%", desc: "Doanh nghiệp ưu tiên phúc lợi linh hoạt." },
];

const jobSuggestions = [
   { title: "Frontend React Developer", company: "NovaTech", salary: 32 },
   { title: "Chuyên viên tín dụng", company: "FinBank", salary: 24 },
   { title: "Nhân viên kinh doanh", company: "SalesPro", salary: 22 },
   { title: "DevOps Engineer", company: "CloudTech", salary: 38 },
   { title: "Marketing Specialist", company: "AdFlex", salary: 21 },
];

export default function UtilitiesPage() {
   const [calculatorMode, setCalculatorMode] = useState<"gross" | "net">("gross");
   const [salaryInput, setSalaryInput] = useState("25");
   const [salaryQuery, setSalaryQuery] = useState("25");
   const [activeUtility, setActiveUtility] = useState<string>(tools[0].id);

   const salaryNumber = useMemo(() => Number(salaryInput.replace(/\D/g, "")) || 0, [salaryInput]);
   const salaryQueryNumber = useMemo(() => Number(salaryQuery.replace(/\D/g, "")) || 0, [salaryQuery]);

   const salaryResult = useMemo(() => {
      if (salaryNumber <= 0) {
         return "Nhập lương để tính nhanh";
      }
      if (calculatorMode === "gross") {
         const net = salaryNumber * 0.84;
         return `${net.toFixed(1)} triệu (ước tính net)`;
      }
      const gross = (salaryNumber + 2) / 0.84;
      return `${gross.toFixed(1)} triệu (ước tính gross)`;
   }, [salaryNumber, calculatorMode]);

   const salarySuggestions = useMemo(() => {
      if (salaryQueryNumber <= 0) {
         return jobSuggestions.slice(0, 3);
      }
      return jobSuggestions.filter((job) => Math.abs(job.salary - salaryQueryNumber) <= 6);
   }, [salaryQueryNumber]);

   const openUtility = (utilityId: string) => {
      setActiveUtility(utilityId);
      const section = document.getElementById(`utility-${utilityId}`);
      if (section) {
         section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
   };

   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-50px", right: "-30px", width: "220px", height: "220px",
               borderRadius: "50%", background: "rgba(167,243,208,0.2)", filter: "blur(40px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-40px", left: "30%", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(110,231,183,0.15)", filter: "blur(35px)",
            }} />

            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Tiện ích tìm việc
            </h1>
            <p style={{ color: "#ffffff", fontSize: "15px", lineHeight: 1.7 }}>
               Ước tính lương, so sánh đãi ngộ, tìm việc theo mức lương và theo dõi xu hướng thị trường.
            </p>
         </div>

         <section style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
         }}>
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Công cụ tiện ích</h2>
               <p className="mt-2 text-gray-600">Những tiện ích phổ biến để xem lương, tối ưu quyền lợi.</p>
            </div>
         </section>

         <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
               {tools.map((tool) => (
                  <button
                     key={`launcher-${tool.id}`}
                     onClick={() => openUtility(tool.id)}
                     className={`rounded-lg border px-4 py-3 text-left transition ${activeUtility === tool.id
                        ? "border-[#0f4c51] bg-blue-50 text-[#0f4c51]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                  >
                     <p className="text-sm font-semibold">{tool.title}</p>
                  </button>
               ))}
            </div>
         </section>

         {/* Tool Cards */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
               const Icon = tool.icon;
               return (
                  <article
                     key={tool.title}
                     className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                  >
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="p-3 rounded-lg bg-slate-100">
                              <Icon className="w-5 h-5 text-slate-600" />
                           </div>
                           <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                              {tool.badge}
                           </span>
                        </div>
                     </div>

                     <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.desc}</p>

                     <button
                        className="w-full py-2 px-4 bg-[#0f4c51] hover:bg-[#1b7377] text-white text-sm font-semibold rounded-lg transition-colors"
                        onClick={() => openUtility(tool.id)}
                     >
                        Mở tiện ích
                     </button>
                  </article>
               );
            })}
         </div>

         {/* Salary average by position */}
         <section id="utility-salary-estimate" className="space-y-6 rounded-[28px] border border-gray-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Mức lương trung bình theo vị trí</h2>
                  <p className="mt-2 text-gray-600">Thống kê lương thực tế cho các vị trí phổ biến trên thị trường.</p>
               </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {salaryAverages.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                     <p className="text-sm font-semibold text-gray-500">{item.title}</p>
                     <p className="mt-4 text-3xl font-bold text-gray-900">{item.avg}</p>
                     <p className="mt-2 text-sm text-gray-600">Khoảng: {item.range}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Benefit policy section */}
         <section id="utility-benefit-compare" className="space-y-6 rounded-[28px] border border-gray-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Chính sách đãi ngộ của công ty</h2>
               <p className="mt-2 text-gray-600">Tìm hiểu nhanh những phúc lợi quan trọng khi nhận việc.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
               {benefitPolicies.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                     <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                     <p className="mt-3 text-sm text-gray-600">{item.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Net/Gross calculator */}
         <section id="utility-net-gross" className="space-y-6 rounded-[28px] border border-gray-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Công cụ tính lương net / gross</h2>
               <p className="mt-2 text-gray-600">Nhập mức lương và chuyển đổi nhanh giữa net và gross.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
               <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                     <button
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${calculatorMode === "gross" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
                        onClick={() => setCalculatorMode("gross")}
                     >
                        Gross → Net
                     </button>
                     <button
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${calculatorMode === "net" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}`}
                        onClick={() => setCalculatorMode("net")}
                     >
                        Net → Gross
                     </button>
                  </div>
                  <div className="mt-6">
                     <label className="text-sm font-semibold text-gray-700">Nhập lương (triệu)</label>
                     <input
                        type="text"
                        value={salaryInput}
                        onChange={(e) => setSalaryInput(e.target.value)}
                        placeholder="Ví dụ: 25"
                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400"
                     />
                  </div>
               </div>
               <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500">Kết quả</p>
                  <p className="mt-4 text-4xl font-bold text-gray-900">{salaryResult}</p>
                  <p className="mt-4 text-sm text-gray-600">Công thức tính ước lượng: trừ 16% thuế và bảo hiểm khi chuyển gross → net.</p>
               </div>
            </div>
         </section>

         {/* Salary-based job suggestions */}
         <section id="utility-salary-jobs" className="space-y-6 rounded-[28px] border border-gray-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Gợi ý việc làm theo mức lương</h2>
               <p className="mt-2 text-gray-600">Nhập mức lương mong muốn để nhận đề xuất vị trí phù hợp.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
               <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                  <label className="text-sm font-semibold text-gray-700">Mức lương mong muốn (triệu)</label>
                  <input
                     type="text"
                     value={salaryQuery}
                     onChange={(e) => setSalaryQuery(e.target.value)}
                     placeholder="Ví dụ: 25"
                     className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-400"
                  />
                  <div className="mt-6 space-y-3">
                     {salarySuggestions.length > 0 ? (
                        salarySuggestions.map((job) => (
                           <div key={job.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                              <div className="flex items-center justify-between gap-2">
                                 <div>
                                    <p className="font-semibold text-gray-900">{job.title}</p>
                                    <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                                 </div>
                                 <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{job.salary} triệu</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <p className="text-sm text-gray-600">Không tìm thấy gợi ý phù hợp. Hãy thử mức lương khác.</p>
                     )}
                  </div>
               </div>
               <div className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Cách chọn mức lương</h3>
                  <p className="mt-3 text-sm text-gray-600">Chọn mức lương dựa trên kinh nghiệm, ngành nghề và địa điểm làm việc để nhanh chốt offer.</p>
                  <div className="mt-4 space-y-3">
                     <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Ưu tiên mức lương trong khoảng 10-15% trên mức hiện có nếu bạn muốn thuyết phục nhà tuyển dụng.</div>
                     <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700">Ngành CNTT và tài chính thường có biên độ lương rộng, nên chọn mức trung bình để tăng tỷ lệ trúng tuyển.</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Industry salary comparison */}
         <section id="utility-industry-compare" className="space-y-6 rounded-[28px] border border-gray-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">So sánh mức lương giữa các ngành</h2>
               <p className="mt-2 text-gray-600">Xem ngành nào đang trả lương cao hơn và đâu là xu hướng nổi bật.</p>
            </div>
            <div className="space-y-4">
               {industrySalaryComparison.map((item) => (
                  <div key={item.industry} className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-sm">
                     <div className="flex items-center justify-between gap-4">
                        <div>
                           <p className="text-sm font-semibold text-gray-500">{item.industry}</p>
                           <p className="mt-1 text-sm text-gray-600">Mức trung bình: {item.avg} triệu</p>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{item.avg} triệu</span>
                     </div>
                     <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(item.avg * 3, 100)}%`, backgroundColor: item.color }} />
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Market trends */}
         <section id="utility-market-trends" className="space-y-6">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Thống kê xu hướng thị trường</h2>
               <p className="mt-2 text-gray-600">Theo dõi các xu hướng tuyển dụng, lương và phúc lợi nổi bật hiện nay.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
               {marketTrends.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-sm">
                     <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                     </div>
                     <p className="mt-4 text-4xl font-bold text-gray-900">{item.value}</p>
                     <p className="mt-3 text-sm text-gray-600">{item.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Bottom banner */}
         <div style={{
            borderRadius: "28px",
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 45%, #dcfce7 100%)",
            border: "1px solid #a7f3d0",
            padding: "32px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap",
            boxShadow: "0 18px 40px rgba(16,185,129,0.12)",
         }}>
            <div>
               <p style={{ fontSize: "13px", color: "#065f46", lineHeight: 1.6 }}>
                  Không cần tài khoản để sử dụng tiện ích. Đăng ký để lưu kết quả và nhận báo cáo cá nhân hóa.
               </p>
            </div>
            <button style={{
               background: "#10b981", color: "#fff", borderRadius: "12px",
               padding: "12px 24px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
               boxShadow: "0 4px 16px rgba(16,185,129,0.4)", whiteSpace: "nowrap",
            }}>
               Đăng ký miễn phí
            </button>
         </div>
      </div>
   );
}
