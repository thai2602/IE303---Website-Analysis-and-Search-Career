import { BadgeDollarSign, Gift, ShieldCheck, ArrowRight, Zap, BarChart3, TrendingUp } from "lucide-react";

const tools = [
   {
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
      title: "Kiểm tra hợp đồng",
      desc: "Danh sách điều khoản cần lưu ý khi nhận việc — bảo vệ quyền lợi của bạn từ ngày đầu tiên.",
      icon: ShieldCheck,
      accent: "#0ea5e9",
      bg: "linear-gradient(145deg, #0c4a6e, #075985)",
      lightBg: "linear-gradient(135deg, #f0f9ff, #bae6fd)",
      badge: "Miễn phí",
      stats: "30+ điều khoản",
      statsIcon: Zap,
   },
];

export default function UtilitiesPage() {
   return (
      <div className="space-y-10">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-50px", right: "10%", width: "230px", height: "230px",
               borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(45px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-30px", left: "20%", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(16,185,129,0.1)", filter: "blur(35px)",
            }} />

            <span style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
               borderRadius: "999px", padding: "4px 14px", fontSize: "11px",
               color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
            }}>
               <Zap style={{ width: 11, height: 11 }} />
               3 CÔNG CỤ HỮU ÍCH
            </span>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Bộ tiện ích{" "}
               <span style={{
                  background: "linear-gradient(90deg, #818cf8, #6ee7b7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
               }}>
                  nghề nghiệp
               </span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.7 }}>
               Cung cấp công cụ ước tính lương, đánh giá đãi ngộ và check-list trước khi nhận việc.
            </p>
         </div>

         {/* Tool Cards */}
         <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool) => {
               const Icon = tool.icon;
               const StatsIcon = tool.statsIcon;
               return (
                  <article key={tool.title} style={{
                     borderRadius: "24px", overflow: "hidden",
                     boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                     transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 50px rgba(0,0,0,0.2)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}
                  >
                     {/* Card top — dark with icon */}
                     <div style={{
                        background: tool.bg, padding: "32px 28px",
                        position: "relative", overflow: "hidden",
                     }}>
                        <div style={{
                           position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px",
                           borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none",
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
                           background: tool.accent, color: "#fff",
                           borderRadius: "12px", padding: "11px 20px",
                           fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
                           boxShadow: `0 4px 16px ${tool.accent}40`,
                           transition: "opacity 0.2s",
                        }}
                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                        >
                           Mở tiện ích <ArrowRight style={{ width: 15, height: 15 }} />
                        </button>
                     </div>
                  </article>
               );
            })}
         </div>

         {/* Bottom banner */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            border: "1px solid #a7f3d0",
            padding: "32px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap",
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