import { useMemo, useState, useEffect } from "react";
import { BadgeDollarSign, Gift, Banknote, Store, Columns, TrendingUp, Info, CheckCircle } from "lucide-react";

// input in millions (VND)
function calculateGrossToNet(grossInMillions: number, dependents: number, basis: "full" | "min", regionVal: number) {
   const gross = grossInMillions * 1_000_000;
   
   // Determine minimum regional wage for region 1, 2, 3, 4
   let minWage = 4_960_000;
   if (regionVal === 2) minWage = 4_410_000;
   else if (regionVal === 3) minWage = 3_860_000;
   else if (regionVal === 4) minWage = 3_450_000;

   const insSalary = basis === "full" ? gross : minWage;

   // BHXH (8% cap at 20 times basic wage of 1.8M = 36M)
   const bhxhSalary = Math.min(insSalary, 36_000_000);
   const bhxh = bhxhSalary * 0.08;

   // BHYT (1.5% cap at 20 times basic wage of 1.8M = 36M)
   const bhytSalary = Math.min(insSalary, 36_000_000);
   const bhyt = bhytSalary * 0.015;

   // BHTN (1% cap at 20 times regional minimum wage)
   const bhtnSalary = Math.min(insSalary, 20 * minWage);
   const bhtn = bhtnSalary * 0.01;

   const totalInsurance = bhxh + bhyt + bhtn;

   // Deductions
   const selfDeduction = 11_000_000;
   const dependentDeduction = dependents * 4_400_000;
   const totalDeduction = selfDeduction + dependentDeduction;

   // Taxable income
   const taxableIncome = Math.max(0, gross - totalInsurance - totalDeduction);

   // PIT calculation based on progressive brackets
   let pit = 0;
   if (taxableIncome <= 5_000_000) {
      pit = taxableIncome * 0.05;
   } else if (taxableIncome <= 10_000_000) {
      pit = taxableIncome * 0.10 - 250_000;
   } else if (taxableIncome <= 18_000_000) {
      pit = taxableIncome * 0.15 - 750_000;
   } else if (taxableIncome <= 32_000_000) {
      pit = taxableIncome * 0.20 - 1_650_000;
   } else if (taxableIncome <= 52_000_000) {
      pit = taxableIncome * 0.25 - 3_250_000;
   } else if (taxableIncome <= 80_000_000) {
      pit = taxableIncome * 0.30 - 5_850_000;
   } else {
      pit = taxableIncome * 0.35 - 9_850_000;
   }

   const net = gross - totalInsurance - pit;

   return {
      gross: gross / 1_000_000,
      bhxh: bhxh / 1_000_000,
      bhyt: bhyt / 1_000_000,
      bhtn: bhtn / 1_000_000,
      totalInsurance: totalInsurance / 1_000_000,
      taxableIncome: taxableIncome / 1_000_000,
      pit: pit / 1_000_000,
      net: net / 1_000_000,
   };
}

