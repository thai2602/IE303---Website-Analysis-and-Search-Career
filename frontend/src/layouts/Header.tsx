import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
   clearAuthUser,
   readAuthUser,
   subscribeAuthUserChange,
   type AuthUser,
} from "../utils/auth";

const navLinks = [
   { label: "Tìm việc", href: "/tim-viec" },
   { label: "Công ty", href: "/cong-ty" },
   { label: "CV mẫu", href: "/cv-mau" },
   { label: "Tiện ích", href: "/tien-ich" },
   { label: "Cẩm nang", href: "/cam-nang" },
];

export default function Header() {
   const [mobileOpen, setMobileOpen] = useState(false);
   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
   const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readAuthUser());
   const location = useLocation();
   const profileMenuRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      return subscribeAuthUserChange(setCurrentUser);
   }, []);

   useEffect(() => {
      if (!profileMenuOpen) {
         return;
      }

      const handleClickOutside = (event: MouseEvent) => {
         if (!profileMenuRef.current?.contains(event.target as Node)) {
            setProfileMenuOpen(false);
         }
      };

      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setProfileMenuOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscape);
      };
   }, [profileMenuOpen]);

   useEffect(() => {
      setProfileMenuOpen(false);
   }, [location.pathname]);

   const userInitial = currentUser?.name.trim().charAt(0).toUpperCase() ?? "U";

   return (
      <header className="sticky top-3 z-50 w-full px-3">
         <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-[76px] flex items-center justify-between gap-4">
            <div className="flex h-[76px] w-full items-center justify-between gap-4 rounded-[24px] border border-white/35 bg-white/70 px-4 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl md:px-6">
               {/* Logo */}
               <div className="flex items-center flex-shrink-0">
                  <Link to="/" className="flex items-center gap-2.5">
                     <div className="h-10 w-10 rounded-xl border border-white/50 bg-gradient-to-br from-emerald-500/90 to-teal-700 text-white font-black text-lg grid place-items-center shadow-lg shadow-emerald-500/20">
                        JP
                     </div>
                     <div>
                        <p className="text-slate-900 font-extrabold tracking-tight leading-none">JobPilot</p>
                     </div>
                  </Link>
               </div>

               {/* Desktop Nav */}
               <nav className="hidden lg:flex items-center flex-1 justify-center">
                  <ul className="flex items-center gap-1 rounded-full border border-white/40 bg-white/50 p-1 shadow-inner shadow-white/30 backdrop-blur-md">
                     {navLinks.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                           <li key={link.href}>
                              <Link
                                 to={link.href}
                                 className={`px-3.5 py-2 text-sm font-semibold leading-5 transition-colors rounded-full whitespace-nowrap ${isActive
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-slate-700 hover:text-slate-900 hover:bg-white/70"
                                    }`}
                              >
                                 {link.label}
                              </Link>
                           </li>
                        );
                     })}
                  </ul>
               </nav>

               {/* Desktop Right Section */}
               <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                  {currentUser ? (
                     <div className="relative" ref={profileMenuRef}>
                        <button
                           onClick={() => setProfileMenuOpen((prev) => !prev)}
                           className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 transition-colors hover:bg-emerald-100"
                        >
                           {currentUser.avatarDataUrl ? (
                              <img
                                 src={currentUser.avatarDataUrl}
                                 alt="Avatar"
                                 className="h-8 w-8 rounded-full border border-emerald-200 object-cover"
                              />
                           ) : (
                              <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                 {userInitial}
                              </div>
                           )}
                           <div className="leading-tight text-left">
                              <p className="max-w-[150px] truncate text-sm font-bold text-slate-900">{currentUser.name}</p>
                           </div>
                        </button>

                        {profileMenuOpen && (
                           <div className="absolute right-0 top-[calc(100%+10px)] w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                              <Link
                                 to="/ho-so-nguoi-dung"
                                 className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                 Hồ sơ người dùng
                              </Link>
                              <Link
                                 to="/cv-cua-toi"
                                 className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                 CV của tôi
                              </Link>
                              <Link
                                 to="/cong-viec-da-ung-tuyen"
                                 className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                 Công việc đã ứng tuyển
                              </Link>
                              <button
                                 onClick={() => clearAuthUser()}
                                 className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                              >
                                 Đăng xuất
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <>
                        <Link
                           to="/dang-nhap"
                           className="px-4 py-2 text-sm font-semibold text-slate-700 border border-white/50 bg-white/40 rounded-full hover:bg-white/70 hover:text-slate-900 transition-colors whitespace-nowrap backdrop-blur-md"
                        >
                           Đăng nhập
                        </Link>

                        <Link
                           to="/dang-ky"
                           className="px-4 py-2 text-sm font-semibold text-white bg-slate-900/90 rounded-full hover:bg-slate-800 transition-colors whitespace-nowrap shadow-lg shadow-slate-900/15"
                        >
                           Đăng ký
                        </Link>
                     </>
                  )}
               </div>

               {/* Mobile Toggle */}
               <button
                  className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-white/55 text-slate-800 backdrop-blur-md"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
               >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
               </button>
            </div>
         </div>

         {/* Mobile Menu */}
         {mobileOpen && (
            <div className="mx-auto mt-3 max-w-[1200px] px-3 lg:hidden">
               <div className="rounded-[22px] border border-white/40 bg-white/75 px-4 pb-4 pt-3 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  <nav className="flex flex-col gap-1 pt-2">
                     {navLinks.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                           <Link
                              key={link.href}
                              to={link.href}
                              onClick={() => setMobileOpen(false)}
                              className={`px-3 py-3 text-sm font-semibold rounded-lg ${isActive
                                 ? "text-emerald-700 bg-emerald-50"
                                 : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                                 }`}
                           >
                              {link.label}
                           </Link>
                        );
                     })}
                  </nav>
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/50">
                     {currentUser ? (
                        <>
                           <button
                              onClick={() => setProfileMenuOpen((prev) => !prev)}
                              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2"
                           >
                              {currentUser.avatarDataUrl ? (
                                 <img
                                    src={currentUser.avatarDataUrl}
                                    alt="Avatar"
                                    className="h-9 w-9 rounded-full border border-emerald-200 object-cover"
                                 />
                              ) : (
                                 <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                    {userInitial}
                                 </div>
                              )}
                              <div className="min-w-0 text-left">
                                 <p className="truncate text-sm font-bold text-slate-900">{currentUser.name}</p>
                              </div>
                           </button>

                           {profileMenuOpen && (
                              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
                                 <Link
                                    to="/ho-so-nguoi-dung"
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                 >
                                    Hồ sơ người dùng
                                 </Link>
                                 <Link
                                    to="/cv-cua-toi"
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                 >
                                    CV của tôi
                                 </Link>
                                 <Link
                                    to="/cong-viec-da-ung-tuyen"
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                 >
                                    Công việc đã ứng tuyển
                                 </Link>
                                 <button
                                    onClick={() => {
                                       clearAuthUser();
                                       setMobileOpen(false);
                                    }}
                                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                                 >
                                    Đăng xuất
                                 </button>
                              </div>
                           )}
                        </>
                     ) : (
                        <>
                           <Link
                              to="/dang-nhap"
                              onClick={() => setMobileOpen(false)}
                              className="px-4 py-2.5 text-sm font-semibold text-center text-slate-700 border border-white/60 bg-white/50 rounded-full hover:bg-white/80 hover:text-slate-900 transition-colors backdrop-blur-md"
                           >
                              Đăng nhập
                           </Link>
                           <Link
                              to="/dang-ky"
                              onClick={() => setMobileOpen(false)}
                              className="px-4 py-2.5 text-sm font-semibold text-center text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors"
                           >
                              Đăng ký
                           </Link>
                        </>
                     )}
                  </div>
               </div>
            </div>
         )}
      </header>
   );
}
