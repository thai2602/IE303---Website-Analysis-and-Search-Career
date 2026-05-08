import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Building2, CalendarClock, Clock3, Heart, MapPin, Trash2, Wallet, X } from "lucide-react";
import { getApplicationStatusMeta } from "../utils/application";
import { toVietnameseJobTitle } from "../utils/jobTitle";

type SavedItem = {
   id?: string;
   title?: string;
   company?: string;
   place?: string;
   field?: string;
   salary?: string;
   type?: string;
   appliedAt?: string;
   savedAt?: string;
   status?: string;
};

const readList = (key: string): SavedItem[] => {
   try {
      const raw = localStorage.getItem(key);
      if (!raw) {
         return [];
      }

      const parsed = JSON.parse(raw) as SavedItem[];
      return Array.isArray(parsed) ? parsed : [];
   } catch {
      return [];
   }
};

export default function GlobalSavedTray() {
   const location = useLocation();
   const [showTray, setShowTray] = useState(false);
   const [applications, setApplications] = useState<SavedItem[]>([]);
   const [savedJobs, setSavedJobs] = useState<SavedItem[]>([]);

   const shouldHideBecausePageHasOwnTray = location.pathname === "/tim-viec" || location.pathname === "/cong-ty";

   const syncFromStorage = () => {
      setApplications(readList("jobpilot_applications"));
      setSavedJobs(readList("jobpilot_saved_jobs"));
   };

   useEffect(() => {
      syncFromStorage();

      const intervalId = window.setInterval(syncFromStorage, 1200);
      window.addEventListener("storage", syncFromStorage);

      return () => {
         window.clearInterval(intervalId);
         window.removeEventListener("storage", syncFromStorage);
      };
   }, []);

   const removeApplication = (id?: string) => {
      if (!id) {
         return;
      }

      const updated = applications.filter((item) => item.id !== id);
      setApplications(updated);
      localStorage.setItem("jobpilot_applications", JSON.stringify(updated));
   };

   const removeSavedJob = (id?: string) => {
      if (!id) {
         return;
      }

      const updated = savedJobs.filter((item) => item.id !== id);
      setSavedJobs(updated);
      localStorage.setItem("jobpilot_saved_jobs", JSON.stringify(updated));
   };

   if (shouldHideBecausePageHasOwnTray) {
      return null;
   }

   return (
      <>
         <button
            onClick={() => setShowTray(true)}
            style={{
               position: "fixed",
               right: "24px",
               bottom: "24px",
               width: "60px",
               height: "60px",
               borderRadius: "999px",
               border: "none",
               background: "linear-gradient(135deg, #ec4899, #db2777)",
               color: "#fff",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               cursor: "pointer",
               boxShadow: "0 14px 30px rgba(236,72,153,0.35)",
               zIndex: 900,
            }}
            title="Ứng tuyển và công việc đã lưu"
         >
            <Heart style={{ width: 24, height: 24, color: "#fff" }} />
         </button>

         {showTray && (
            <>
               <div
                  onClick={() => setShowTray(false)}
                  style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", zIndex: 1100 }}
               />
               <div
                  style={{
                     position: "fixed",
                     right: "24px",
                     bottom: "94px",
                     width: "min(420px, calc(100vw - 32px))",
                     maxHeight: "72vh",
                     overflowY: "auto",
                     background: "#fff",
                     borderRadius: "18px",
                     boxShadow: "0 24px 70px rgba(15,23,42,0.3)",
                     zIndex: 1101,
                     padding: "18px",
                  }}
               >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Mục đã lưu</h3>
                     <button
                        onClick={() => setShowTray(false)}
                        style={{
                           width: 32,
                           height: 32,
                           borderRadius: 8,
                           border: "1px solid #e2e8f0",
                           background: "#fff",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           cursor: "pointer",
                           color: "#64748b",
                        }}
                     >
                        <X style={{ width: 16, height: 16 }} />
                     </button>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                           Đã ứng tuyển ({applications.length})
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                           {applications.length === 0 ? (
                              <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có ứng tuyển nào.</div>
                           ) : (
                              applications.map((item) => {
                                 const status = getApplicationStatusMeta(item.status);
                                 return (
                                    <article key={item.id} style={{ position: "relative", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#f8fafc" }}>
                                       <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", paddingRight: 36 }}>{toVietnameseJobTitle(item.title || "Vị trí chưa xác định")}</div>
                                       <div style={{ marginTop: 4, fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                                          <Building2 style={{ width: 12, height: 12 }} />
                                          {item.company || "Chưa có công ty"}
                                       </div>
                                       <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                          {item.place && (
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 999, background: "#fff", padding: "3px 8px" }}>
                                                <MapPin style={{ width: 11, height: 11 }} />
                                                {item.place}
                                             </span>
                                          )}
                                          {item.salary && (
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 999, background: "#fff", padding: "3px 8px" }}>
                                                <Wallet style={{ width: 11, height: 11 }} />
                                                {item.salary}
                                             </span>
                                          )}
                                          {item.type && (
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 999, background: "#fff", padding: "3px 8px" }}>
                                                <Clock3 style={{ width: 11, height: 11 }} />
                                                {item.type}
                                             </span>
                                          )}
                                       </div>
                                       <div style={{ marginTop: 7, fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                                          <CalendarClock style={{ width: 12, height: 12 }} />
                                          {item.appliedAt || "Chưa xác định thời gian"}
                                       </div>
                                       <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{status.label}</div>
                                       <button
                                          onClick={() => removeApplication(item.id)}
                                          style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 8, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                          title="Xóa hồ sơ ứng tuyển"
                                       >
                                          <Trash2 style={{ width: 13, height: 13 }} />
                                       </button>
                                    </article>
                                 );
                              })
                           )}
                        </div>
                     </div>

                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                           Công việc đã lưu ({savedJobs.length})
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                           {savedJobs.length === 0 ? (
                              <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có công việc nào được lưu.</div>
                           ) : (
                              savedJobs.map((item) => (
                                 <article key={item.id} style={{ position: "relative", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#f8fafc" }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", paddingRight: 36 }}>{toVietnameseJobTitle(item.title || "Công việc đã lưu")}</div>
                                    <div style={{ marginTop: 4, fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                                       <Building2 style={{ width: 12, height: 12 }} />
                                       {item.company || "Chưa có công ty"}
                                    </div>
                                    <div style={{ marginTop: 7, fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                                       <CalendarClock style={{ width: 12, height: 12 }} />
                                       {item.savedAt || "Chưa xác định thời gian"}
                                    </div>
                                    <button
                                       onClick={() => removeSavedJob(item.id)}
                                       style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 8, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                       title="Xóa mục đã lưu"
                                    >
                                       <Trash2 style={{ width: 13, height: 13 }} />
                                    </button>
                                 </article>
                              ))
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )}
      </>
   );
}