function calculateNetToGross(netInMillions: number, dependents: number, basis: "full" | "min", regionVal: number) {
   if (netInMillions <= 0) return calculateGrossToNet(0, dependents, basis, regionVal);
   
   let low = netInMillions;
   let high = netInMillions * 3;
   let mid = 0;
   let iterations = 0;
   const epsilon = 0.0001;

   while (low <= high && iterations < 50) {
      mid = (low + high) / 2;
      const res = calculateGrossToNet(mid, dependents, basis, regionVal);
      if (Math.abs(res.net - netInMillions) < epsilon) {
         return res;
      }
      if (res.net < netInMillions) {
         low = mid;
      } else {
         high = mid;
      }
      iterations++;
   }
   return calculateGrossToNet(mid, dependents, basis, regionVal);
}

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

   // Calculator details states
   const [dependents, setDependents] = useState(0);
   const [insuranceBasis, setInsuranceBasis] = useState<"full" | "min">("full");
   const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);

   // Industry comparison states
   const [compareSource, setCompareSource] = useState(industrySalaryComparison[0].industry);
   const [compareTarget, setCompareTarget] = useState(industrySalaryComparison[1].industry);

   // Live jobs state
   const [apiJobs, setApiJobs] = useState<any[]>([]);

   // Fetch jobs on mount for suggestions
   useEffect(() => {
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
      fetch(`${apiBase}/api/jobs`)
         .then((res) => {
            if (!res.ok) throw new Error("API error");
            return res.json();
         })
         .then((apiData) => {
            if (apiData && apiData.length > 0) {
               const mapped = apiData.map((item: any) => ({
                  title: item.title,
                  company: item.company?.name || "Công ty ẩn",
                  salary: Math.round((item.salaryMax ? item.salaryMax : (item.salaryMin || 0)) / 1_000_000) || 15,
               }));
               setApiJobs(mapped);
            }
         })
         .catch((err) => {
            console.error("Failed to fetch jobs for utilities page", err);
         });
   }, []);

   const salaryNumber = useMemo(() => {
      const cleanStr = salaryInput.replace(/,/g, ".");
      const num = parseFloat(cleanStr);
      return isNaN(num) ? 0 : num;
   }, [salaryInput]);

   const salaryQueryNumber = useMemo(() => {
      const cleanStr = salaryQuery.replace(/,/g, ".");
      const num = parseFloat(cleanStr);
      return isNaN(num) ? 0 : num;
   }, [salaryQuery]);

   const salaryBreakdown = useMemo(() => {
      if (salaryNumber <= 0) return null;
      if (calculatorMode === "gross") {
         return calculateGrossToNet(salaryNumber, dependents, insuranceBasis, region);
      } else {
         return calculateNetToGross(salaryNumber, dependents, insuranceBasis, region);
      }
   }, [salaryNumber, calculatorMode, dependents, insuranceBasis, region]);

   const finalJobSuggestions = useMemo(() => {
      return apiJobs.length > 0 ? apiJobs : jobSuggestions;
   }, [apiJobs]);

   const salarySuggestions = useMemo(() => {
      if (salaryQueryNumber <= 0) {
         return finalJobSuggestions.slice(0, 3);
      }
      const filtered = finalJobSuggestions.filter((job) => Math.abs(job.salary - salaryQueryNumber) <= 6);
      return filtered.length > 0 ? filtered.slice(0, 5) : [];
   }, [salaryQueryNumber, finalJobSuggestions]);

   const comparisonResult = useMemo(() => {
      const source = industrySalaryComparison.find(x => x.industry === compareSource);
      const target = industrySalaryComparison.find(x => x.industry === compareTarget);
      if (!source || !target) return null;
      const diff = source.avg - target.avg;
      const percent = ((source.avg / target.avg - 1) * 100).toFixed(0);
      return {
         diff: Math.abs(diff),
         percent: Math.abs(Number(percent)),
         isSourceHigher: diff > 0,
         isEqual: diff === 0
      };
   }, [compareSource, compareTarget]);

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
               <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Công cụ tính lương net / gross chuyên nghiệp</h2>
               <p className="mt-2 text-gray-600">Áp dụng mức giảm trừ gia cảnh và các quy định bảo hiểm mới nhất tại Việt Nam.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
               {/* Left Column: Form Inputs */}
               <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-3">
                     <button
                        type="button"
                        className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${calculatorMode === "gross" ? "bg-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setCalculatorMode("gross")}
                     >
                        Gross → Net (Tính lương thực nhận)
                     </button>
                     <button
                        type="button"
                        className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${calculatorMode === "net" ? "bg-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        onClick={() => setCalculatorMode("net")}
                     >
                        Net → Gross (Quy đổi ngược)
                     </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[12.5px] font-bold text-gray-700">Mức lương ({calculatorMode === "gross" ? "Gross" : "Net"} - triệu đồng)</label>
                        <input
                           type="text"
                           value={salaryInput}
                           onChange={(e) => setSalaryInput(e.target.value)}
                           placeholder="Ví dụ: 25"
                           className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                        />
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[12.5px] font-bold text-gray-700">Số người phụ thuộc</label>
                        <select
                           value={dependents}
                           onChange={(e) => setDependents(Number(e.target.value))}
                           className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white cursor-pointer"
                        >
                           {[0, 1, 2, 3, 4, 5, 6].map(n => (
                              <option key={n} value={n}>{n} người</option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[12.5px] font-bold text-gray-700">Mức đóng bảo hiểm</label>
                        <select
                           value={insuranceBasis}
                           onChange={(e) => setInsuranceBasis(e.target.value as "full" | "min")}
                           className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white cursor-pointer"
                        >
                           <option value="full">Đóng trên lương thực tế</option>
                           <option value="min">Đóng mức tối thiểu vùng</option>
                        </select>
                     </div>

                     <div className="space-y-1.5">
                        <label className="text-[12.5px] font-bold text-gray-700">Vùng bảo hiểm tối thiểu</label>
                        <select
                           value={region}
                           onChange={(e) => setRegion(Number(e.target.value) as 1 | 2 | 3 | 4)}
                           className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white cursor-pointer"
                        >
                           <option value={1}>Vùng I (4.96M)</option>
                           <option value={2}>Vùng II (4.41M)</option>
                           <option value={3}>Vùng III (3.86M)</option>
                           <option value={4}>Vùng IV (3.45M)</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Right Column: Calculations Breakdown */}
               <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                  {salaryBreakdown ? (
                     <div className="space-y-5">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                           <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                              {calculatorMode === "gross" ? "Thực nhận ước tính (NET)" : "Mức lương quy đổi (GROSS)"}
                           </p>
                           <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-2">
                              {(calculatorMode === "gross" ? salaryBreakdown.net : salaryBreakdown.gross).toFixed(2)} triệu <span className="text-base font-bold text-emerald-600">/ tháng</span>
                           </p>
                        </div>

                        <div className="space-y-2 text-sm">
                           <h3 className="font-extrabold text-gray-800 text-[13.5px] flex items-center gap-1.5 border-b pb-1.5">
                              <Info className="w-4 h-4 text-emerald-600" /> Bảng chi tiết lương tháng (VND)
                           </h3>
                           <div className="divide-y divide-gray-100 font-medium">
                              <div className="flex justify-between py-2">
                                 <span className="text-gray-500 font-bold">Lương Gross</span>
                                 <span className="text-gray-950 font-extrabold">{(salaryBreakdown.gross * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                              <div className="flex justify-between py-2 text-xs">
                                 <span className="text-slate-500 pl-3">↳ BH Xã hội (8.0%)</span>
                                 <span className="text-slate-700">- {(salaryBreakdown.bhxh * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                              <div className="flex justify-between py-2 text-xs">
                                 <span className="text-slate-500 pl-3">↳ BH Y tế (1.5%)</span>
                                 <span className="text-slate-700">- {(salaryBreakdown.bhyt * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                              <div className="flex justify-between py-2 text-xs">
                                 <span className="text-slate-500 pl-3">↳ BH Thất nghiệp (1.0%)</span>
                                 <span className="text-slate-700">- {(salaryBreakdown.bhtn * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                              <div className="flex justify-between py-2">
                                 <span className="text-gray-500 font-bold">Tổng tiền bảo hiểm</span>
                                 <span className="text-rose-600 font-bold">- {(salaryBreakdown.totalInsurance * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                              <div className="flex justify-between py-2">
                                 <span className="text-gray-500 font-bold">Thuế thu nhập cá nhân (PIT)</span>
                                 <span className="text-rose-600 font-bold">
                                    {salaryBreakdown.pit > 0 
                                       ? `- ${(salaryBreakdown.pit * 1_000_000).toLocaleString('vi-VN')} đ`
                                       : "0 đ (Miễn thuế)"
                                    }
                                 </span>
                              </div>
                              <div className="flex justify-between py-2.5 border-t border-dashed bg-slate-50/50 px-2 rounded-xl mt-1.5 font-bold">
                                 <span className="text-emerald-800">Lương NET thực nhận</span>
                                 <span className="text-emerald-700 font-black">{(salaryBreakdown.net * 1_000_000).toLocaleString('vi-VN')} đ</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center space-y-3">
                        <Banknote className="w-12 h-12 text-slate-300 animate-pulse" />
                        <p className="text-[13.5px] font-bold">Nhập mức lương ở cột bên trái<br />để xem bảng tính chi tiết BHXH & Thuế TNCN.</p>
                     </div>
                  )}

                  <div className="mt-4 border-t pt-3 flex items-start gap-2 text-[11px] text-gray-500 leading-normal">
                     <span className="text-amber-500">★</span>
                     <p>
                        Dữ liệu được cập nhật dựa trên quy định giảm trừ gia cảnh (bản thân 11M, người phụ thuận 4.4M) và lương cơ sở 1.8M đóng bảo hiểm. BHXH tối đa 36M, BHYT tối đa 36M, BHTN tối đa 20 lần mức tối thiểu vùng.
                     </p>
                  </div>
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
               <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">So sánh mức lương giữa các ngành</h2>
                  <p className="mt-2 text-gray-600">Xem ngành nào đang trả lương cao hơn và đâu là xu hướng nổi bật.</p>
               </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
               {/* Left: Salary Bars */}
               <div className="space-y-3.5">
                  {industrySalaryComparison.map((item) => (
                     <div key={item.industry} className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between gap-4">
                           <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.industry}</p>
                              <p className="mt-0.5 text-xs text-gray-400 font-semibold">Mức trung bình: {item.avg} triệu</p>
                           </div>
                           <span className="text-base font-black text-slate-800">{item.avg} triệu</span>
                        </div>
                        <div className="mt-3.5 h-2.5 overflow-hidden rounded-full bg-slate-50">
                           <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(item.avg * 3, 100)}%`, backgroundColor: item.color }} />
                        </div>
                     </div>
                  ))}
               </div>

               {/* Right: Interactive Direct Comparer */}
               <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                     <h3 className="font-extrabold text-[14px] text-gray-800 flex items-center gap-1.5 border-b pb-2">
                        <Columns className="w-4 h-4 text-emerald-600" /> So sánh trực quan 2 ngành
                     </h3>

                     <div className="space-y-3.5">
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Ngành thứ nhất</label>
                           <select
                              value={compareSource}
                              onChange={(e) => setCompareSource(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold outline-none transition focus:border-emerald-500 focus:bg-white cursor-pointer"
                           >
                              {industrySalaryComparison.map(x => (
                                 <option key={x.industry} value={x.industry}>{x.industry}</option>
                              ))}
                           </select>
                        </div>

                        <div className="space-y-1">
                           <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Ngành thứ hai</label>
                           <select
                              value={compareTarget}
                              onChange={(e) => setCompareTarget(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold outline-none transition focus:border-emerald-500 focus:bg-white cursor-pointer"
                           >
                              {industrySalaryComparison.map(x => (
                                 <option key={x.industry} value={x.industry}>{x.industry}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {comparisonResult && (
                        <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-100/50 p-4 text-[12.5px] text-emerald-900 leading-relaxed font-semibold">
                           {comparisonResult.isEqual ? (
                              <div className="flex items-start gap-2">
                                 <span className="text-emerald-600 font-bold">✓</span>
                                 <p>Mức lương trung bình của hai ngành này bằng nhau.</p>
                              </div>
                           ) : (
                              <div className="flex items-start gap-2.5">
                                 <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                                 <p>
                                    Ngành <strong className="text-emerald-950">{comparisonResult.isSourceHigher ? compareSource : compareTarget}</strong> có lương trung bình cao hơn ngành <strong className="text-emerald-950">{comparisonResult.isSourceHigher ? compareTarget : compareSource}</strong> khoảng <strong className="text-emerald-950 text-sm font-black">{comparisonResult.percent}%</strong>, tương đương <strong className="text-emerald-950 text-sm font-black">{comparisonResult.diff.toFixed(1)} triệu</strong> mỗi tháng.
                                 </p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>

                  <div className="mt-5 text-[11px] text-slate-400 font-medium">
                     * Dữ liệu dựa trên khảo sát thực tế và phân tích của chúng tôi đối với 1,500+ doanh nghiệp trong năm 2025.
                  </div>
               </div>
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
