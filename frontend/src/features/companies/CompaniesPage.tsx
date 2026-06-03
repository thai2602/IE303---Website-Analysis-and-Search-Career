
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star, Users, MapPin, X, Bookmark, Heart, Wallet, Building2, CalendarClock, Clock3, Trash2 } from "lucide-react";
import { readAuthUser } from "../../utils/auth";
import { getApplicationStatusMeta } from "../../utils/application";
import { hasCreatedCv } from "../../utils/cv";
import { toVietnameseJobTitle } from "../../utils/jobTitle";
import styles from "./CompaniesPage.module.css";
import { companyAvatars, companyImages, companyBannerItems } from "./companyAssets";
import { mockCompanies as companies, CompanyItem, CompanyPosition } from "./mockCompanies";

const fieldColors: Record<string, { bg: string; text: string }> = {
   "Technology": { bg: "#eef2ff", text: "#4f46e5" },
   "Ecommerce": { bg: "#ecfdf5", text: "#059669" },
   "Healthcare": { bg: "#f0f9ff", text: "#0284c7" },
   "Finance": { bg: "#fffbeb", text: "#b45309" },
   "Design": { bg: "#fce7f3", text: "#be185d" },
   "Education": { bg: "#ecfeff", text: "#0891b2" },
   "Gaming": { bg: "#fef2f2", text: "#dc2626" },
   "Logistics": { bg: "#ecfdf5", text: "#059669" },
   "Manufacturing": { bg: "#f3e8ff", text: "#7c3aed" },
   "Consulting": { bg: "#ecfeff", text: "#0891b2" },
   "Real Estate": { bg: "#fff7ed", text: "#c2410c" },
   "Automotive": { bg: "#fef2f2", text: "#dc2626" },
   "Food & Beverage": { bg: "#f0fdf4", text: "#16a34a" },
   "Travel": { bg: "#f0fdfa", text: "#0d9488" },
   "Energy": { bg: "#fefce8", text: "#a16207" },
   "Fashion": { bg: "#fdf2f8", text: "#db2777" },
   "Agriculture": { bg: "#f7fee7", text: "#65a30d" },
};

