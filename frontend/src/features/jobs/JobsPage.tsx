import { Briefcase, Clock3, MapPin, Wallet, Search, SlidersHorizontal, Flame, Bookmark } from "lucide-react";

const jobs = [
   {
      title: "Frontend React Developer",
      company: "NovaTech",
      companyInitial: "N",
      companyColor: "#6366f1",
      place: "TP. HCM",
      type: "Full-time",
      salary: "25–35 triệu",
      tags: ["React", "TypeScript", "Figma"],
      hot: true,
      posted: "2 ngày trước",
   },
   {
      title: "UI/UX Designer",
      company: "BluePixel",
      companyInitial: "B",
      companyColor: "#ec4899",
      place: "Hà Nội",
      type: "Hybrid",
      salary: "18–28 triệu",
      tags: ["Figma", "Prototyping", "User Research"],
      hot: false,
      posted: "1 ngày trước",
   },
   {
      title: "Backend Node.js Engineer",
      company: "ScaleHub",
      companyInitial: "S",
      companyColor: "#f59e0b",
      place: "Đà Nẵng",
      type: "Remote",
      salary: "30–45 triệu",
      tags: ["Node.js", "MongoDB", "Docker"],
      hot: true,
      posted: "Hôm nay",
   },
];

const typeColors: Record<string, { bg: string; text: string }> = {
   "Full-time": { bg: "#ecfdf5", text: "#059669" },
   "Hybrid": { bg: "#eef2ff", text: "#4f46e5" },
   "Remote": { bg: "#fffbeb", text: "#b45309" },
};

export default function JobsPage() {
   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #10b981 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-50px", right: "5%", width: "250px", height: "250px",
               borderRadius: "50%", background: "rgba(52,211,153,0.15)", filter: "blur(45px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-30px", left: "15%", width: "160px", height: "160px",
               borderRadius: "50%", background: "rgba(167,243,208,0.12)", filter: "blur(30px)",
            }} />

            <span style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)",
               borderRadius: "999px", padding: "4px 14px", fontSize: "11px",
               color: "#6ee7b7", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
            }}>
               <Flame style={{ width: 11, height: 11 }} />
               3,200+ VIỆC LÀM MỚI NHẤT
            </span>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Tìm việc <span style={{ color: "#6ee7b7" }}>phù hợp</span>
            </h1>
            <p style={{ color: "#a7f3d0", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px" }}>
               Tổng hợp các cơ hội việc làm mới nhất theo ngành, địa điểm và mức lương.
            </p>

            {/* Search bar */}
            <div style={{
               display: "flex", gap: "8px", background: "rgba(255,255,255,0.12)",
               borderRadius: "14px", padding: "8px", backdropFilter: "blur(10px)",
               border: "1px solid rgba(255,255,255,0.2)",
            }}>
               <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "0 12px" }}>
                  <Search style={{ width: 16, height: 16, color: "#6ee7b7", flexShrink: 0 }} />
                  <input
                     placeholder="Tìm vị trí, công ty, kỹ năng..."
                     style={{
                        background: "none", border: "none", outline: "none",
                        color: "#fff", fontSize: "14px", width: "100%",
                     }}
                  />
               </div>
               <button style={{
                  background: "#10b981", color: "#fff", borderRadius: "10px",
                  padding: "10px 24px", fontSize: "14px", fontWeight: 700,
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 4px 15px rgba(16,185,129,0.5)",
               }}>
                  Tìm kiếm
               </button>
            </div>
         </div>

         {/* Filters */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
               {["Tất cả", "Full-time", "Remote", "Hybrid", "Lương > 20tr"].map((f, i) => (
                  <button key={f} style={{
                     padding: "7px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                     border: i === 0 ? "none" : "1px solid #e2e8f0",
                     background: i === 0 ? "#0f172a" : "#fff",
                     color: i === 0 ? "#fff" : "#475569", cursor: "pointer",
                  }}>
                     {f}
                  </button>
               ))}
            </div>
            <button style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
               border: "1px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer",
            }}>
               <SlidersHorizontal style={{ width: 14, height: 14 }} /> Lọc nâng cao
            </button>
         </div>

         {/* Job cards */}
         <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {jobs.map((job) => {
               const tc = typeColors[job.type] ?? { bg: "#f1f5f9", text: "#475569" };
               return (
                  <article key={job.title} style={{
                     background: "#fff", borderRadius: "20px", padding: "24px 28px",
                     border: "1px solid #f1f5f9",
                     boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                     transition: "transform 0.25s, box-shadow 0.25s",
                     position: "relative", overflow: "hidden",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; }}
                  >
                     {/* Left accent bar */}
                     <div style={{
                        position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
                        background: job.companyColor, borderRadius: "20px 0 0 20px",
                     }} />

                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                           {/* Company avatar */}
                           <div style={{
                              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
                              background: `${job.companyColor}15`,
                              border: `2px solid ${job.companyColor}30`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "20px", fontWeight: 900, color: job.companyColor,
                           }}>
                              {job.companyInitial}
                           </div>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                 {job.hot && (
                                    <span style={{
                                       display: "inline-flex", alignItems: "center", gap: "4px",
                                       background: "#fef3c7", color: "#b45309",
                                       borderRadius: "999px", padding: "2px 10px",
                                       fontSize: "10px", fontWeight: 700,
                                    }}>
                                       <Flame style={{ width: 9, height: 9 }} /> HOT
                                    </span>
                                 )}
                                 <span style={{
                                    background: "#ecfdf5", color: "#059669",
                                    borderRadius: "999px", padding: "2px 10px",
                                    fontSize: "10px", fontWeight: 700,
                                 }}>
                                    Mới đăng
                                 </span>
                              </div>
                              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em", marginTop: "6px" }}>
                                 {job.title}
                              </h3>
                              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{job.company} • {job.posted}</p>
                           </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                           <button style={{
                              width: "38px", height: "38px", borderRadius: "10px",
                              border: "1px solid #e2e8f0", background: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", color: "#64748b",
                           }}>
                              <Bookmark style={{ width: 15, height: 15 }} />
                           </button>
                           <button style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              background: job.companyColor, color: "#fff",
                              borderRadius: "10px", padding: "9px 20px",
                              fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                              boxShadow: `0 4px 14px ${job.companyColor}40`,
                           }}>
                              Ứng tuyển
                           </button>
                        </div>
                     </div>

                     {/* Meta info */}
                     <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#475569" }}>
                           <MapPin style={{ width: 13, height: 13 }} /> {job.place}
                        </span>
                        <span style={{
                           display: "inline-flex", alignItems: "center", gap: "5px",
                           background: tc.bg, color: tc.text,
                           borderRadius: "999px", padding: "3px 10px",
                           fontSize: "12px", fontWeight: 700,
                        }}>
                           <Clock3 style={{ width: 12, height: 12 }} /> {job.type}
                        </span>
                        <span style={{
                           display: "inline-flex", alignItems: "center", gap: "5px",
                           fontSize: "14px", fontWeight: 800, color: "#0f172a",
                        }}>
                           <Wallet style={{ width: 14, height: 14, color: "#10b981" }} /> {job.salary}
                        </span>
                     </div>

                     {/* Tags */}
                     <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                        {job.tags.map((tag) => (
                           <span key={tag} style={{
                              background: "#f8fafc", border: "1px solid #e2e8f0",
                              borderRadius: "8px", padding: "3px 10px",
                              fontSize: "11px", fontWeight: 600, color: "#475569",
                           }}>
                              {tag}
                           </span>
                        ))}
                     </div>
                  </article>
               );
            })}
         </div>
      </div>
   );
}