import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logoImg from "../assets/logo/Screenshot_2026-05-07_133557-removebg-preview.png";

export default function Footer() {
   const location = useLocation();
   return (
      <footer className="relative mt-16 px-3">
         <div className="max-w-[1200px] mx-auto">
            <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-white/95 to-white/85 px-6 py-12 md:px-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.35)] backdrop-blur-xl">
               <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Brand */}
                  <div>
                     <div className="flex items-center gap-2.5 mb-4">
                        <img
                           src={logoImg}
                           alt="JobPilot Logo"
                           className="h-9 w-9 object-contain"
                        />
                        <p className="text-base font-bold text-slate-900">JobPilot</p>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        Nền tảng tư vấn và kết nối việc làm, hỗ trợ ứng viên định hướng nghề nghiệp và tối ưu CV.
                     </p>
                     <div className="flex flex-col gap-2 mt-4">
                        <a href="tel:02473021122" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 transition-colors">
                           <Phone className="w-4 h-4 flex-shrink-0" />
                           024 7302 1122
                        </a>
                        <a href="mailto:hotro@jobpilot.vn" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 transition-colors">
                           <Mail className="w-4 h-4 flex-shrink-0" />
                           hotro@jobpilot.vn
                        </a>
                        <span className="flex items-start gap-2 text-sm text-gray-600">
                           <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                           100 Nguyen Van Cu, Quan 1, TP Ho Chi Minh
                        </span>
                     </div>
                  </div>

                  {/* Services */}
                  <div>
                     <h4 className="text-sm font-semibold text-slate-900 mb-4">Công cụ</h4>
                     <ul className="flex flex-col gap-2.5">
                        {[
                           { label: "Tìm việc", href: "/tim-viec" },
                           { label: "CV mẫu", href: "/cv-mau" },
                           { label: "Tiện ích lương", href: "/tien-ich" },
                           { label: "Cẩm nang", href: "/cam-nang" },
                        ].map((item, i) => {
                           const isActive = location.pathname === item.href;
                           return (
                              <li key={i}>
                                 <Link
                                    to={item.href}
                                    className={`text-sm transition-all duration-200 font-medium ${isActive
                                       ? "text-[#0f4c51] font-semibold"
                                       : "text-gray-600 hover:text-[#0f4c51] hover:font-semibold"
                                       }`}
                                 >
                                    {item.label}
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  </div>

                  {/* Account */}
                  <div>
                     <h4 className="text-sm font-semibold text-slate-900 mb-4">Tài khoản</h4>
                     <ul className="flex flex-col gap-2.5">
                        {[
                           { label: "Đăng nhập", href: "/dang-nhap" },
                           { label: "Đăng ký", href: "/dang-ky" },
                           { label: "Hồ sơ người dùng", href: "/ho-so-nguoi-dung" },
                           { label: "CV của tôi", href: "/cv-cua-toi" },
                        ].map((item, i) => {
                           const isActive = location.pathname === item.href;
                           return (
                              <li key={i}>
                                 <Link
                                    to={item.href}
                                    className={`text-sm transition-all duration-200 font-medium ${isActive
                                       ? "text-[#0f4c51] font-semibold"
                                       : "text-gray-600 hover:text-[#0f4c51] hover:font-semibold"
                                       }`}
                                 >
                                    {item.label}
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  </div>

                  {/* Support */}
                  <div>
                     <h4 className="text-sm font-semibold text-slate-900 mb-4">Hỗ trợ</h4>
                     <ul className="flex flex-col gap-2.5">
                        {[
                           { label: "Tư vấn nghề nghiệp", href: "/cam-nang" },
                           { label: "Hướng dẫn viết CV", href: "/cv-mau" },
                           { label: "Kinh nghiệm phỏng vấn", href: "/cam-nang" },
                           { label: "Chính sách bảo mật", href: "/dang-ky" },
                        ].map((item, i) => {
                           const isActive = location.pathname === item.href;
                           return (
                              <li key={i}>
                                 <Link
                                    to={item.href}
                                    className={`text-sm transition-all duration-200 font-medium ${isActive
                                       ? "text-[#0f4c51] font-semibold"
                                       : "text-gray-600 hover:text-[#0f4c51] hover:font-semibold"
                                       }`}
                                 >
                                    {item.label}
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  </div>
               </div>

               {/* Divider */}
               <div className="border-t border-gray-200 mt-8 pt-6">
                  <p className="text-xs text-gray-600 text-center">
                     © 2026 JobPilot. All rights reserved.
                  </p>
               </div>
            </div>
         </div>
      </footer>
   );
}