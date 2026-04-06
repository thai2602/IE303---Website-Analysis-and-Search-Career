import { Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const perks = [
   "Lưu và quản lý nhiều mẫu CV",
   "Nhận gợi ý việc làm phù hợp",
   "Ứng tuyển chỉ với 1 click",
   "Theo dõi trạng thái ứng tuyển",
];

export default function RegisterPage() {
   const [showPassword, setShowPassword] = useState(false);

   return (
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
         {/* Left — Form */}
         <div style={{ flex: "1 1 340px" }}>
            <div style={{
               background: "#fff", borderRadius: "24px", padding: "40px",
               boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9",
            }}>
               {/* Step indicator */}
               <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
                  {[1, 2, 3].map((step) => (
                     <div key={step} style={{
                        height: "4px", flex: 1, borderRadius: "99px",
                        background: step === 1 ? "#10b981" : step === 2 ? "#d1fae5" : "#f1f5f9",
                     }} />
                  ))}
               </div>

               <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  Tạo tài khoản
               </h1>
               <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px" }}>
                  Đã có tài khoản?{" "}
                  <Link to="/dang-nhap" style={{ color: "#10b981", fontWeight: 700, textDecoration: "none" }}>
                     Đăng nhập
                  </Link>
               </p>

               <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Name */}
                  <div>
                     <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                        Họ và tên
                     </label>
                     <div style={{ position: "relative" }}>
                        <User style={{
                           position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                           width: 15, height: 15, color: "#94a3b8",
                        }} />
                        <input
                           type="text"
                           placeholder="Nguyễn Văn A"
                           style={{
                              width: "100%", borderRadius: "12px",
                              border: "1.5px solid #e2e8f0", padding: "11px 14px 11px 38px",
                              fontSize: "14px", outline: "none", color: "#0f172a",
                              boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                           }}
                           onFocus={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)"; }}
                           onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                     </div>
                  </div>

                  {/* Email */}
                  <div>
                     <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                        Email
                     </label>
                     <div style={{ position: "relative" }}>
                        <Mail style={{
                           position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                           width: 15, height: 15, color: "#94a3b8",
                        }} />
                        <input
                           type="email"
                           placeholder="ban@example.com"
                           style={{
                              width: "100%", borderRadius: "12px",
                              border: "1.5px solid #e2e8f0", padding: "11px 14px 11px 38px",
                              fontSize: "14px", outline: "none", color: "#0f172a",
                              boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                           }}
                           onFocus={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)"; }}
                           onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                     </div>
                  </div>

                  {/* Password */}
                  <div>
                     <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                        Mật khẩu
                     </label>
                     <div style={{ position: "relative" }}>
                        <Lock style={{
                           position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                           width: 15, height: 15, color: "#94a3b8",
                        }} />
                        <input
                           type={showPassword ? "text" : "password"}
                           placeholder="Tối thiểu 8 ký tự"
                           style={{
                              width: "100%", borderRadius: "12px",
                              border: "1.5px solid #e2e8f0", padding: "11px 44px 11px 38px",
                              fontSize: "14px", outline: "none", color: "#0f172a",
                              boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                           }}
                           onFocus={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.12)"; }}
                           onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                        <button
                           onClick={() => setShowPassword(!showPassword)}
                           style={{
                              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                              background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                           }}
                        >
                           {showPassword ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                        </button>
                     </div>
                     {/* Strength bar */}
                     <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} style={{
                              flex: 1, height: "3px", borderRadius: "99px",
                              background: i <= 2 ? "#10b981" : "#f1f5f9",
                           }} />
                        ))}
                     </div>
                     <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Độ mạnh: Trung bình</p>
                  </div>

                  {/* Terms */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                     <input type="checkbox" style={{ marginTop: "2px", accentColor: "#10b981" }} />
                     <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6 }}>
                        Tôi đồng ý với{" "}
                        <a href="#" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Điều khoản dịch vụ</a>
                        {" "}và{" "}
                        <a href="#" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Chính sách bảo mật</a>
                     </span>
                  </label>

                  <button style={{
                     width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                     background: "linear-gradient(135deg, #0f172a, #1e293b)",
                     color: "#fff", borderRadius: "12px", padding: "13px",
                     fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer",
                     boxShadow: "0 8px 25px rgba(15,23,42,0.3)",
                     transition: "transform 0.2s",
                  }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                  >
                     <Sparkles style={{ width: 16, height: 16 }} /> Tạo tài khoản ngay
                  </button>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
                     <span style={{ fontSize: "12px", color: "#94a3b8" }}>hoặc</span>
                     <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
                  </div>

                  <button style={{
                     width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                     background: "#fff", color: "#374151",
                     border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "11px",
                     fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  }}>
                     <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                     </svg>
                     Đăng ký bằng Google
                  </button>
               </div>
            </div>
         </div>

         {/* Right — Perks panel */}
         <div style={{
            flex: "1 1 300px",
            borderRadius: "24px",
            background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
            padding: "48px 40px",
            position: "relative",
            overflow: "hidden",
            minHeight: "480px",
         }}>
            <div style={{
               position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px",
               borderRadius: "50%", background: "rgba(16,185,129,0.1)", filter: "blur(40px)",
            }} />
            <div style={{
               position: "absolute", bottom: "-30px", left: "10%", width: "150px", height: "150px",
               borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(35px)",
            }} />

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
               <Sparkles style={{ width: 18, height: 18, color: "#6ee7b7" }} />
               <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>JobPilot</span>
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "8px" }}>
               Mở khóa toàn bộ tính năng
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px", lineHeight: 1.6 }}>
               Tạo tài khoản miễn phí và bắt đầu hành trình sự nghiệp ngay hôm nay.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
               {perks.map((perk) => (
                  <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                     <div style={{
                        width: "22px", height: "22px", borderRadius: "50%",
                        background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                     }}>
                        <CheckCircle2 style={{ width: 13, height: 13, color: "#10b981" }} />
                     </div>
                     <span style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.5 }}>{perk}</span>
                  </div>
               ))}
            </div>

            {/* Social proof */}
            <div style={{
               marginTop: "40px", paddingTop: "28px",
               borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
               <div style={{ display: "flex", gap: "-8px" }}>
                  {["A", "B", "C", "D"].map((l, i) => (
                     <div key={l} style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: ["#10b981", "#6366f1", "#f59e0b", "#ec4899"][i],
                        border: "2px solid #1e293b",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 800, color: "#fff",
                        marginLeft: i > 0 ? "-8px" : "0",
                     }}>
                        {l}
                     </div>
                  ))}
               </div>
               <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>15,000+</span> bạn trẻ đã tìm được việc cùng JobPilot
               </p>
            </div>
         </div>
      </div>
   );
}