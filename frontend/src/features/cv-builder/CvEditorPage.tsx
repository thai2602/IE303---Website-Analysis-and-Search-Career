import React, { useState } from "react";
import "./CvEditorPage.css";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
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

   const handle =
      (field: keyof CvData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
         setCvData((prev) => ({ ...prev, [field]: e.target.value }));

   return (
      <div className="cved-layout">
         {/* ---- Left: editor panel ---- */}
         <aside className="cved-panel">
            <header className="cved-panel-header">
               <h1 className="cved-panel-title">Chỉnh sửa CV</h1>
            </header>

            <form className="cved-form" onSubmit={(e) => e.preventDefault()}>
               {/* Personal info */}
               <section className="cved-section">
                  <h2 className="cved-section-title">Thông tin cá nhân</h2>

                  <label className="cved-label" htmlFor="cv-fullName">
                     Họ và tên
                  </label>
                  <input
                     id="cv-fullName"
                     className="cved-input"
                     type="text"
                     placeholder="Nguyễn Văn A"
                     title="Họ và tên"
                     aria-label="Họ và tên"
                     value={cvData.fullName}
                     onChange={handle("fullName")}
                  />

                  <label className="cved-label" htmlFor="cv-jobTitle">
                     Vị trí / Nghề nghiệp
                  </label>
                  <input
                     id="cv-jobTitle"
                     className="cved-input"
                     type="text"
                     placeholder="Frontend Developer"
                     title="Vị trí hoặc nghề nghiệp"
                     aria-label="Vị trí hoặc nghề nghiệp"
                     value={cvData.jobTitle}
                     onChange={handle("jobTitle")}
                  />

                  <label className="cved-label" htmlFor="cv-email">
                     Email
                  </label>
                  <input
                     id="cv-email"
                     className="cved-input"
                     type="email"
                     placeholder="example@email.com"
                     title="Địa chỉ email"
                     aria-label="Địa chỉ email"
                     value={cvData.email}
                     onChange={handle("email")}
                  />

                  <label className="cved-label" htmlFor="cv-phone">
                     Điện thoại
                  </label>
                  <input
                     id="cv-phone"
                     className="cved-input"
                     type="tel"
                     placeholder="0901 234 567"
                     title="Số điện thoại"
                     aria-label="Số điện thoại"
                     value={cvData.phone}
                     onChange={handle("phone")}
                  />

                  <label className="cved-label" htmlFor="cv-location">
                     Địa chỉ
                  </label>
                  <input
                     id="cv-location"
                     className="cved-input"
                     type="text"
                     placeholder="Hà Nội, Việt Nam"
                     title="Địa chỉ làm việc"
                     aria-label="Địa chỉ làm việc"
                     value={cvData.location}
                     onChange={handle("location")}
                  />

                  <label className="cved-label" htmlFor="cv-summary">
                     Tóm tắt bản thân
                  </label>
                  <textarea
                     id="cv-summary"
                     className="cved-textarea"
                     placeholder="Mô tả ngắn về bản thân và mục tiêu nghề nghiệp..."
                     title="Tóm tắt bản thân"
                     aria-label="Tóm tắt bản thân"
                     rows={4}
                     value={cvData.summary}
                     onChange={handle("summary")}
                  />
               </section>

               {/* Accent colour picker */}
               <section className="cved-section">
                  <h2 className="cved-section-title">Màu sắc chủ đạo</h2>

                  <label className="cved-label" htmlFor="cv-accentColor">
                     Chọn màu nhấn
                  </label>
                  <select
                     id="cv-accentColor"
                     className="cved-select"
                     title="Chọn màu nhấn CV"
                     aria-label="Chọn màu nhấn CV"
                     value={cvData.color}
                     onChange={handle("color")}
                  >
                     {COLOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                           {opt.label} – {opt.value}
                        </option>
                     ))}
                  </select>
               </section>

               <button
                  type="submit"
                  className="cved-btn-save"
                  title="Lưu thay đổi CV"
                  aria-label="Lưu thay đổi CV"
               >
                  Lưu thay đổi
               </button>
            </form>
         </aside>

         {/* ---- Right: live preview ---- */}
         {/*
          * Using a single CSS custom property on the root preview element
          * avoids multiple dynamic inline-style props on children.
          * All accent-colored children reference var(--cv-accent) in CSS.
          */}
         <main
            className="cved-preview"
            aria-label="Xem trước CV"
            style={{ "--cv-accent": cvData.color } as React.CSSProperties}
         >
            <div className="cved-cv-card">
               {/* CV header — background color comes from var(--cv-accent) in CSS */}
               <div className="cved-cv-header">
                  <div className="cved-cv-avatar" aria-hidden="true">
                     {cvData.fullName ? cvData.fullName[0].toUpperCase() : "?"}
                  </div>
                  <div>
                     <p className="cved-cv-name">{cvData.fullName || "Họ và tên"}</p>
                     <p className="cved-cv-role">{cvData.jobTitle || "Vị trí"}</p>
                  </div>
               </div>

               {/* CV body */}
               <div className="cved-cv-body">
                  {/* Contact */}
                  <section className="cved-cv-section">
                     <h3 className="cved-cv-section-title">Liên hệ</h3>
                     <ul className="cved-cv-list">
                        {cvData.email && <li>✉ {cvData.email}</li>}
                        {cvData.phone && <li>📞 {cvData.phone}</li>}
                        {cvData.location && <li>📍 {cvData.location}</li>}
                        {!cvData.email && !cvData.phone && !cvData.location && (
                           <li className="cved-cv-placeholder">Chưa có thông tin</li>
                        )}
                     </ul>
                  </section>

                  {/* Summary */}
                  {cvData.summary && (
                     <section className="cved-cv-section">
                        <h3 className="cved-cv-section-title">Giới thiệu</h3>
                        <p className="cved-cv-summary">{cvData.summary}</p>
                     </section>
                  )}

                  {/* Skeleton placeholders */}
                  <section className="cved-cv-section">
                     <h3 className="cved-cv-section-title">Kinh nghiệm</h3>
                     <div className="cved-skeleton-block" aria-hidden="true" />
                     <div className="cved-skeleton-block cved-skeleton-block--short" aria-hidden="true" />
                  </section>

                  <section className="cved-cv-section">
                     <h3 className="cved-cv-section-title">Học vấn</h3>
                     <div className="cved-skeleton-block" aria-hidden="true" />
                  </section>
               </div>
            </div>
         </main>
      </div>
   );
}