export default function CompaniesPage() {

   const location = useLocation();
   const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
   const [selectedPosition, setSelectedPosition] = useState<any>(null);
   const [bannerIndex, setBannerIndex] = useState(0);
    const [applications, setApplications] = useState<any[]>(() => {
       const saved = localStorage.getItem("jobpilot_applications");
       try {
          return saved ? JSON.parse(saved) || [] : [];
       } catch {
          return [];
       }
    });
    const [savedJobs, setSavedJobs] = useState<any[]>(() => {
       const saved = localStorage.getItem("jobpilot_saved_jobs");
       try {
          return saved ? JSON.parse(saved) || [] : [];
       } catch {
          return [];
       }
    });

    // --- API companies state & Pagination ---
    const [apiCompanies, setApiCompanies] = useState<CompanyItem[]>([]);
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    const mapApiCompanies = (apiData: any[]): CompanyItem[] => {
       return apiData.map((apiItem, idx) => {
          const normalizeName = (name: string) =>
             name
                .trim()
                .normalize("NFD")
                .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
          const staticMatch = companies.find(
             (c) => normalizeName(c.name) === normalizeName(apiItem.name)
          );
          if (staticMatch) return { ...staticMatch };

          const benefitsArr = apiItem.benefits?.split(",").map((b: string) => b.trim()).filter(Boolean) ?? [];

          const mappedPositions = apiItem.positions?.map((pos: any) => ({
             id: pos.id,
             title: pos.title,
             salary: pos.salaryMin && pos.salaryMax ? `${pos.salaryMin} - ${pos.salaryMax} triệu` : "Thỏa thuận",
             workingHours: pos.jobType || "Toàn thời gian",
             description: pos.description || "Mô tả công việc đang được cập nhật.",
             skills: [pos.jobLevel || "Nhân viên", "Kinh nghiệm " + (pos.experienceYears || "1 năm")]
          })) || [];

          return {
             name: apiItem.name,
             slug: apiItem.slug,
             field: "Technology",
             rating: "4.5",
             employees: apiItem.size ?? "Đang cập nhật",
             location: "Việt Nam",
             openJobs: mappedPositions.length,
             color: apiItem.color || "#6366f1",
             bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
             initial: apiItem.name.charAt(0).toUpperCase(),
             description: apiItem.description ?? "Thông tin đang được cập nhật.",
             benefits: benefitsArr.length ? benefitsArr : ["Phúc lợi cạnh tranh"],
             positions: mappedPositions,
             image: companyAvatars[idx % companyAvatars.length],
          } as CompanyItem;
       });
    };

    // Fetch công ty từ API (lần đầu 6)
    useEffect(() => {
       const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
       setLoadingMore(true);
       fetch(`${apiBase}/api/companies?offset=0&limit=6`)
          .then((res) => {
             if (!res.ok) throw new Error("API error");
             return res.json() as Promise<Array<any>>;
          })
          .then((apiData) => {
             if (!apiData || apiData.length === 0) {
                setApiCompanies(companies.slice(0, 6));
                setHasMore(companies.length > 6);
                setOffset(6);
                setIsUsingFallback(true);
                return;
             }
             const mapped = mapApiCompanies(apiData);
             setApiCompanies(mapped);
             setHasMore(apiData.length === 6);
             setOffset(6);
             setIsUsingFallback(false);
          })
          .catch((err) => {
             console.error("Lỗi tải API công ty, chuyển sang dữ liệu dự phòng:", err);
             setApiCompanies(companies.slice(0, 6));
             setHasMore(companies.length > 6);
             setOffset(6);
             setIsUsingFallback(true);
          })
          .finally(() => {
             setLoadingMore(false);
          });
    }, []);

    // Load thêm 6 công ty khi cuộn
    const loadMoreCompanies = () => {
       if (loadingMore || !hasMore) return;
       setLoadingMore(true);

       if (isUsingFallback) {
          setTimeout(() => {
             const nextBatch = companies.slice(offset, offset + 6);
             if (nextBatch.length > 0) {
                setApiCompanies((prev) => [...prev, ...nextBatch]);
                setOffset((prev) => prev + 6);
                setHasMore(companies.length > offset + 6);
             } else {
                setHasMore(false);
             }
             setLoadingMore(false);
          }, 400);
          return;
       }

       const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
       fetch(`${apiBase}/api/companies?offset=${offset}&limit=6`)
          .then((res) => {
             if (!res.ok) throw new Error("API error");
             return res.json() as Promise<Array<any>>;
          })
          .then((apiData) => {
             if (!apiData || apiData.length === 0) {
                setHasMore(false);
                return;
             }
             const mapped = mapApiCompanies(apiData);
             setApiCompanies((prev) => [...prev, ...mapped]);
             setOffset((prev) => prev + 6);
             setHasMore(apiData.length === 6);
          })
          .catch((err) => {
             console.error("Lỗi tải thêm công ty từ API, chuyển sang dữ liệu dự phòng:", err);
             const nextBatch = companies.slice(offset, offset + 6);
             if (nextBatch.length > 0) {
                setApiCompanies((prev) => [...prev, ...nextBatch]);
                setOffset((prev) => prev + 6);
                setHasMore(companies.length > offset + 6);
             } else {
                setHasMore(false);
             }
          })
          .finally(() => {
             setLoadingMore(false);
          });
    };

   const [showTray, setShowTray] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState<string>("Tất cả");
   const [toast, setToast] = useState<{ kind: "success" | "error"; message: string } | null>(null);


   const normalizeName = (name: string) =>
      name
         .trim()
         .normalize("NFD")
         .replace(/[đĐ]/g, (c) => (c === "đ" ? "d" : "D"))
         .replace(/[\u0300-\u036f]/g, "")
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-")
         .replace(/^-+|-+$/g, "");
   const getDefaultContact = (companyName: string) => ({
      email: `contact@${normalizeName(companyName)}.com`,
      phone: "(+84) 28 1234 5678",
      website: `www.${normalizeName(companyName)}.com`,
   });
   const getDefaultTerms = () => [
      "Chính sách bảo mật thông tin",
      "Môi trường làm việc chuyên nghiệp",
      "Chế độ đãi ngộ cạnh tranh",
   ];
   const findStaticCompany = (name: string) => companies.find((c) => normalizeName(c.name) === normalizeName(name));
   const getCompanyIntroduction = (company: CompanyItem) => {
      const introText = company.introduction?.trim() || company.description;
      const benefitText = company.benefits?.length ? `Phúc lợi nổi bật gồm: ${company.benefits.join(", ")}.` : "";
      const positionText = company.positions?.length ? `Hiện tại ${company.name} đang mở ${company.positions.length} vị trí trong lĩnh vực ${company.field}, phù hợp với ứng viên muốn phát triển sự nghiệp chuyên sâu.` : "";
      return [
         introText,
         `${company.name} có trụ sở tại ${company.location} và đội ngũ ${company.employees}.`,
         benefitText,
         positionText,
      ].filter(Boolean);
   };
   const getMergedCompany = (item: CompanyItem) => {
      const staticCompany = findStaticCompany(item.name);
      const contact = item.contact || staticCompany?.contact || getDefaultContact(item.name);
      const terms = item.terms?.length ? item.terms : staticCompany?.terms?.length ? staticCompany.terms : getDefaultTerms();
      if (!staticCompany) {
         return {
            ...item,
            contact,
            terms,
         };
      }

      return {
         ...staticCompany,
         slug: item.slug,                  // Giữ slug gốc từ API (ưu tiên hơn slug static)
         description: item.description || staticCompany.description,
         benefits: item.benefits?.length ? item.benefits : staticCompany.benefits,
         employees: item.employees || staticCompany.employees,
         location: item.location || staticCompany.location,
         rating: item.rating || staticCompany.rating,
         field: item.field || staticCompany.field,
         color: item.color || staticCompany.color,
         bg: item.bg || staticCompany.bg,
         positions: staticCompany.positions || item.positions || [],
         contact,
         terms,
      };
   };

   // Danh sách hiển thị: dùng apiCompanies khi đã load xong, nhưng vẫn giữ positions từ static data
   const displayedCompanies = apiCompanies.map(getMergedCompany);

   useEffect(() => {
      const interval = setInterval(() => {
         setBannerIndex((current) => (current + 1) % companyBannerItems.length);
      }, 3000);
      return () => clearInterval(interval);
   }, []);



   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const companyName = params.get("company")?.trim();
      if (!companyName) {
         return;
      }

      const jobTitle = params.get("jobTitle")?.trim();
      const field = params.get("field")?.trim() || "Technology";
      const place = params.get("place")?.trim() || "Chưa cập nhật";
      const salary = params.get("salary")?.trim() || "Thỏa thuận";
      const companyDescription = params.get("companyDescription")?.trim() || "Thông tin doanh nghiệp đang được cập nhật.";
      const jobDescription = params.get("jobDescription")?.trim() || "Mô tả công việc đang được cập nhật.";
      const companyColor = params.get("companyColor")?.trim() || "#0ea5e9";

      const matchedCompany = companies.find((item) => item.name.toLowerCase() === companyName.toLowerCase());
      if (matchedCompany) {
         setSelectedFilter(matchedCompany.field);
         setSelectedCompany(matchedCompany);
         return;
      }

      const fallbackCompany: CompanyItem = {
         name: companyName,
         field,
         rating: "4.5",
         employees: "Đang cập nhật",
         location: place,
         openJobs: 1,
         color: companyColor,
         bg: `linear-gradient(135deg, ${companyColor}22, ${companyColor}10)`,
         initial: companyName.slice(0, 1).toUpperCase(),
         description: companyDescription,
         benefits: ["Môi trường chuyên nghiệp", "Lộ trình phát triển", "Phúc lợi cạnh tranh"],
         contact: getDefaultContact(companyName),
         terms: ["Chính sách bảo mật thông tin", "Môi trường làm việc chuyên nghiệp", "Chế độ đãi ngộ cạnh tranh"],
         image: companyAvatars[0],
         positions: [
            {
               title: jobTitle || "Vị trí đang tuyển",
               salary,
               workingHours: "Toàn thời gian",
               description: jobDescription,
               skills: [field, "Trao đổi khi phỏng vấn", "Kinh nghiệm liên quan"],
            },
         ],
      };

      setSelectedFilter(field);
      setSelectedCompany(fallbackCompany);
   }, [location.search]);

   useEffect(() => {
      localStorage.setItem("jobpilot_applications", JSON.stringify(applications));
      window.dispatchEvent(new Event("jobpilot-data-updated"));
   }, [applications]);

   useEffect(() => {
      localStorage.setItem("jobpilot_saved_jobs", JSON.stringify(savedJobs));
      window.dispatchEvent(new Event("jobpilot-data-updated"));
   }, [savedJobs]);

   useEffect(() => {
      if (!toast) {
         return;
      }

      const timeoutId = window.setTimeout(() => setToast(null), 2600);
      return () => window.clearTimeout(timeoutId);
   }, [toast]);

   const showToast = (message: string, kind: "success" | "error" = "success") => {
      setToast({ message, kind });
   };

   const uniqueFields = Array.from(new Set(displayedCompanies.map(c => c.field)));
   const filters = ["Tất cả", ...uniqueFields];
   const filteredCompanies = selectedFilter === "Tất cả" ? displayedCompanies : displayedCompanies.filter(c => c.field === selectedFilter);

   const addApplication = async (job: any) => {
      if (!readAuthUser()) {
         showToast("Bạn cần đăng nhập trước khi ứng tuyển.", "error");
         return;
      }

      if (!hasCreatedCv()) {
         showToast("Bạn chưa có CV. Vui lòng tạo CV trước khi ứng tuyển.", "error");
         return;
      }

      if (applications.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Bạn đã ứng tuyển vị trí này rồi.", "error");
         return;
      }

      if (job.id) {
         try {
            const token = localStorage.getItem("accessToken");
            const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
            const res = await fetch(`${apiBase}/api/applications`, {
               method: "POST",
               headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
               body: JSON.stringify({ jobId: job.id, cvId: 1 }) // Hardcode cvId for now as the user has a CV check
            });
            if (!res.ok) {
               console.warn("Could not save application to server");
            }
         } catch (e) {
            console.error(e);
         }
      }

      const id = job.id ? `api-${job.id}` : `${job.company}-${job.title}-${Date.now()}`;
      setApplications([
         {
            ...job,
            id,
            appliedAt: new Date().toLocaleString("vi-VN"),
            status: "Đang chờ xác nhận",
            trackingNote: "Hồ sơ đã được ghi nhận và đang đợi nhà tuyển dụng phản hồi.",
         },
         ...applications,
      ]);
      showToast(`Đã ứng tuyển thành công: ${job.title} tại ${job.company}.`);
   };

   const addSavedJob = async (job: any) => {
      if (savedJobs.some((item) => item.company === job.company && item.title === job.title)) {
         showToast("Công việc này đã có trong mục đã lưu.", "error");
         return;
      }

      if (job.id && readAuthUser()) {
         try {
            const token = localStorage.getItem("accessToken");
            const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://localhost:8080";
            const res = await fetch(`${apiBase}/api/saved-jobs`, {
               method: "POST",
               headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
               body: JSON.stringify({ jobId: job.id })
            });
            if (!res.ok) {
               console.warn("Could not save job to server");
            }
         } catch (e) {
            console.error(e);
         }
      }

      const id = job.id ? `api-saved-${job.id}` : `${job.company}-${job.title}-${Date.now()}`;
      setSavedJobs([{ ...job, id, savedAt: new Date().toLocaleString("vi-VN") }, ...savedJobs]);
      showToast(`Đã lưu công việc: ${job.title} tại ${job.company}.`);
   };

   const removeApplication = (id: string) => {
      setApplications((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa hồ sơ ứng tuyển.");
   };

   const removeSavedJob = (id: string) => {
      setSavedJobs((current) => current.filter((item) => item.id !== id));
      showToast("Đã xóa mục đã lưu.");
   };

   const applicationToneStyles: Record<string, { badge: string; border: string; accent: string; panel: string }> = {
      amber: {
         badge: "border-amber-200 bg-amber-50 text-amber-700",
         border: "#fcd34d",
         accent: "#f59e0b",
         panel: "linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ffffff 100%)",
      },
      sky: {
         badge: "border-sky-200 bg-sky-50 text-sky-700",
         border: "#7dd3fc",
         accent: "#0ea5e9",
         panel: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #ffffff 100%)",
      },
      emerald: {
         badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
         border: "#6ee7b7",
         accent: "#10b981",
         panel: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 55%, #ffffff 100%)",
      },
      rose: {
         badge: "border-rose-200 bg-rose-50 text-rose-700",
         border: "#fda4af",
         accent: "#f43f5e",
         panel: "linear-gradient(135deg, #fff1f2 0%, #ffffff 55%, #ffffff 100%)",
      },
      slate: {
         badge: "border-gray-200 bg-gray-50 text-gray-700",
         border: "#cbd5e1",
         accent: "#64748b",
         panel: "linear-gradient(135deg, #f8fafc 0%, #ffffff 55%, #ffffff 100%)",
      },
   };

   const renderApplicationCard = (item: any) => {
      const statusMeta = getApplicationStatusMeta(item.status);
      const tone = applicationToneStyles[statusMeta.tone] ?? applicationToneStyles.slate;

      return (
         <article
            key={item.id}
            style={{
               background: tone.panel,
               border: `1px solid ${tone.border}`,
               borderRadius: 16,
               padding: 14,
               boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
            }}
         >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
               <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                     <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#0f172a", color: "#fff", padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                        Hồ sơ ứng tuyển
                     </span>
                     <span style={{ display: "inline-flex", alignItems: "center", borderWidth: 1, borderStyle: "solid", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }} className={tone.badge}>
                        {statusMeta.label}
                     </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{item.title || "Vị trí chưa xác định"}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                     <Building2 style={{ width: 13, height: 13 }} />
                     <span>{item.company || "Chưa có công ty"}</span>
                  </div>
               </div>

               <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", fontWeight: 700 }}>Trạng thái</div>
                  <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{statusMeta.label}</div>
               </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
               {item.place && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <MapPin style={{ width: 12, height: 12 }} />
                     {item.place}
                  </span>
               )}
               {item.salary && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <Wallet style={{ width: 12, height: 12 }} />
                     {item.salary}
                  </span>
               )}
               {item.type && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                     <Clock3 style={{ width: 12, height: 12 }} />
                     {item.type}
                  </span>
               )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12, color: "#64748b" }}>
               <CalendarClock style={{ width: 13, height: 13 }} />
               <span>Nộp lúc {item.appliedAt || "chưa xác định"}</span>
            </div>

            <p style={{ marginTop: 10, fontSize: 12, color: "#334155", lineHeight: 1.6 }}>{statusMeta.note}</p>
         </article>
      );
   };

   const renderSavedJobCard = (item: any) => (
      <article
         key={item.id}
         style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 65%, #f8fafc 100%)",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 14,
            boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
         }}
      >
         <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
               <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                     Đã lưu
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#f8fafc", color: "#475569", padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                     {item.savedAt || "Chưa xác định thời gian"}
                  </span>
               </div>
               <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{item.title || "Công việc đã lưu"}</div>
               <div style={{ marginTop: 6, fontSize: 13, color: "#475569", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Building2 style={{ width: 13, height: 13 }} />
                  <span>{item.company || "Chưa có công ty"}</span>
               </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
               <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", fontWeight: 700 }}>Mục lưu</div>
               <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Đang theo dõi</div>
            </div>
         </div>

         <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {item.place && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <MapPin style={{ width: 12, height: 12 }} />
                  {item.place}
               </span>
            )}
            {item.salary && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <Wallet style={{ width: 12, height: 12 }} />
                  {item.salary}
               </span>
            )}
            {item.field && (
               <span style={{ display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  <Clock3 style={{ width: 12, height: 12 }} />
                  {item.field}
               </span>
            )}
         </div>
      </article>
   );


   const getCompanyLogo = (company: CompanyItem) => {
      if (company.image) return company.image;
      const index = companies.findIndex((c) => c.name === company.name);
      if (index >= 0) {
         return companyAvatars[index % companyAvatars.length];
      }
      // stable hash fallback so different company names map to different avatars
      const hash = Array.from(company.name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return companyAvatars[hash % companyAvatars.length];
   };

   const getCompanyImage = (company: CompanyItem) => {
      if (company.companyImage) return company.companyImage;
      if (company.image) return company.image;
      const index = companies.findIndex((c) => c.name === company.name);
      if (index >= 0) {
         return companyImages[index % companyImages.length];
      }
      const hash = Array.from(company.name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return companyImages[hash % companyImages.length];
   };

   const selectedCompanyLogo = selectedCompany ? getCompanyLogo(selectedCompany) : companyAvatars[0];
   const selectedCompanyImage = selectedCompany ? getCompanyImage(selectedCompany) : companyImages[0];

   return (
      <div className="space-y-8">
         {/* Top rotating company banner */}
         <section className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] min-h-[400px] md:min-h-[520px]">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
               <img src={companyBannerItems[bannerIndex].image} alt={companyBannerItems[bannerIndex].title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/70" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 py-16 md:py-20">
               <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                     {companyBannerItems[bannerIndex].title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed mb-6">
                     {companyBannerItems[bannerIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                     {companyBannerItems.map((_, idx) => (
                        <button key={idx} onClick={() => setBannerIndex(idx)} className={`h-2 rounded-full transition-all ${idx === bannerIndex ? 'bg-emerald-600 w-8' : 'bg-slate-300 w-2 hover:bg-slate-400'}`} title={`Go to slide ${idx + 1}`} />
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* Dynamic Banner */}
         {selectedPosition && (
            <div style={{
               background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
               borderRadius: "20px",
               padding: "32px",
               marginTop: "24px",
               position: "relative",
               overflow: "hidden",
               color: "#fff",
            }}>
               <div style={{
                  position: "absolute", top: "-50px", right: "5%", width: "200px", height: "200px",
                  borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(40px)",
               }} />
               <div style={{
                  position: "absolute", bottom: "-30px", left: "10%", width: "150px", height: "150px",
                  borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(25px)",
               }} />
               <div style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}>
                  <img src={companyAvatars[companies.findIndex(c => c.name === selectedPosition.company)]} alt={selectedPosition.company} style={{ width: "80px", height: "80px", borderRadius: "16px", objectFit: "cover" }} />
                  <div>
                     <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
                        {toVietnameseJobTitle(selectedPosition.title)}
                     </h2>
                     <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "4px" }}>
                        {selectedPosition.company} • {selectedPosition.place || selectedCompany?.location}
                     </p>
                     <p style={{ fontSize: "14px", opacity: 0.8 }}>
                        {selectedPosition.description}
                     </p>
                  </div>
                  <button onClick={() => setSelectedPosition(null)} style={{
                     marginLeft: "auto", width: "32px", height: "32px", borderRadius: "8px",
                     border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)",
                     display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff"
                  }} title="Close this job posting">
                     <X style={{ width: 16, height: 16 }} />
                  </button>
               </div>
            </div>
         )}

         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filters.map((f) => {
               const isSelected = f === selectedFilter;
               return (
                  <button key={f} onClick={() => { setSelectedFilter(f); }} className={`${styles.filterButton} ${isSelected ? styles.active : ""} ${f === "Tất cả" ? styles.filterButtonAll : ""}`} title={`Filter by ${f}`}>
                     {f}
                  </button>
               );
            })}
         </div>

         <div className="grid grid-cols-1 gap-5">
            {filteredCompanies.map((item, index) => {
               const fc = fieldColors[item.field] ?? { bg: "#f1f5f9", text: "#475569" };
               const avatarSrc = getCompanyLogo(item);
               const companyImageSrc = getCompanyImage(item);
               const detailDescription = item.introduction
                  ? item.introduction
                  : `${item.description} Doanh nghiệp hiện có quy mô ${item.employees} nhân sự tại ${item.location}, đang tuyển ${item.positions.length} vị trí với lộ trình phát triển rõ ràng và môi trường làm việc chú trọng đào tạo. Phúc lợi nổi bật gồm: ${item.benefits.join(", ")}.`;
               // Ưu tiên slug từ API (đã chuẩn hóa tiếng Việt), fallback về normalizeName chỉ cho static data
               const companySlug = item.slug ?? normalizeName(item.name);
               return (
                  <Link key={item.name} to={`/cong-ty/${companySlug}`} style={{ textDecoration: "none", color: "inherit" }}>
                     <article style={{ background: "#fff", borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 22px 60px rgba(15,23,42,0.08)", transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease", cursor: "pointer" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 32px 80px rgba(15,23,42,0.14)"; (e.currentTarget as HTMLElement).style.border = `1px solid ${item.color}30`; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 22px 60px rgba(15,23,42,0.08)"; (e.currentTarget as HTMLElement).style.border = "1px solid rgba(15,23,42,0.08)"; }}>
                        {/* Company Image */}
                        <div style={{ width: "100%", height: "220px", overflow: "hidden", background: "#f8fafc", position: "relative" }}>
                           <img src={companyImageSrc} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                           <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,23,42,0.00), rgba(15,23,42,0.18))" }} />
                        </div>

                        {/* Company Info */}
                        <div style={{ padding: "28px" }}>
                           <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "18px", minWidth: 0 }}>
                                 <div style={{ width: "66px", height: "66px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 12px 34px rgba(15,23,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <img src={avatarSrc} alt={`${item.name} logo`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                 </div>
                                 <div style={{ minWidth: 0 }}>
                                    <h3 style={{ margin: 0, fontSize: "21px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{item.name}</h3>
                                    <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{item.field} • {item.location}</p>
                                 </div>
                              </div>
                              <span style={{ background: fc.bg, color: fc.text, borderRadius: "999px", padding: "8px 16px", fontSize: "12px", fontWeight: 700 }}>{item.rating}/5</span>
                           </div>
                           <p style={{ marginTop: "18px", color: "#475569", fontSize: "14px", lineHeight: 1.75, minHeight: "98px", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {detailDescription}
                           </p>
                           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 14px", color: "#475569", fontSize: "12px", fontWeight: 700 }}><Users style={{ width: 13, height: 13, color: "#64748b" }} /> {item.employees}</span>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 14px", color: "#475569", fontSize: "12px", fontWeight: 700 }}><MapPin style={{ width: 13, height: 13, color: "#64748b" }} /> {item.location}</span>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 14px", color: "#475569", fontSize: "12px", fontWeight: 700 }}><Star style={{ width: 13, height: 13, color: "#64748b" }} /> {item.rating}/5</span>
                           </div>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "22px", flexWrap: "wrap", gap: "12px" }}>
                              <span style={{ background: `${item.color}15`, color: item.color, borderRadius: "999px", padding: "10px 16px", fontSize: "13px", fontWeight: 700 }}>{item.positions.length} vị trí đang mở</span>
                              <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: 700, opacity: 0.8 }}>Khám phá cơ hội nghề nghiệp</span>
                           </div>
                        </div>
                     </article>
                  </Link>
               );
            })}
            {!loadingMore && hasMore && (
               <div style={{ textAlign: "center", padding: "20px" }}>
                  <button
                     onClick={() => {
                        loadMoreCompanies();
                     }}
                     style={{
                        padding: "12px 28px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 10px 25px rgba(16,185,129,0.15)",
                        transition: "all 0.2s ease"
                     }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(16,185,129,0.25)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px rgba(16,185,129,0.15)"; }}
                  >
                     Xem thêm công ty
                  </button>
               </div>
            )}
            {loadingMore && (
               <div style={{ textAlign: "center", padding: "20px", color: "#059669", fontWeight: 800, fontSize: "14px" }} className="animate-pulse">
                  Đang tải thêm công ty...
               </div>
            )}
            {!hasMore && apiCompanies.length > 0 && (
               <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Đã tải hết tất cả công ty
               </div>
            )}
         </div>

         {selectedCompany && (
            <>
               <div onClick={() => setSelectedCompany(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", zIndex: 1000 }} />
               <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(760px, calc(100vw - 32px))", maxHeight: "82vh", zIndex: 1001, padding: "0" }}>
                  <div style={{ position: "relative", width: "100%", background: "#fff", borderRadius: "20px", boxShadow: "0 24px 80px rgba(15,23,42,0.35)", overflow: "hidden" }}>
                     <button onClick={() => setSelectedCompany(null)} style={{ position: "absolute", top: "16px", right: "16px", width: 40, height: 40, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", flexShrink: 0, zIndex: 10, transition: "all 0.2s ease" }} title="Close company details"><X style={{ width: 18, height: 18 }} /></button>
                     <div style={{ padding: "28px", paddingTop: "56px", maxHeight: "82vh", overflow: "hidden" }}>
                        <div style={{ maxHeight: "calc(82vh - 72px)", overflowY: "auto", paddingRight: "8px" }}>
                           <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", minHeight: "220px", background: "#f8fafc" }}>
                              <img src={selectedCompanyImage} alt={selectedCompany.name} style={{ width: "100%", height: "220px", objectFit: "cover", display: "block", filter: "brightness(0.72)" }} />
                              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.72))" }} />
                              <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "24px", zIndex: 2, color: "#fff" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
                                    <div style={{ width: "76px", height: "76px", borderRadius: "22px", overflow: "hidden", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 42px rgba(0,0,0,0.28)" }}>
                                       <img src={selectedCompanyLogo} alt={`${selectedCompany.name} logo`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                       <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "rgba(255,255,255,0.18)", padding: "8px 14px", fontSize: "12px", fontWeight: 700, color: "#fff" }}>{selectedCompany.field}</span>
                                       <h2 style={{ margin: "12px 0 8px", fontSize: "30px", fontWeight: 900, lineHeight: 1.05 }}>{selectedCompany.name}</h2>
                                       <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.88)", lineHeight: 1.7 }}>{selectedCompany.description}</p>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "18px" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "9px 14px", fontSize: "12px", fontWeight: 700 }}><Star style={{ width: 14, height: 14 }} /> {selectedCompany.rating}/5</span>
                                    <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "9px 14px", fontSize: "12px", fontWeight: 700 }}><Users style={{ width: 14, height: 14 }} /> {selectedCompany.employees}</span>
                                    <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "9px 14px", fontSize: "12px", fontWeight: 700 }}><MapPin style={{ width: 14, height: 14 }} /> {selectedCompany.location}</span>
                                    <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "9px 14px", fontSize: "12px", fontWeight: 700 }}><Star style={{ width: 14, height: 14 }} /> {selectedCompany.positions.length} vị trí đang mở</span>
                                 </div>
                              </div>
                           </div>
                           <div style={{ marginTop: "24px", display: "grid", gap: "18px" }}>
                              <div style={{ background: "#f8fafc", padding: "22px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 14px 40px rgba(15,23,42,0.06)" }}>
                                 <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: 0, marginBottom: "12px" }}>Giới thiệu công ty</h3>
                                 <div style={{ display: "grid", gap: "12px" }}>
                                    {getCompanyIntroduction(selectedCompany).map((line, idx) => (
                                       <p key={idx} style={{ margin: 0, color: "#475569", fontSize: "14px", lineHeight: 1.85 }}>{line}</p>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div style={{ marginTop: "24px", display: "grid", gap: "18px" }}>
                              <div style={{ display: "grid", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                                 <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Thông tin liên hệ</h3>
                                 <div style={{ display: "grid", gap: "10px" }}>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                       <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: `${selectedCompany.color}15`, color: selectedCompany.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✉</span>
                                       <div>
                                          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Email</p>
                                          <p style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>{selectedCompany.contact?.email}</p>
                                       </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                       <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: `${selectedCompany.color}15`, color: selectedCompany.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>☎</span>
                                       <div>
                                          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Điện thoại</p>
                                          <p style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>{selectedCompany.contact?.phone}</p>
                                       </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                       <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: `${selectedCompany.color}15`, color: selectedCompany.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>🌐</span>
                                       <div>
                                          <p style={{ margin: 0, color: "#64748b", fontSize: "12px" }}>Website</p>
                                          <p style={{ margin: 0, color: selectedCompany.color, fontWeight: 700 }}>{selectedCompany.contact?.website}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div style={{ display: "grid", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                                 <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Điều khoản & Phúc lợi</h3>
                                 <div style={{ display: "grid", gap: "10px" }}>
                                    {selectedCompany.terms?.map((term, idx) => (
                                       <div key={`term-${idx}`} style={{ padding: "12px 14px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
                                          <span style={{ width: "24px", height: "24px", borderRadius: "8px", background: `${selectedCompany.color}20`, color: selectedCompany.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✓</span>
                                          <span style={{ color: "#0f172a", fontWeight: 600 }}>{term}</span>
                                       </div>
                                    ))}
                                 </div>
                                 <div style={{ display: "grid", gap: "10px" }}>
                                    {selectedCompany.benefits.map((benefit, idx) => (
                                       <div key={`benefit-${idx}`} style={{ padding: "12px 14px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
                                          <span style={{ width: "24px", height: "24px", borderRadius: "8px", background: `${selectedCompany.color}20`, color: selectedCompany.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>★</span>
                                          <span style={{ color: "#0f172a", fontWeight: 600 }}>{benefit}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <p style={{ marginTop: "8px", color: "#475569", fontSize: "13px", fontWeight: 700 }}>{selectedCompany.positions.length} vị trí đang mở</p>
                           <div style={{ marginTop: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                              {selectedCompany.positions.map((position) => (
                                 <article key={position.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                                       <div style={{ flex: 1 }}>
                                          <h3 onClick={() => setSelectedPosition({ ...position, title: toVietnameseJobTitle(position.title), company: selectedCompany.name, place: selectedCompany.location })} style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "8px", cursor: "pointer" }}>{toVietnameseJobTitle(position.title)}</h3>
                                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#059669", fontSize: "13px", fontWeight: 700 }}><Wallet style={{ width: 14, height: 14 }} /> {position.salary}</span>
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#475569", fontSize: "13px" }}><MapPin style={{ width: 13, height: 13 }} /> {selectedCompany.location}</span>
                                             <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#475569", fontSize: "13px" }}>{position.workingHours}</span>
                                          </div>
                                          <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.6, marginBottom: "10px" }}>{position.description}</p>
                                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{position.skills.map((skill) => <span key={skill} style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>{skill}</span>)}</div>
                                       </div>
                                       <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                          <button onClick={() => addSavedJob({ id: position.id, company: selectedCompany.name, title: toVietnameseJobTitle(position.title), place: selectedCompany.location, salary: position.salary, field: selectedCompany.field, description: position.description, type: position.workingHours, companyColor: selectedCompany.color, savedFrom: selectedCompany.name })} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }} title="Save this job"><Bookmark style={{ width: 15, height: 15 }} /></button>
                                          <button onClick={() => addApplication({ id: position.id, company: selectedCompany.name, title: toVietnameseJobTitle(position.title), place: selectedCompany.location, salary: position.salary, field: selectedCompany.field, description: position.description, type: position.workingHours, companyColor: selectedCompany.color, companyDescription: selectedCompany.description, image: selectedCompany.image ?? companyAvatars[0] })} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: selectedCompany.color, color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: `0 4px 14px ${selectedCompany.color}40` }} title="Apply for this position">Ứng tuyển</button>
                                       </div>
                                    </div>
                                 </article>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </>
         )}

         <button onClick={() => setShowTray(true)} style={{ position: "fixed", right: "24px", bottom: "24px", width: "60px", height: "60px", borderRadius: "999px", border: "none", background: "linear-gradient(135deg, #ec4899, #db2777)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 14px 30px rgba(236,72,153,0.35)", zIndex: 900 }} title="Ứng tuyển và công việc đã lưu"><Heart style={{ width: 24, height: 24, color: "#fff" }} /></button>

         {showTray && (
            <>
               <div onClick={() => setShowTray(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", zIndex: 1100 }} />
               <div style={{ position: "fixed", right: "24px", bottom: "94px", width: "min(420px, calc(100vw - 32px))", maxHeight: "72vh", overflowY: "auto", background: "#fff", borderRadius: "18px", boxShadow: "0 24px 70px rgba(15,23,42,0.3)", zIndex: 1101, padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                     <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Mục đã lưu</h3>
                     <button onClick={() => setShowTray(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}><X style={{ width: 16, height: 16 }} /></button>
                  </div>
                  <div style={{ display: "grid", gap: "14px" }}>
                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Đã ứng tuyển ({applications.length})</div>
                        <div style={{ display: "grid", gap: 10 }}>{applications.length === 0 ? <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có ứng tuyển nào.</div> : applications.map((item) => (
                           <div key={item.id} style={{ position: "relative" }}>
                              {renderApplicationCard(item)}
                              <button
                                 onClick={() => removeApplication(item.id)}
                                 style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 10, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                 title="Xóa hồ sơ ứng tuyển"
                              >
                                 <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                           </div>
                        ))}</div>
                     </div>
                     <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Công việc đã lưu ({savedJobs.length})</div>
                        <div style={{ display: "grid", gap: 10 }}>{savedJobs.length === 0 ? <div style={{ fontSize: 13, color: "#94a3b8" }}>Chưa có công việc nào được lưu.</div> : savedJobs.map((item) => (
                           <div key={item.id} style={{ position: "relative" }}>
                              {renderSavedJobCard(item)}
                              <button
                                 onClick={() => removeSavedJob(item.id)}
                                 style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 10, border: "1px solid #fecaca", background: "#fff1f2", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                 title="Xóa mục đã lưu"
                              >
                                 <Trash2 style={{ width: 14, height: 14 }} />
                              </button>
                           </div>
                        ))}</div>
                     </div>
                  </div>
               </div>
            </>
         )}

         {toast && (
            <div style={{ position: "fixed", left: "50%", top: 24, transform: "translateX(-50%)", zIndex: 1300, minWidth: "min(520px, calc(100vw - 24px))" }}>
               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderRadius: 14, border: `1px solid ${toast.kind === "success" ? "#86efac" : "#fca5a5"}`, background: toast.kind === "success" ? "linear-gradient(135deg, #f0fdf4, #ffffff)" : "linear-gradient(135deg, #fff1f2, #ffffff)", boxShadow: "0 18px 50px rgba(15,23,42,0.16)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                     <div style={{ width: 10, height: 10, borderRadius: 999, background: toast.kind === "success" ? "#16a34a" : "#dc2626", flexShrink: 0 }} />
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", fontWeight: 700 }}>×</button>
               </div>
            </div>
         )}
      </div>
   );
}
