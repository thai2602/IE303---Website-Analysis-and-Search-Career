import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
   return (
      <footer className="relative mt-10 overflow-hidden text-white">
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
         <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
         <div className="absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
         <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
         <div className="relative mx-auto max-w-[1200px] px-4 py-14 md:px-6">
            <div className="grid grid-cols-1 gap-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
               {/* Brand */}
               <div>
                  <div className="flex items-center gap-2.5 mb-4">
                     <div className="h-9 w-9 rounded-xl border border-white/15 bg-gradient-to-br from-emerald-400/90 to-teal-700 text-white font-black text-sm grid place-items-center shadow-lg shadow-emerald-500/20">
                        JP
                     </div>
                     <p className="text-base font-bold">JobPilot</p>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">
                     Nền tảng tư vấn và kết nối việc làm, hỗ trợ ứng viên định hướng nghề nghiệp và tối ưu CV.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                     <a href="tel:02473021122" className="flex items-center gap-2 text-sm text-white/60 hover:text-emerald-300 transition-colors">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        024 7302 1122
                     </a>
                     <a href="mailto:hotro@jobpilot.vn" className="flex items-center gap-2 text-sm text-white/60 hover:text-emerald-300 transition-colors">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        hotro@jobpilot.vn
                     </a>
                     <span className="flex items-start gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        100 Nguyen Van Cu, Quan 1, TP Ho Chi Minh
                     </span>
                  </div>
               </div>

               {/* Company */}
               <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Điều hướng</h4>
                  <ul className="flex flex-col gap-2.5">
                     {[
                        { label: "Trang chủ", href: "/" },
                        { label: "Tìm việc", href: "/tim-viec" },
                        { label: "Công ty", href: "/cong-ty" },
                        { label: "CV mẫu", href: "/cv-mau" },
                     ].map((item) => (
                        <li key={item.href}>
                           <Link to={item.href} className="text-sm text-white/60 hover:text-emerald-300 transition-colors">
                              {item.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Services */}
               <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Nội dung</h4>
                  <ul className="flex flex-col gap-2.5">
                     {[
                        { label: "Tiện ích lương", href: "/tien-ich" },
                        { label: "Đãi ngộ", href: "/tien-ich" },
                        { label: "Cẩm nang", href: "/cam-nang" },
                        { label: "Đăng nhập", href: "/dang-nhap" },
                        { label: "Đăng ký", href: "/dang-ky" },
                     ].map((item, i) => (
                        <li key={i}>
                           <Link to={item.href} className="text-sm text-white/60 hover:text-emerald-300 transition-colors">
                              {item.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Support */}
               <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Tư vấn</h4>
                  <ul className="flex flex-col gap-2.5">
                     {[
                        { label: "Tư vấn nghề nghiệp", href: "/cam-nang" },
                        { label: "Hướng dẫn viết CV", href: "/cv-mau" },
                        { label: "Kinh nghiệm phỏng vấn", href: "/cam-nang" },
                        { label: "Bảo mật", href: "/dang-ky" },
                        { label: "Điều khoản", href: "/dang-ky" },
                     ].map((item, i) => (
                        <li key={i}>
                           <Link to={item.href} className="text-sm text-white/60 hover:text-emerald-300 transition-colors">
                              {item.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
               <p className="text-xs text-white/45">© {new Date().getFullYear()} JobPilot. All rights reserved.</p>
               <p className="text-xs text-white/45">Nền tảng thử nghiệm frontend cho hệ thống tư vấn việc làm.</p>
            </div>
         </div>
      </footer>
   );
}
