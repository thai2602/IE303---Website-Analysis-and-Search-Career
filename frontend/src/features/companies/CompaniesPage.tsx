import { Building2, Star, Users, ArrowRight, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const fieldColors: Record<string, { bg: string; text: string }> = {
   "Software Product": { bg: "#eef2ff", text: "#4f46e5" },
   "Ecommerce": { bg: "#ecfdf5", text: "#059669" },
   "HealthTech": { bg: "#f0f9ff", text: "#0284c7" },
   "Fintech": { bg: "#fffbeb", text: "#b45309" },
};

export default function CompaniesPage() {
   const [companies, setCompanies] = useState<any[]>([]);

   useEffect(() => {
      fetch("http://localhost:8080/api/companies")
         .then(res => res.json())
         .then(data => {
            const mapped = data.map((c: any) => {
               // Render various colors based on id (just to make it look dynamic)
               const colors = ["#6366f1", "#10b981", "#0ea5e9", "#f59e0b"];
               const bgs = [
                  "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                  "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                  "linear-gradient(135deg, #f0f9ff, #bae6fd)",
                  "linear-gradient(135deg, #fffbeb, #fde68a)"
               ];
               const cIndex = c.id % 4;

               return {
                  name: c.name,
                  field: "Software Product", // Default or map properly if joined with category
                  rating: "4.8", // Hardcoded mock
                  employees: c.size || "100-200",
                  location: "TP.HCM", // Hardcoded mock
                  openJobs: 15, // Hardcoded mock
                  color: colors[cIndex],
                  bg: bgs[cIndex],
                  initial: c.name ? c.name.charAt(0).toUpperCase() : "C",
               };
            });
            setCompanies(mapped);
         })
         .catch(err => console.error("API error:", err));
   }, []);

   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-40px", right: "80px", width: "200px", height: "200px",
               borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(40px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-30px", left: "20%", width: "150px", height: "150px",
               borderRadius: "50%", background: "rgba(16,185,129,0.1)", filter: "blur(30px)",
            }} />
            <span style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
               borderRadius: "999px", padding: "4px 14px", fontSize: "11px",
               color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
            }}>
               <Building2 style={{ width: 11, height: 11 }} />
               500+ DOANH NGHIỆP ĐỐI TÁC
            </span>
            {/* <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Khám phá <span style={{ color: "#818cf8" }}>công ty</span>
            </h1> */}
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.7 }}>
               Khám phá nhà tuyển dụng theo lĩnh vực, văn hóa và đánh giá từ ứng viên.
            </p>
         </div>

         {/* Filter bar */}
         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Tất cả", "Software", "Fintech", "HealthTech", "Ecommerce", "AI & Data"].map((f, i) => (
               <button key={f} style={{
                  padding: "7px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                  border: i === 0 ? "none" : "1px solid #e2e8f0",
                  background: i === 0 ? "#0f172a" : "#fff",
                  color: i === 0 ? "#fff" : "#475569",
                  cursor: "pointer",
               }}>
                  {f}
               </button>
            ))}
         </div>

         {/* Company Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {companies.map((item) => {
               const fc = fieldColors[item.field] ?? { bg: "#f1f5f9", text: "#475569" };
               return (
                  <article key={item.name} style={{
                     background: "#fff", borderRadius: "20px", padding: "28px",
                     border: "1px solid #f1f5f9",
                     boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                     transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.05)"; }}
                  >
                     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                        {/* Logo */}
                        <div style={{
                           width: "60px", height: "60px", borderRadius: "16px",
                           background: item.bg, border: `2px solid ${item.color}30`,
                           display: "flex", alignItems: "center", justifyContent: "center",
                           fontSize: "24px", fontWeight: 900, color: item.color, flexShrink: 0,
                        }}>
                           {item.initial}
                        </div>
                        {/* Field tag */}
                        <span style={{
                           background: fc.bg, color: fc.text,
                           borderRadius: "999px", padding: "4px 12px",
                           fontSize: "11px", fontWeight: 700,
                        }}>
                           {item.field}
                        </span>
                     </div>

                     <h3 style={{ marginTop: "16px", fontSize: "20px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
                        {item.name}
                     </h3>

                     <div style={{ display: "flex", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                           <Star style={{ width: 14, height: 14, fill: "#f59e0b" }} /> {item.rating}/5
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#64748b" }}>
                           <Users style={{ width: 13, height: 13 }} /> {item.employees} nhân viên
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#64748b" }}>
                           <MapPin style={{ width: 13, height: 13 }} /> {item.location}
                        </span>
                     </div>

                     {/* Rating bar */}
                     <div style={{ marginTop: "16px" }}>
                        <div style={{ height: "5px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                           <div style={{
                              width: `${(parseFloat(item.rating) / 5) * 100}%`,
                              height: "100%",
                              background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                              borderRadius: "99px",
                           }} />
                        </div>
                     </div>

                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px" }}>
                        <span style={{
                           background: `${item.color}15`, color: item.color,
                           borderRadius: "8px", padding: "4px 12px", fontSize: "12px", fontWeight: 700,
                        }}>
                           {item.openJobs} vị trí đang mở
                        </span>
                        <button style={{
                           display: "inline-flex", alignItems: "center", gap: "6px",
                           background: item.color, color: "#fff",
                           borderRadius: "10px", padding: "8px 18px",
                           fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                           boxShadow: `0 4px 14px ${item.color}40`,
                        }}>
                           Xem vị trí <ArrowRight style={{ width: 14, height: 14 }} />
                        </button>
                     </div>
                  </article>
               );
            })}
         </div>
      </div>
   );
}