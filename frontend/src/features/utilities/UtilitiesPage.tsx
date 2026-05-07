import { useMemo, useState } from "react";
import { BadgeDollarSign, Gift, ArrowRight, Zap, BarChart3, TrendingUp, Banknote, Store, Columns, Sparkles } from "lucide-react";

const tools = [
   {
      id: "salary-estimate",
      title: "Ước tính lương",
      desc: "So sánh mức lương theo cấp bậc, khu vực và ngành nghề với dữ liệu thực tế từ 10,000+ ứng viên.",
      icon: BadgeDollarSign,
      accent: "#10b981",
      bg: "linear-gradient(145deg, #064e3b, #065f46)",
      lightBg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      badge: "Phổ biến nhất",
      stats: "10K+ lượt dùng",
      statsIcon: TrendingUp,
   },
   {
      id: "benefit-compare",
      title: "So sánh đãi ngộ",
      desc: "Tổng hợp bảo hiểm, thưởng và phúc lợi theo công ty — giúp bạn chọn nơi làm việc tốt nhất.",
      icon: Gift,
      accent: "#6366f1",
      bg: "linear-gradient(145deg, #3730a3, #4338ca)",
      lightBg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      badge: "Mới cập nhật",
      stats: "500+ công ty",
      statsIcon: BarChart3,
   },
   {
      id: "net-gross",
      title: "Công cụ lương Net/Gross",
      desc: "Tính nhanh lương take-home hoặc quy đổi từ lương net sang gross theo cách tính đơn giản.",
      icon: Banknote,
      accent: "#14b8a6",
      bg: "linear-gradient(145deg, #0f766e, #115e59)",
      lightBg: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
      badge: "Tiện lợi",
      stats: "1K+ lượt dùng",
      statsIcon: TrendingUp,
   },
   {
      id: "salary-jobs",
      title: "Gợi ý việc làm theo lương",
      desc: "Nhập mức lương mong muốn để nhận gợi ý ngành và vị trí phù hợp.",
      icon: Store,
      accent: "#8b5cf6",
      bg: "linear-gradient(145deg, #4c1d95, #4338ca)",
      lightBg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
      badge: "Tùy chỉnh",
      stats: "250+ gợi ý",
      statsIcon: ArrowRight,
   },
   {
      id: "industry-compare",
      title: "So sánh mức lương ngành",
      desc: "Nhận diện nhanh ngành nào đang trả lương tốt hơn và xu hướng tăng trưởng.",
      icon: Columns,
      accent: "#f59e0b",
      bg: "linear-gradient(145deg, #b45309, #d97706)",
      lightBg: "linear-gradient(135deg, #fef3c7, #fde68a)",
      badge: "Soi ngành",
      stats: "10 ngành",
      statsIcon: BarChart3,
   },
   {
      id: "market-trends",
      title: "Xu hướng thị trường",
      desc: "Theo dõi biến động tuyển dụng, đãi ngộ và xu hướng lương để chọn thời điểm ứng tuyển tốt nhất.",
      icon: Sparkles,
      accent: "#0ea5e9",
      bg: "linear-gradient(145deg, #0c4a6e, #0369a1)",
      lightBg: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
      badge: "Insight",
      stats: "Realtime",
      statsIcon: TrendingUp,
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

const heroHighlights = [
   { value: "6", label: "Tiện ích nghề nghiệp trọng điểm" },
   { value: "10K+", label: "Lượt sử dụng công cụ lương" },
   { value: "500+", label: "Công ty tham chiếu uy tín" },
];

const toolSpotlight = [
   "Tính lương nhanh",
   "So sánh đãi ngộ",
   "Gợi ý vị trí phù hợp",
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
      <div className="space-y-10 relative">
         <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-140px", right: "-120px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.03) 55%, rgba(16,185,129,0) 72%)", filter: "blur(10px)" }} />
            <div style={{ position: "absolute", top: "220px", left: "-150px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(99,102,241,0.03) 55%, rgba(99,102,241,0) 72%)", filter: "blur(10px)" }} />
         </div>

         {/* Hero */}
         <div style={{
            borderRadius: "28px",
            background: "linear-gradient(135deg, #07111f 0%, #0f172a 46%, #12263f 100%)",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "0 28px 80px rgba(15,23,42,0.24)",
         }}>
            <div style={{
               position: "absolute", top: "-50px", right: "10%", width: "230px", height: "230px",
               borderRadius: "50%", background: "rgba(99,102,241,0.18)", filter: "blur(45px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-30px", left: "20%", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(16,185,129,0.14)", filter: "blur(35px)",
            }} />
            <div style={{
               position: "absolute",
               inset: 0,
               backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
               backgroundSize: "28px 28px",
               maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 90%)",
            }} />

            <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "28px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "center" }}>
               <div>

                  <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "14px" }}>
                     Trang tiện ích giúp bạn <span style={{ background: "linear-gradient(90deg, #818cf8, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ra quyết định nghề nghiệp</span> nhanh hơn
                  </h1>
                  <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: 1.8, maxWidth: "640px" }}>
                     Ước tính lương, so sánh đãi ngộ, tìm việc theo mức lương và tham khảo dữ liệu thị trường trong một giao diện trực quan, đồng bộ và dễ dùng.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
                     {toolSpotlight.map((item) => (
                        <span key={item} style={{
                           display: "inline-flex", alignItems: "center",
                           background: "rgba(255,255,255,0.08)", color: "#e2e8f0",
                           border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px",
                           padding: "8px 12px", fontSize: "12px", fontWeight: 600,
                        }}>
                           {item}
                        </span>
                     ))}
                  </div>
               </div>

               <div style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "24px",
                  padding: "22px",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
               }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                     <div>
                        <p style={{ fontSize: "12px", letterSpacing: "0.08em", color: "#86efac", fontWeight: 700 }}>TỔNG QUAN HÔM NAY</p>
                     </div>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                     {heroHighlights.map((item, index) => (
                        <div key={item.label} style={{
                           display: "flex", alignItems: "center", justifyContent: "space-between",
                           padding: "14px 16px", borderRadius: "16px",
                           background: index % 2 === 0 ? "rgba(15,23,42,0.35)" : "rgba(255,255,255,0.07)",
                           border: "1px solid rgba(255,255,255,0.1)",
                        }}>
                           <div>
                              <p style={{ color: "#cbd5e1", fontSize: "12px", fontWeight: 600 }}>{item.label}</p>
                              <p style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginTop: "4px" }}>{item.value}</p>
                           </div>
                           <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: index === 0 ? "#6ee7b7" : index === 1 ? "#a5b4fc" : "#fcd34d" }} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <section style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
         }}>
            <div>
               <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a" }}>Công cụ nổi bật</h2>
               <p style={{ marginTop: "8px", color: "#475569", lineHeight: 1.7 }}>Những tiện ích được dùng nhiều nhất để xem lương, tối ưu quyền lợi và định hướng nghề nghiệp.</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "999px", background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 8px 20px rgba(15,23,42,0.06)" }}>
               <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Thiết kế đồng bộ, dễ quét thông tin</span>
            </div>
         </section>

         <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)] md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">Trung tâm tiện ích</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">Bấm để mở nhanh đúng công cụ</h3>
               </div>
               <button
                  onClick={() => openUtility(activeUtility)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)]"
               >
                  Mở ngay
                  <ArrowRight className="h-4 w-4" />
               </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
               {tools.map((tool) => (
                  <button
                     key={`launcher-${tool.id}`}
                     onClick={() => openUtility(tool.id)}
                     className={`rounded-xl border px-4 py-3 text-left transition ${activeUtility === tool.id
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                  >
                     <p className="text-sm font-semibold">{tool.title}</p>
                     <p className="mt-1 text-xs opacity-80">{tool.stats}</p>
                  </button>
               ))}
            </div>
         </section>

         {/* Tool Cards */}
         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => {
               const Icon = tool.icon;
               const StatsIcon = tool.statsIcon;
               return (
                  <article key={tool.title} style={{
                     borderRadius: "28px", overflow: "hidden",
                     boxShadow: activeUtility === tool.id ? `0 24px 54px ${tool.accent}25` : "0 14px 35px rgba(15,23,42,0.09)",
                     border: activeUtility === tool.id ? `1px solid ${tool.accent}` : "1px solid rgba(226,232,240,0.95)",
                     transition: "transform 0.3s, box-shadow 0.3s",
                     background: "#fff",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 54px rgba(15,23,42,0.14)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 35px rgba(15,23,42,0.09)"; }}
                  >
                     {/* Card top — dark with icon */}
                     <div style={{
                        background: tool.bg, padding: "32px 28px",
                        position: "relative", overflow: "hidden",
                     }}>
                        <div style={{
                           position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px",
                           borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none",
                        }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                           <div style={{
                              width: "56px", height: "56px", borderRadius: "16px",
                              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              border: "1px solid rgba(255,255,255,0.2)",
                           }}>
                              <Icon style={{ width: 26, height: 26, color: "#fff" }} />
                           </div>
                           <span style={{
                              background: "rgba(255,255,255,0.2)", color: "#fff",
                              borderRadius: "999px", padding: "3px 12px",
                              fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
                           }}>
                              {tool.badge}
                           </span>
                        </div>

                        <h3 style={{
                           marginTop: "20px", fontSize: "20px", fontWeight: 800,
                           color: "#fff", letterSpacing: "-0.01em",
                        }}>
                           {tool.title}
                        </h3>

                        {/* Stats chip */}
                        <div style={{
                           marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px",
                           background: "rgba(255,255,255,0.12)", borderRadius: "8px",
                           padding: "4px 10px",
                        }}>
                           <StatsIcon style={{ width: 12, height: 12, color: "rgba(255,255,255,0.7)" }} />
                           <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{tool.stats}</span>
                        </div>
                     </div>

                     {/* Card bottom — light */}
                     <div style={{ background: "#fff", padding: "24px 28px" }}>
                        <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, marginBottom: "20px" }}>
                           {tool.desc}
                        </p>
                        <button style={{
                           width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                           background: `linear-gradient(135deg, ${tool.accent}, ${tool.bg.includes("#") ? tool.accent : tool.accent})`, color: "#fff",
                           borderRadius: "14px", padding: "12px 20px",
                           fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
                           boxShadow: `0 10px 22px ${tool.accent}33`,
                           transition: "opacity 0.2s, transform 0.2s",
                        }}
                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                           onClick={() => openUtility(tool.id)}
                        >
                           Mở tiện ích <ArrowRight style={{ width: 15, height: 15 }} />
                        </button>
                     </div>
                  </article>
               );
            })}
         </div>

         {/* Salary average by position */}
         <section id="utility-salary-estimate" className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Mức lương trung bình theo vị trí</h2>
                  <p className="mt-2 text-slate-600">Thống kê lương thực tế cho các vị trí phổ biến trên thị trường.</p>
               </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {salaryAverages.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                     <p className="text-sm font-semibold text-slate-500">{item.title}</p>
                     <p className="mt-4 text-3xl font-bold text-slate-900">{item.avg}</p>
                     <p className="mt-2 text-sm text-slate-600">Khoảng: {item.range}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Benefit policy section */}
         <section id="utility-benefit-compare" className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Chính sách đãi ngộ của công ty</h2>
               <p className="mt-2 text-slate-600">Tìm hiểu nhanh những phúc lợi quan trọng khi nhận việc.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
               {benefitPolicies.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                     <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                     <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Net/Gross calculator */}
         <section id="utility-net-gross" className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Công cụ tính lương net / gross</h2>
               <p className="mt-2 text-slate-600">Nhập mức lương và chuyển đổi nhanh giữa net và gross.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
               <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                     <button
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${calculatorMode === "gross" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        onClick={() => setCalculatorMode("gross")}
                     >
                        Gross → Net
                     </button>
                     <button
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${calculatorMode === "net" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        onClick={() => setCalculatorMode("net")}
                     >
                        Net → Gross
                     </button>
                  </div>
                  <div className="mt-6">
                     <label className="text-sm font-semibold text-slate-700">Nhập lương (triệu)</label>
                     <input
                        type="text"
                        value={salaryInput}
                        onChange={(e) => setSalaryInput(e.target.value)}
                        placeholder="Ví dụ: 25"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                     />
                  </div>
               </div>
               <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Kết quả</p>
                  <p className="mt-4 text-4xl font-bold text-slate-900">{salaryResult}</p>
                  <p className="mt-4 text-sm text-slate-600">Công thức tính ước lượng: trừ 16% thuế và bảo hiểm khi chuyển gross → net.</p>
               </div>
            </div>
         </section>

         {/* Salary-based job suggestions */}
         <section id="utility-salary-jobs" className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Gợi ý việc làm theo mức lương</h2>
               <p className="mt-2 text-slate-600">Nhập mức lương mong muốn để nhận đề xuất vị trí phù hợp.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
               <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <label className="text-sm font-semibold text-slate-700">Mức lương mong muốn (triệu)</label>
                  <input
                     type="text"
                     value={salaryQuery}
                     onChange={(e) => setSalaryQuery(e.target.value)}
                     placeholder="Ví dụ: 25"
                     className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
                  />
                  <div className="mt-6 space-y-3">
                     {salarySuggestions.length > 0 ? (
                        salarySuggestions.map((job) => (
                           <div key={job.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex items-center justify-between gap-2">
                                 <div>
                                    <p className="font-semibold text-slate-900">{job.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                                 </div>
                                 <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{job.salary} triệu</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <p className="text-sm text-slate-600">Không tìm thấy gợi ý phù hợp. Hãy thử mức lương khác.</p>
                     )}
                  </div>
               </div>
               <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Cách chọn mức lương</h3>
                  <p className="mt-3 text-sm text-slate-600">Chọn mức lương dựa trên kinh nghiệm, ngành nghề và địa điểm làm việc để nhanh chốt offer.</p>
                  <div className="mt-4 space-y-3">
                     <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Ưu tiên mức lương trong khoảng 10-15% trên mức hiện có nếu bạn muốn thuyết phục nhà tuyển dụng.</div>
                     <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">Ngành CNTT và tài chính thường có biên độ lương rộng, nên chọn mức trung bình để tăng tỷ lệ trúng tuyển.</div>
                  </div>
               </div>
            </div>
         </section>

         {/* Industry salary comparison */}
         <section id="utility-industry-compare" className="space-y-6 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">So sánh mức lương giữa các ngành</h2>
               <p className="mt-2 text-slate-600">Xem ngành nào đang trả lương cao hơn và đâu là xu hướng nổi bật.</p>
            </div>
            <div className="space-y-4">
               {industrySalaryComparison.map((item) => (
                  <div key={item.industry} className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm">
                     <div className="flex items-center justify-between gap-4">
                        <div>
                           <p className="text-sm font-semibold text-slate-500">{item.industry}</p>
                           <p className="mt-1 text-sm text-slate-600">Mức trung bình: {item.avg} triệu</p>
                        </div>
                        <span className="text-xl font-bold text-slate-900">{item.avg} triệu</span>
                     </div>
                     <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(item.avg * 3, 100)}%`, backgroundColor: item.color }} />
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Market trends */}
         <section id="utility-market-trends" className="space-y-6">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Thống kê xu hướng thị trường</h2>
               <p className="mt-2 text-slate-600">Theo dõi các xu hướng tuyển dụng, lương và phúc lợi nổi bật hiện nay.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
               {marketTrends.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                     <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
                     </div>
                     <p className="mt-4 text-4xl font-bold text-slate-900">{item.value}</p>
                     <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
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
               <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Zap style={{ width: 18, height: 18, color: "#10b981" }} />
                  <h4 style={{ fontSize: "17px", fontWeight: 800, color: "#064e3b" }}>
                     Tất cả công cụ hoàn toàn miễn phí
                  </h4>
               </div>
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