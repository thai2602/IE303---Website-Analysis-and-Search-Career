import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
   ArrowLeft, MapPin, Wallet, Clock3, Bookmark,
   Building2, ExternalLink, Flame, CalendarClock,
   Briefcase, Star, ChevronRight,
} from "lucide-react";
import { toVietnameseJobTitle } from "../../utils/jobTitle";
import { generateSlug } from "../../utils/slug";
import { readAuthUser } from "../../utils/auth";
import { hasCreatedCv } from "../../utils/cv";
import ApplyCvModal from "../../components/ApplyCvModal";
import { companyJobs } from "./JobsPage";
import image1 from "../../assets/company_logo/image_1.png";
import image2 from "../../assets/company_logo/image_2.png";
import image3 from "../../assets/company_logo/image_3.png";

type JobDetail = {
   id?: number;
   title: string;
   company: string;
   companyColor: string;
   companyDescription: string;
   description: string;
   requirements?: string;
   benefits?: string;
   place: string;
   field: string;
   type: string;
   salary: string;
   tags: string[];
   hot: boolean;
   posted: string;
   image: string;
   companyUrl: string;
   slug?: string;
   jobLevel?: string;
   experienceYears?: string;
   expiredAt?: string;
   locationAddress?: string;
};

const levelMap: Record<string, string> = {
   FRESHER: "Fresher / Entry",
   JUNIOR: "Junior",
   SENIOR: "Senior",
   LEADER: "Leader / Quản lý",
   DIRECTOR: "Giám đốc",
};

const typeColors: Record<string, { bg: string; text: string }> = {
   "Full-time": { bg: "#ecfdf5", text: "#059669" },
   "Hybrid": { bg: "#eef2ff", text: "#4f46e5" },
   "Remote": { bg: "#fffbeb", text: "#b45309" },
};

const fallbackImages = [image1, image2, image3];

