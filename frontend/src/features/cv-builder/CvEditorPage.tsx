import React, { useLayoutEffect, useRef, useState } from "react";
import "./cv-builder.css";

interface CvData {
   fullName: string;
   jobTitle: string;
   email: string;
   phone: string;
   location: string;
   summary: string;
   color: string;
}

const COLOR_OPTIONS = [
   { value: "#7c3aed", label: "Tím" },
   { value: "#10b981", label: "Xanh lá" },
   { value: "#0ea5e9", label: "Xanh dương" },
   { value: "#ec4899", label: "Hồng" },
   { value: "#f59e0b", label: "Cam vàng" },
];

const inputCls =
   "w-full px-3 py-2.5 rounded-[10px] border border-slate-200 bg-slate-50 text-[13px] text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:bg-white font-[inherit]";

const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 mt-3.5";

export default function CvEditorPage() {
   const [cvData, setCvData] = useState<CvData>({
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      color: "#7c3aed",
   });

   /*
    * Set --cv-accent on the preview container via DOM API (no JSX style prop).
    * useLayoutEffect fires before paint, so there is no color flash on load.
    */
   const previewRef = useRef<HTMLDivElement>(null);
   useLayoutEffect(() => {
      previewRef.current?.style.setProperty("--cv-accent", cvData.color);
   }, [cvData.color]);

   const handle =
      (field: keyof CvData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
         setCvData((prev) => ({ ...prev, [field]: e.target.value }));

   return (
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start min-h-[calc(100vh-80px)]">

         {/* ── Left: editor panel ── */}
         <aside className="bg-white rounded-[20px] border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden lg:sticky lg:top-6">
            <header className="px-7 pt-6 pb-5 border-b border-slate-100">
               <h1 className="text-xl font-extrabold text-slate-900">Chỉnh sửa CV</h1>
            </header>

            <form className="px-7 py-5 flex flex-col" onSubmit={(e) => e.preventDefault()}>

               {/* Personal info */}
               <section className="mb-7">
                  <h2 className="text-[11px] font-bold text-violet-600 uppercase tracking-[0.06em] mb-3.5 pb-1.5 border-b-2 border-violet-50">
                     Thông tin cá nhân
                  </h2>

                  <label className={labelCls} htmlFor="cv-fullName">Họ và tên</label>
                  <input id="cv-fullName" className={inputCls} type="text"
                     placeholder="Nguyễn Văn A" title="Họ và tên" aria-label="Họ và tên"
                     value={cvData.fullName} onChange={handle("fullName")} />

                  <label className={labelCls} htmlFor="cv-jobTitle">Vị trí / Nghề nghiệp</label>
                  <input id="cv-jobTitle" className={inputCls} type="text"
                     placeholder="Frontend Developer" title="Vị trí hoặc nghề nghiệp" aria-label="Vị trí hoặc nghề nghiệp"
                     value={cvData.jobTitle} onChange={handle("jobTitle")} />

                  <label className={labelCls} htmlFor="cv-email">Email</label>
                  <input id="cv-email" className={inputCls} type="email"
                     placeholder="example@email.com" title="Địa chỉ email" aria-label="Địa chỉ email"
                     value={cvData.email} onChange={handle("email")} />

                  <label className={labelCls} htmlFor="cv-phone">Điện thoại</label>
                  <input id="cv-phone" className={inputCls} type="tel"
                     placeholder="0901 234 567" title="Số điện thoại" aria-label="Số điện thoại"
                     value={cvData.phone} onChange={handle("phone")} />

                  <label className={labelCls} htmlFor="cv-location">Địa chỉ</label>
                  <input id="cv-location" className={inputCls} type="text"
                     placeholder="Hà Nội, Việt Nam" title="Địa chỉ làm việc" aria-label="Địa chỉ làm việc"
                     value={cvData.location} onChange={handle("location")} />

                  <label className={labelCls} htmlFor="cv-summary">Tóm tắt bản thân</label>
                  <textarea id="cv-summary"
                     className={`${inputCls} resize-y min-h-[90px]`}
                     placeholder="Mô tả ngắn về bản thân và mục tiêu nghề nghiệp..."
                     title="Tóm tắt bản thân" aria-label="Tóm tắt bản thân"
                     rows={4} value={cvData.summary} onChange={handle("summary")} />
               </section>

               {/* Accent colour */}
               <section className="mb-7">
                  <h2 className="text-[11px] font-bold text-violet-600 uppercase tracking-[0.06em] mb-3.5 pb-1.5 border-b-2 border-violet-50">
                     Màu sắc chủ đạo
                  </h2>
                  <label className={labelCls} htmlFor="cv-accentColor">Chọn màu nhấn</label>
                  <select id="cv-accentColor" className={inputCls}
                     title="Chọn màu nhấn CV" aria-label="Chọn màu nhấn CV"
                     value={cvData.color} onChange={handle("color")}>
                     {COLOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label} – {opt.value}</option>
                     ))}
                  </select>
               </section>

               <button
                  type="submit"
                  className="w-full py-3 bg-violet-700 text-white rounded-xl text-sm font-bold border-none cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:opacity-90 active:scale-[0.98] transition-all mt-1"
                  title="Lưu thay đổi CV"
                  aria-label="Lưu thay đổi CV"
               >
                  Lưu thay đổi
               </button>
            </form>
         </aside>

         {/* ── Right: live preview ──
             ref + useLayoutEffect sets --cv-accent on this div before paint.
             All children reference [background:var(--cv-accent)] / [color:var(--cv-accent)]
             via Tailwind arbitrary values — zero style={} props below. ── */}
         <div ref={previewRef} className="py-1" aria-label="Xem trước CV" role="region">
            <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px]">

               {/* CV header — bg from --cv-accent */}
               <div className="[background:var(--cv-accent,#7c3aed)] flex items-center gap-4 px-8 py-7 text-white transition-colors duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-[22px] font-extrabold shrink-0" aria-hidden="true">
                     {cvData.fullName ? cvData.fullName[0].toUpperCase() : "?"}
                  </div>
                  <div>
                     <p className="text-[22px] font-extrabold mb-0.5">{cvData.fullName || "Họ và tên"}</p>
                     <p className="text-[13px] opacity-85">{cvData.jobTitle || "Vị trí"}</p>
                  </div>
               </div>

               {/* CV body */}
               <div className="px-8 py-7 flex flex-col gap-5">

                  {/* Contact */}
                  <section>
                     <h3 className="[color:var(--cv-accent,#7c3aed)] text-[11px] font-bold uppercase tracking-[0.06em] mb-2 transition-colors duration-300">
                        Liên hệ
                     </h3>
                     <ul className="list-none p-0 m-0 flex flex-col gap-1 text-[13px] text-slate-600">
                        {cvData.email    && <li>✉ {cvData.email}</li>}
                        {cvData.phone    && <li>📞 {cvData.phone}</li>}
                        {cvData.location && <li>📍 {cvData.location}</li>}
                        {!cvData.email && !cvData.phone && !cvData.location && (
                           <li className="text-slate-300 italic text-xs">Chưa có thông tin</li>
                        )}
                     </ul>
                  </section>

                  {/* Summary */}
                  {cvData.summary && (
                     <section>
                        <h3 className="[color:var(--cv-accent,#7c3aed)] text-[11px] font-bold uppercase tracking-[0.06em] mb-2 transition-colors duration-300">
                           Giới thiệu
                        </h3>
                        <p className="text-[13px] text-slate-600 leading-relaxed">{cvData.summary}</p>
                     </section>
                  )}

                  {/* Skeleton: Kinh nghiệm */}
                  <section>
                     <h3 className="[color:var(--cv-accent,#7c3aed)] text-[11px] font-bold uppercase tracking-[0.06em] mb-2 transition-colors duration-300">
                        Kinh nghiệm
                     </h3>
                     <div className="h-2.5 rounded-full bg-slate-200 mb-1.5 w-full" aria-hidden="true" />
                     <div className="h-2.5 rounded-full bg-slate-200 mb-1.5 w-[65%]" aria-hidden="true" />
                  </section>

                  {/* Skeleton: Học vấn */}
                  <section>
                     <h3 className="[color:var(--cv-accent,#7c3aed)] text-[11px] font-bold uppercase tracking-[0.06em] mb-2 transition-colors duration-300">
                        Học vấn
                     </h3>
                     <div className="h-2.5 rounded-full bg-slate-200 w-full" aria-hidden="true" />
                  </section>

               </div>
            </div>
         </div>
      </div>
   );
}
