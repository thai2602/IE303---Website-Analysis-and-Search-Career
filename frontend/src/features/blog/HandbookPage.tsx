import { BookOpenText, CheckCircle, Clock, ChevronRight, TrendingUp, Lightbulb, MessageSquare, Shield } from "lucide-react";

const guides = [
   {
      title: "Cách viết CV ngắn gọn, đúng từ khóa ATS",
      category: "CV & Hồ sơ",
      readTime: "5 phút",
      icon: CheckCircle,
      color: "#10b981",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      featured: true,
   },
   {
      title: "5 bước chuẩn bị cho phỏng vấn đầu tiên",
      category: "Phỏng vấn",
      readTime: "7 phút",
      icon: MessageSquare,
      color: "#6366f1",
      bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
      featured: false,
   },
   {
      title: "Cách đàm phán lương mà vẫn lịch sự",
      category: "Thương lượng",
      readTime: "6 phút",
      icon: TrendingUp,
      color: "#f59e0b",
      bg: "linear-gradient(135deg, #fffbeb, #fde68a)",
      featured: false,
   },
   {
      title: "Những dấu hiệu môi trường làm việc tích cực",
      category: "Văn hóa công ty",
      readTime: "4 phút",
      icon: Shield,
      color: "#0ea5e9",
      bg: "linear-gradient(135deg, #f0f9ff, #bae6fd)",
      featured: false,
   },
];

const categories = [
   { label: "CV & Hồ sơ", count: 12, color: "#10b981" },
   { label: "Phỏng vấn", count: 8, color: "#6366f1" },
   { label: "Thương lượng", count: 6, color: "#f59e0b" },
   { label: "Phát triển sự nghiệp", count: 15, color: "#ec4899" },
];

export default function HandbookPage() {
   const featured = guides[0];
   const rest = guides.slice(1);

   return (
      <div className="space-y-8">
         {/* Hero */}
         <div style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
         }}>
            <div style={{
               position: "absolute", top: "-30px", right: "60px", width: "180px", height: "180px",
               borderRadius: "50%", background: "rgba(153,246,228,0.2)", filter: "blur(35px)",
            }} />
            <span style={{
               display: "inline-flex", alignItems: "center", gap: "6px",
               background: "rgba(153,246,228,0.2)", border: "1px solid rgba(153,246,228,0.4)",
               borderRadius: "999px", padding: "4px 14px", fontSize: "11px",
               color: "#99f6e4", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
            }}>
               <BookOpenText style={{ width: 11, height: 11 }} />
               41 BÀI VIẾT HƯỚNG DẪN
            </span>
            <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "10px" }}>
               Cẩm nang <span style={{ color: "#99f6e4" }}>việc làm</span>
            </h1>
            <p style={{ color: "#99f6e4", fontSize: "15px", lineHeight: 1.7 }}>
               Bộ nội dung hướng dẫn từ tạo CV đến phỏng vấn và phát triển sự nghiệp bền vững.
            </p>
         </div>

         {/* Category pills */}
         <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
               <button key={cat.label} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "7px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                  background: `${cat.color}12`, color: cat.color,
                  border: `1px solid ${cat.color}30`, cursor: "pointer",
               }}>
                  {cat.label}
                  <span style={{
                     background: cat.color, color: "#fff",
                     borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                     padding: "1px 6px",
                  }}>
                     {cat.count}
                  </span>
               </button>
            ))}
         </div>

         {/* Featured article */}
         <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: featured.bg, border: "1px solid #d1fae5",
            padding: "36px", position: "relative",
            boxShadow: "0 8px 30px rgba(16,185,129,0.12)",
         }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
               <div style={{ maxWidth: "520px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "14px" }}>
                     <span style={{
                        background: featured.color, color: "#fff",
                        borderRadius: "999px", padding: "3px 12px",
                        fontSize: "11px", fontWeight: 700,
                     }}>
                        ✦ NỔI BẬT
                     </span>
                     <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock style={{ width: 12, height: 12 }} /> {featured.readTime} đọc
                     </span>
                  </div>
                  <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: "12px" }}>
                     {featured.title}
                  </h2>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, marginBottom: "20px" }}>
                     Hướng dẫn chi tiết cách xây dựng CV vượt qua hệ thống ATS tự động, chọn đúng từ khóa theo ngành và trình bày thông tin ấn tượng nhất.
                  </p>
                  <button style={{
                     display: "inline-flex", alignItems: "center", gap: "6px",
                     background: featured.color, color: "#fff",
                     borderRadius: "10px", padding: "10px 22px",
                     fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                     boxShadow: `0 4px 15px ${featured.color}40`,
                  }}>
                     Đọc ngay <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
               </div>
               <div style={{
                  width: "100px", height: "100px", borderRadius: "24px",
                  background: featured.color, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: `0 12px 30px ${featured.color}40`,
               }}>
                  <Lightbulb style={{ width: 48, height: 48, color: "#fff" }} />
               </div>
            </div>
         </div>

         {/* Article list */}
         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
               Bài viết khác
            </h3>
            {rest.map((item) => {
               const Icon = item.icon;
               return (
                  <div key={item.title} style={{
                     display: "flex", alignItems: "center", gap: "16px",
                     background: "#fff", borderRadius: "16px", padding: "18px 22px",
                     border: "1px solid #f1f5f9", cursor: "pointer",
                     boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                     transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${item.color}15`; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                  >
                     <div style={{
                        width: "44px", height: "44px", borderRadius: "12px",
                        background: item.bg, display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                        border: `1px solid ${item.color}20`,
                     }}>
                        <Icon style={{ width: 18, height: 18, color: item.color }} />
                     </div>
                     <div style={{ flex: 1 }}>
                        <span style={{
                           fontSize: "11px", fontWeight: 700, color: item.color,
                           letterSpacing: "0.03em",
                        }}>
                           {item.category}
                        </span>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                           {item.title}
                        </p>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                        <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                           <Clock style={{ width: 11, height: 11 }} /> {item.readTime}
                        </span>
                        <ChevronRight style={{ width: 16, height: 16, color: "#cbd5e1" }} />
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}