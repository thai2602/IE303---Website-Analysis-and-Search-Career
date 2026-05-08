import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { readAuthUser } from "../../utils/auth";

type CvEntry = {
   period: string;
   title: string;
   subtitle?: string;
   details?: string[];
};

type SampleCv = {
   fullName: string;
   title: string;
   avatar: string;
   summary: string;
   personalInfo: Array<{ label: string; value: string }>;
   objective: string;
   education: CvEntry[];
   experience: CvEntry[];
   activities: CvEntry[];
   certificates: string[];
   awards: string[];
   skills: string[];
   references: string[];
   hobbies: string[];
};

type SavedCvItem = {
   id: string;
   name: string;
   role: string;
   createdAt: string;
   cv: SampleCv;
};

const MY_CVS_STORAGE_KEY = "jobpilot.my-cvs";

export default function MyCvsPage() {
   const currentUser = readAuthUser();
   const [myCvs, setMyCvs] = useState<SavedCvItem[]>([]);
   const [previewCvItem, setPreviewCvItem] = useState<SavedCvItem | null>(null);

   useEffect(() => {
      const raw = localStorage.getItem(MY_CVS_STORAGE_KEY);
      if (!raw) {
         return;
      }

      try {
         const parsed = JSON.parse(raw) as SavedCvItem[];
         if (Array.isArray(parsed)) {
            setMyCvs(parsed);
         }
      } catch {
         setMyCvs([]);
      }
   }, []);

   const handleDeleteMyCv = (id: string) => {
      const updated = myCvs.filter((item) => item.id !== id);
      setMyCvs(updated);
      localStorage.setItem(MY_CVS_STORAGE_KEY, JSON.stringify(updated));
   };

   const renderEntry = (entry: CvEntry) => (
      <div
         key={`${entry.title}-${entry.period}`}
         style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "12px 14px",
            background: "#fff",
         }}
      >
         <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
            <div>
               <p style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{entry.title}</p>
               {entry.subtitle && <p style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{entry.subtitle}</p>}
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", background: "#f8fafc", borderRadius: "999px", padding: "3px 8px" }}>
               {entry.period}
            </span>
         </div>
         {entry.details?.length ? (
            <ul style={{ margin: "8px 0 0", paddingLeft: "16px", color: "#334155", fontSize: "12px", lineHeight: 1.6 }}>
               {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
               ))}
            </ul>
         ) : null}
      </div>
   );

   if (!currentUser) {
      return (
         <section className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">CV của tôi</h1>
            <p className="mt-2 text-sm text-gray-600">Bạn cần đăng nhập để xem danh sách CV đã tạo.</p>
            <Link
               to="/dang-nhap"
               className="mt-5 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
               Đến trang đăng nhập
            </Link>
         </section>
      );
   }

   return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
         <h1 className="text-2xl font-black text-gray-900">CV của tôi</h1>
         <p className="mt-2 text-sm text-gray-600">
            Danh sách CV của <span className="font-bold text-gray-800">{currentUser.name}</span>.
         </p>

         <div className="mt-6 rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Danh sách</p>
                  <h2 className="mt-1 text-lg font-black text-gray-900">Các CV đã tạo</h2>
               </div>
               <p className="text-sm font-semibold text-gray-500">Tổng cộng: {myCvs.length} CV</p>
            </div>

            {myCvs.length === 0 ? (
               <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-800">Bạn chưa tạo CV nào.</p>
                  <p className="mt-1 text-sm text-gray-600">Hãy vào trang CV mẫu để tạo CV mới, danh sách sẽ hiện tại đây.</p>
               </div>
            ) : (
               <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {myCvs.map((item) => (
                     <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-sm font-black text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{item.role}</p>
                        <p className="mt-1 text-xs text-gray-500">Tạo lúc: {item.createdAt}</p>

                        <div className="mt-3 flex gap-2">
                           <button
                              type="button"
                              onClick={() => setPreviewCvItem(item)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                           >
                              Xem CV
                           </button>
                           <button
                              type="button"
                              onClick={() => handleDeleteMyCv(item.id)}
                              className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                           >
                              Xóa
                           </button>
                        </div>
                     </article>
                  ))}
               </div>
            )}
         </div>

         {previewCvItem && (
            <div
               style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.55)",
                  zIndex: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "40px 16px",
                  overflowY: "auto",
               }}
               onClick={() => setPreviewCvItem(null)}
            >
               <section
                  style={{
                     width: "min(900px, 100%)",
                     background: "#ffffff",
                     borderRadius: "20px",
                     border: "1px solid #e2e8f0",
                     boxShadow: "0 20px 60px rgba(15, 23, 42, 0.25)",
                     overflow: "hidden",
                  }}
                  onClick={(event) => event.stopPropagation()}
               >
                  <div
                     style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 20px",
                        borderBottom: "1px solid #e2e8f0",
                        background: "#f8fafc",
                     }}
                  >
                     <div>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>CV của tôi - {previewCvItem.name}</h3>
                        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Thông tin CV đã tạo trước đó.</p>
                     </div>
                     <button
                        onClick={() => setPreviewCvItem(null)}
                        style={{
                           border: "1px solid #cbd5e1",
                           background: "#fff",
                           color: "#334155",
                           borderRadius: "10px",
                           padding: "8px 12px",
                           fontSize: "12px",
                           fontWeight: 700,
                           cursor: "pointer",
                        }}
                     >
                        Đóng
                     </button>
                  </div>

                  <div style={{ padding: "24px" }}>
                     <div style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", background: "#ffffff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "18px", alignItems: "start" }}>
                           <img
                              src={previewCvItem.cv.avatar}
                              alt={previewCvItem.cv.fullName}
                              style={{
                                 width: "120px",
                                 height: "120px",
                                 borderRadius: "18px",
                                 objectFit: "cover",
                                 border: "1px solid #e2e8f0",
                                 background: "#f8fafc",
                              }}
                           />
                           <div>
                              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{previewCvItem.cv.fullName}</h2>
                              <p style={{ fontSize: "14px", color: "#475569", fontWeight: 600 }}>{previewCvItem.cv.title}</p>
                              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px", lineHeight: 1.7 }}>{previewCvItem.cv.summary}</p>
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Thông tin cá nhân</h4>
                           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                              {previewCvItem.cv.personalInfo.map((item) => (
                                 <div key={item.label} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px 12px", background: "#f8fafc" }}>
                                    <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>{item.label}</p>
                                    <p style={{ fontSize: "13px", color: "#0f172a", fontWeight: 700, marginTop: "3px" }}>{item.value}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Mục tiêu nghề nghiệp</h4>
                           <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.7, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px" }}>
                              {previewCvItem.cv.objective}
                           </p>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Học vấn</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCvItem.cv.education.map(renderEntry)}</div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Kinh nghiệm làm việc</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCvItem.cv.experience.map(renderEntry)}</div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                           <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Hoạt động</h4>
                           <div style={{ display: "grid", gap: "10px" }}>{previewCvItem.cv.activities.map(renderEntry)}</div>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         )}
      </section>
   );
}