export default function JobDetailPage() {
   const location = useLocation();
   const navigate = useNavigate();
   const { jobSlug } = useParams<{ jobSlug: string }>();

   const [job, setJob] = useState<JobDetail | null>(location.state?.job ?? null);
   const [relatedJobs, setRelatedJobs] = useState<JobDetail[]>(location.state?.relatedJobs ?? []);
   const [activeTab, setActiveTab] = useState<"description" | "requirements" | "benefits">("description");
   const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);
   const [isSaved, setIsSaved] = useState(false);
   const [isApplied, setIsApplied] = useState(false);
   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

   useEffect(() => {
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
      if (!job && jobSlug) {
         fetch(`${apiBase}/api/jobs/slug/${jobSlug}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
               if (!data) {
                  // Fallback to static
                  const fallback = companyJobs.find((j) => {
                     const slug = j.slug ?? generateSlug(`${j.title} ${j.company}`);
                     return slug === jobSlug;
                  });
                  if (fallback) {
                     setJob({
                        ...fallback,
                        field: fallback.field ?? "Nhóm ngành khác",
                        tags: fallback.tags ?? [],
                     } as JobDetail);
                  }
                  return;
               }
               setJob({
                  id: data.id,
                  title: data.title,
                  company: data.company?.name ?? "",
                  companyColor: data.company?.color ?? "#0ea5e9",
                  companyDescription: data.company?.description ?? "",
                  description: data.description ?? "",
                  requirements: data.requirements,
                  benefits: data.benefits,
                  place: data.locationCity ?? "",
                  locationAddress: data.locationAddress,
                  field: "Nhóm ngành khác",
                  type: data.jobType === "FULL_TIME" ? "Full-time" : data.jobType === "REMOTE" ? "Remote" : "Hybrid",
                  salary: `${Math.round((data.salaryMin ?? 0) / 1_000_000)}–${Math.round((data.salaryMax ?? 0) / 1_000_000)} triệu`,
                  tags: [
                     data.jobLevel ? (levelMap[data.jobLevel] ?? data.jobLevel) : null,
                     data.experienceYears ? `${data.experienceYears} năm KN` : null,
                  ].filter((t): t is string => Boolean(t)),
                  hot: false,
                  posted: "Vừa cập nhật",
                  image: data.company?.logoUrl ?? image1,
                  companyUrl: `/cong-ty/${data.company?.slug ?? ""}`,
                  slug: data.slug,
                  jobLevel: data.jobLevel,
                  experienceYears: data.experienceYears,
                  expiredAt: data.expiredAt,
               });
            })
            .catch(() => {
               // Fallback to static
               const fallback = companyJobs.find((j) => {
                  const slug = j.slug ?? generateSlug(`${j.title} ${j.company}`);
                  return slug === jobSlug;
               });
               if (fallback) {
                  setJob({
                     ...fallback,
                     field: fallback.field ?? "Nhóm ngành khác",
                     tags: fallback.tags ?? [],
                  } as JobDetail);
               }
            });
      }
   }, [job, jobSlug]);

   useEffect(() => {
      if (relatedJobs.length > 0 || !job) return;
      const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
      fetch(`${apiBase}/api/jobs`)
         .then((res) => (res.ok ? res.json() : []))
         .then((data: any[]) => {
            const related = data
               .filter((j) => j.slug !== jobSlug)
               .slice(0, 3)
               .map((j, i) => ({
                  title: j.title,
                  company: j.company?.name ?? "",
                  companyColor: j.company?.color ?? "#0ea5e9",
                  companyDescription: j.company?.description ?? "",
                  description: j.description ?? "",
                  place: j.locationCity ?? "",
                  field: "Nhóm ngành khác",
                  type: j.jobType === "FULL_TIME" ? "Full-time" : j.jobType === "REMOTE" ? "Remote" : "Hybrid",
                  salary: `${Math.round((j.salaryMin ?? 0) / 1_000_000)}–${Math.round((j.salaryMax ?? 0) / 1_000_000)} triệu`,
                  tags: [],
                  hot: false,
                  posted: "Vừa cập nhật",
                  image: fallbackImages[i % fallbackImages.length],
                  companyUrl: "/cong-ty",
                  slug: j.slug,
               }));
            setRelatedJobs(related);
         })
         .catch(() => {});
   }, [job, jobSlug, relatedJobs.length]);

   useEffect(() => {
      if (!job) return;
      const savedRaw = localStorage.getItem("jobpilot_saved_jobs");
      const appliedRaw = localStorage.getItem("jobpilot_applications");
      const saved: any[] = savedRaw ? (JSON.parse(savedRaw) ?? []).filter(Boolean) : [];
      const applied: any[] = appliedRaw ? (JSON.parse(appliedRaw) ?? []).filter(Boolean) : [];
      setIsSaved(saved.some((s) => s && s.title === job.title && s.company === job.company));
      setIsApplied(applied.some((a) => a && a.title === job.title && a.company === job.company));
   }, [job]);

   const showToast = (message: string, kind: "success" | "error" = "success") => {
      setToast({ message, kind });
      setTimeout(() => setToast(null), 2600);
   };

   const handleApply = () => {
      if (!readAuthUser()) { showToast("Bạn cần đăng nhập trước khi ứng tuyển.", "error"); return; }
      if (!hasCreatedCv()) { showToast("Bạn chưa có CV. Vui lòng tạo CV trước.", "error"); return; }
      if (isApplied) { showToast("Bạn đã ứng tuyển vị trí này rồi.", "error"); return; }
      setIsApplyModalOpen(true);
   };

   const handleConfirmApply = async (cvId: number) => {
      setIsApplyModalOpen(false);
      let finalId = `${job!.company}-${job!.title}-${Date.now()}`;
      if (job!.id) {
         try {
            const token = localStorage.getItem("accessToken");
            const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
            const res = await fetch(`${apiBase}/api/applications`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "Authorization": token ? `Bearer ${token}` : "",
               },
               body: JSON.stringify({ jobId: job!.id, cvId }),
            });
            if (res.ok) {
               const savedApp = await res.json();
               if (savedApp && savedApp.id) {
                  finalId = `api-${savedApp.id}`;
               }
            } else {
               const errText = await res.text();
               showToast(`Lỗi ứng tuyển: ${errText}`, "error");
               return;
            }
         } catch (err) {
            console.error("Backend apply failed:", err);
            showToast("Lỗi kết nối máy chủ khi ứng tuyển. Vui lòng thử lại sau.", "error");
            return;
         }
      }

      const savedRaw = localStorage.getItem("jobpilot_applications");
      const applications: any[] = savedRaw ? (JSON.parse(savedRaw) ?? []).filter(Boolean) : [];
      localStorage.setItem("jobpilot_applications", JSON.stringify([
         { ...job, id: finalId, appliedAt: new Date().toLocaleString("vi-VN"), status: "Đang chờ xác nhận", trackingNote: "Hồ sơ đã được ghi nhận và đang đợi nhà tuyển dụng phản hồi." },
         ...applications,
      ]));
      setIsApplied(true);
      showToast(`Đã ứng tuyển thành công: ${job!.title} tại ${job!.company}.`);
   };

   const handleSave = () => {
      const savedRaw = localStorage.getItem("jobpilot_saved_jobs");
      const saved: any[] = savedRaw ? (JSON.parse(savedRaw) ?? []).filter(Boolean) : [];
      if (isSaved) {
         localStorage.setItem("jobpilot_saved_jobs", JSON.stringify(saved.filter((s) => s && !(s.title === job!.title && s.company === job!.company))));
         setIsSaved(false);
         showToast("Đã bỏ lưu công việc.");
         return;
      }
      const id = `${job!.company}-${job!.title}-${Date.now()}`;
      localStorage.setItem("jobpilot_saved_jobs", JSON.stringify([{ ...job, id, savedAt: new Date().toLocaleString("vi-VN") }, ...saved]));
      setIsSaved(true);
      showToast(`Đã lưu công việc: ${job!.title} tại ${job!.company}.`);
   };

   const navigateToRelated = (related: JobDetail) => {
      const slug = related.slug ?? generateSlug(`${related.title} ${related.company}`);
      navigate(`/tim-viec/${slug}`, { state: { job: related } });
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   if (!job) {
      return (
         <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "16px" }}>
            <Building2 style={{ width: 48, height: 48, color: "#cbd5e1" }} />
            <div style={{ fontSize: "18px", color: "#64748b", fontWeight: 600 }}>Đang tải thông tin công việc...</div>
            <button onClick={() => navigate(-1)} style={{ fontSize: "14px", color: "#0284c7", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>← Quay lại</button>
         </div>
      );
   }

   const tc = typeColors[job.type] ?? { bg: "#f1f5f9", text: "#475569" };
   const tabLabels = { description: "Mô tả công việc", requirements: "Yêu cầu", benefits: "Quyền lợi" };

   return (
      <div>
         {/* Back */}
         <button
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "14px", fontWeight: 600, marginBottom: "20px", padding: "8px 0" }}
         >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Quay lại danh sách việc làm
         </button>

         {/* Company banner */}
         <div className="res-job-detail-banner" style={{
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${job.companyColor}18 0%, ${job.companyColor}08 100%)`,
            border: `1px solid ${job.companyColor}28`,
            padding: "28px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 16px 48px ${job.companyColor}12`,
         }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: job.companyColor, borderRadius: "20px 20px 0 0" }} />

            <div className="res-job-detail-inner" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "flex-start" }}>
               <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", minWidth: 0 }}>
                  <div style={{ width: "84px", height: "84px", borderRadius: "18px", overflow: "hidden", background: "#fff", boxShadow: `0 8px 24px ${job.companyColor}20`, flexShrink: 0, border: `2px solid ${job.companyColor}30` }}>
                     <img src={job.image} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "13px", color: job.companyColor, fontWeight: 700, background: `${job.companyColor}15`, borderRadius: "999px", padding: "4px 14px" }}>
                           {job.company}
                        </span>
                        {job.hot && (
                           <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fef3c7", color: "#b45309", borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 800 }}>
                              <Flame style={{ width: 11, height: 11 }} /> HOT
                           </span>
                        )}
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{job.posted}</span>
                     </div>
                     <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1.25, margin: "0 0 16px" }}>
                        {toVietnameseJobTitle(job.title)}
                     </h1>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>
                           <Wallet style={{ width: 15, height: 15, color: job.companyColor }} />
                           {job.salary}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#475569" }}>
                           <MapPin style={{ width: 15, height: 15, color: "#64748b" }} />
                           {job.place}{job.locationAddress ? ` • ${job.locationAddress}` : ""}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: tc.bg, color: tc.text, borderRadius: "999px", padding: "4px 12px", fontSize: "13px", fontWeight: 700 }}>
                           <Clock3 style={{ width: 13, height: 13 }} />
                           {job.type}
                        </span>
                        {job.jobLevel && (
                           <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f8fafc", color: "#475569", borderRadius: "999px", padding: "4px 12px", fontSize: "13px", fontWeight: 700, border: "1px solid #e2e8f0" }}>
                              <Briefcase style={{ width: 13, height: 13 }} />
                              {levelMap[job.jobLevel] ?? job.jobLevel}
                           </span>
                        )}
                        {job.expiredAt && (
                           <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#94a3b8" }}>
                              <CalendarClock style={{ width: 13, height: 13 }} />
                              Hạn: {new Date(job.expiredAt).toLocaleDateString("vi-VN")}
                           </span>
                        )}
                     </div>
                  </div>
               </div>

               {/* Action buttons */}
               <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
                  <button
                     onClick={handleApply}
                     style={{
                        background: isApplied ? "#94a3b8" : job.companyColor,
                        color: "#fff", border: "none", borderRadius: "12px",
                        padding: "12px 28px", fontSize: "15px", fontWeight: 800,
                        cursor: isApplied ? "default" : "pointer",
                        boxShadow: isApplied ? "none" : `0 6px 20px ${job.companyColor}40`,
                        whiteSpace: "nowrap",
                     }}
                  >
                     {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                  </button>
                  <button
                     onClick={handleSave}
                     style={{
                        background: isSaved ? "#ecfdf5" : "#fff",
                        color: isSaved ? "#059669" : "#64748b",
                        border: `1px solid ${isSaved ? "#6ee7b7" : "#e2e8f0"}`,
                        borderRadius: "12px", padding: "10px 20px",
                        fontSize: "14px", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px", justifyContent: "center",
                     }}
                  >
                     <Bookmark style={{ width: 15, height: 15 }} />
                     {isSaved ? "Đã lưu" : "Lưu tin"}
                  </button>
               </div>
            </div>
         </div>

         {/* Main 2-column layout */}
         <div className="res-job-detail-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "flex-start" }}>

            {/* LEFT: Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

               {/* Tabs */}
               <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0" }}>
                     {(["description", "requirements", "benefits"] as const).map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           style={{
                              flex: 1, padding: "14px 8px", border: "none",
                              background: "none", cursor: "pointer",
                              fontSize: "14px", fontWeight: 700,
                              color: activeTab === tab ? job.companyColor : "#64748b",
                              borderBottom: activeTab === tab ? `2px solid ${job.companyColor}` : "2px solid transparent",
                              marginBottom: "-2px",
                           }}
                        >
                           {tabLabels[tab]}
                        </button>
                     ))}
                  </div>
                  <div style={{ padding: "24px", fontSize: "15px", color: "#334155", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                     {activeTab === "description" && (job.description || "Chưa có mô tả chi tiết.")}
                     {activeTab === "requirements" && (job.requirements || job.description || "Chưa có yêu cầu cụ thể.")}
                     {activeTab === "benefits" && (job.benefits || "Chưa có thông tin quyền lợi.")}
                  </div>
               </div>

               {/* Tags */}
               {job.tags.length > 0 && (
                  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                     <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "14px", marginTop: 0 }}>Kỹ năng / Công nghệ</h3>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {job.tags.map((tag) => (
                           <span key={tag} style={{ background: `${job.companyColor}12`, color: job.companyColor, border: `1px solid ${job.companyColor}28`, borderRadius: "8px", padding: "5px 14px", fontSize: "13px", fontWeight: 600 }}>
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               )}

               {/* Company info */}
               <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", marginTop: 0 }}>Về công ty</h3>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                     <img src={job.image} alt={job.company} style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", flexShrink: 0 }} />
                     <div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{job.company}</div>
                        <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.75, margin: 0 }}>{job.companyDescription || "Chưa có mô tả công ty."}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

               {/* Job info card */}
               <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", marginTop: 0 }}>Thông tin công việc</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                     {[
                        { icon: <Wallet style={{ width: 16, height: 16, color: job.companyColor }} />, bg: `${job.companyColor}15`, label: "Mức lương", value: job.salary },
                        { icon: <MapPin style={{ width: 16, height: 16, color: "#0369a1" }} />, bg: "#f0f9ff", label: "Địa điểm", value: job.place },
                        { icon: <Clock3 style={{ width: 16, height: 16, color: tc.text }} />, bg: tc.bg, label: "Hình thức", value: job.type },
                        ...(job.jobLevel ? [{ icon: <Briefcase style={{ width: 16, height: 16, color: "#475569" }} />, bg: "#f8fafc", label: "Cấp bậc", value: levelMap[job.jobLevel] ?? job.jobLevel }] : []),
                        ...(job.experienceYears ? [{ icon: <Star style={{ width: 16, height: 16, color: "#ca8a04" }} />, bg: "#fefce8", label: "Kinh nghiệm", value: `${job.experienceYears} năm` }] : []),
                        { icon: <Building2 style={{ width: 16, height: 16, color: "#64748b" }} />, bg: "#f8fafc", label: "Ngành nghề", value: job.field },
                     ].map(({ icon, bg, label, value }) => (
                        <div key={label} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                           <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {icon}
                           </div>
                           <div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>{label}</div>
                              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{value}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Company card */}
               <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                  <div style={{ height: "6px", background: job.companyColor }} />
                  <div style={{ padding: "16px" }}>
                     <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px" }}>
                        <img src={job.image} alt={job.company} style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }} />
                        <div>
                           <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>{job.company}</div>
                           <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{job.field}</div>
                        </div>
                     </div>
                     <a
                        href={job.companyUrl}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: `${job.companyColor}15`, color: job.companyColor, borderRadius: "10px", padding: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
                     >
                        <ExternalLink style={{ width: 14, height: 14 }} />
                        Xem trang công ty
                     </a>
                  </div>
               </div>

               {/* Related jobs */}
               {relatedJobs.length > 0 && (
                  <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "16px", boxShadow: "0 4px 18px rgba(0,0,0,0.04)" }}>
                     <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "14px", marginTop: 0 }}>Việc làm liên quan</h3>
                     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {relatedJobs.map((related, i) => (
                           <button
                              key={`${related.title}-${related.company}-${i}`}
                              onClick={() => navigateToRelated(related)}
                              style={{ display: "flex", gap: "12px", alignItems: "center", background: "none", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px", cursor: "pointer", textAlign: "left", width: "100%" }}
                           >
                              <img src={related.image || fallbackImages[i % fallbackImages.length]} alt={related.company} style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                              <div style={{ minWidth: 0, flex: 1 }}>
                                 <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {toVietnameseJobTitle(related.title)}
                                 </div>
                                 <div style={{ fontSize: "12px", color: "#64748b" }}>{related.company}</div>
                                 <div style={{ fontSize: "12px", color: related.companyColor, fontWeight: 700, marginTop: "3px" }}>{related.salary}</div>
                              </div>
                              <ChevronRight style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} />
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Toast */}
         {toast && (
            <div style={{ position: "fixed", left: "50%", top: 24, transform: "translateX(-50%)", zIndex: 1300, minWidth: "min(480px, calc(100vw - 24px))" }}>
               <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "14px 16px", borderRadius: 14,
                  border: `1px solid ${toast.kind === "success" ? "#86efac" : "#fca5a5"}`,
                  background: toast.kind === "success" ? "linear-gradient(135deg, #f0fdf4, #ffffff)" : "linear-gradient(135deg, #fff1f2, #ffffff)",
                  boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
               }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                     <div style={{ width: 10, height: 10, borderRadius: 999, background: toast.kind === "success" ? "#16a34a" : "#dc2626", flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontWeight: 700 }}>×</button>
               </div>
            </div>
         )}

         {/* Apply CV Modal */}
         <ApplyCvModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            onConfirm={handleConfirmApply}
         />
      </div>
   );
}
