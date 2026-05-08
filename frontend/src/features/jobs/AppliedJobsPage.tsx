import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CalendarClock, MapPin } from "lucide-react";
import { readAuthUser } from "../../utils/auth";
import logoImg from "../../assets/logo/Screenshot_2026-05-07_133557-removebg-preview.png";
import { getApplicationStatusMeta } from "../../utils/application";
import { toVietnameseJobTitle } from "../../utils/jobTitle";

type StoredApplication = {
   id?: string;
   title?: string;
   company?: string;
   place?: string;
   field?: string;
   salary?: string;
   type?: string;
   industry?: string;
   appliedAt?: string;
   savedAt?: string;
   status?: string;
   trackingNote?: string;
   description?: string;
};

const statusToneStyles: Record<string, { badge: string; border: string; accent: string; panel: string }> = {
   amber: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      border: "border-amber-200",
      accent: "bg-amber-500",
      panel: "from-amber-50 via-white to-white",
   },
   sky: {
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      border: "border-sky-200",
      accent: "bg-sky-500",
      panel: "from-sky-50 via-white to-white",
   },
   emerald: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      border: "border-emerald-200",
      accent: "bg-emerald-500",
      panel: "from-emerald-50 via-white to-white",
   },
   rose: {
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      border: "border-rose-200",
      accent: "bg-rose-500",
      panel: "from-rose-50 via-white to-white",
   },
   slate: {
      badge: "border-gray-200 bg-gray-50 text-gray-700",
      border: "border-gray-200",
      accent: "bg-gray-500",
      panel: "from-slate-50 via-white to-white",
   },
};

const loadApplications = () => {
   try {
      const raw = localStorage.getItem("jobpilot_applications");
      if (!raw) {
         return [] as StoredApplication[];
      }

      const parsed = JSON.parse(raw) as StoredApplication[];
      return Array.isArray(parsed) ? parsed : [];
   } catch {
      return [] as StoredApplication[];
   }
};

export default function AppliedJobsPage() {
   const currentUser = readAuthUser();
   const applications = useMemo(loadApplications, []);

   const renderTag = (label: string) => (
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-600">
         {label}
      </span>
   );

   if (!currentUser) {
      return (
         <section className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)]">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-10 text-white md:px-10">
               <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                  <img src={logoImg} alt="JobPilot logo" className="h-4 w-4" style={{ objectFit: "contain" }} />
                  Hồ sơ ứng tuyển
               </span>
               <h1 className="mt-5 text-3xl font-black tracking-tight text-white md:text-4xl">
                  Công việc đã ứng tuyển
               </h1>
               <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
                  Theo dõi vị trí đã nộp, công ty, thời gian ứng tuyển và trạng thái phản hồi của từng hồ sơ.
               </p>
               <Link
                  to="/dang-nhap"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-900 transition-transform hover:-translate-y-0.5"
               >
                  Đăng nhập để xem hồ sơ
                  <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
            <div className="px-6 py-8 md:px-10">
               <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
                  Bạn cần đăng nhập để xem danh sách công việc đã ứng tuyển.
               </p>
            </div>
         </section>
      );
   }

   return (
      <section className="mx-auto max-w-6xl space-y-6">
         <div className="grid gap-4 lg:grid-cols-[1.65fr_0.95fr]">
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] md:p-8">
               <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                     <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Danh sách hồ sơ</p>
                     <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{currentUser.name}</h2>
                     <p className="mt-2 text-sm leading-7 text-slate-700">
                        Mỗi hồ sơ bên dưới đều hiển thị trạng thái hiện tại để bạn biết đang chờ xác nhận, đã phỏng vấn hay đã trúng tuyển.
                     </p>
                  </div>
                  <Link
                     to="/tim-viec"
                     className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                     Tìm thêm việc
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </div>

               <div className="mt-6 space-y-4">
                  {applications.length === 0 ? (
                     <div className="rounded-[24px] border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
                           <Building2 className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900">Chưa có hồ sơ nào</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-700">
                           Khi bạn ứng tuyển từ trang việc làm hoặc công ty, hồ sơ sẽ xuất hiện tại đây kèm thời gian và trạng thái xử lý.
                        </p>
                     </div>
                  ) : (
                     applications.map((job) => {
                        const statusMeta = getApplicationStatusMeta(job.status);
                        const tone = statusToneStyles[statusMeta.tone] ?? statusToneStyles.slate;
                        const placeLabel = job.place ?? job.industry;

                        return (
                           <article
                              key={job.id ?? `${job.company}-${job.title}-${job.appliedAt}`}
                              className={`rounded-[24px] border ${tone.border} bg-gradient-to-br ${tone.panel} p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)]`}
                           >
                              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                 <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                       <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                                          Hồ sơ ứng tuyển
                                       </span>
                                       <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tone.badge}`}>
                                          {statusMeta.label}
                                       </span>
                                    </div>
                                    <h3 className="mt-3 text-xl font-black tracking-tight text-slate-900">{toVietnameseJobTitle(job.title ?? "Vị trí chưa xác định")}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-700">
                                       <span className="inline-flex items-center gap-1.5">
                                          <Building2 className="h-4 w-4 text-slate-600" />
                                          {job.company ?? "Chưa có công ty"}
                                       </span>
                                       {placeLabel && (
                                          <span className="inline-flex items-center gap-1.5">
                                             <MapPin className="h-4 w-4 text-slate-600" />
                                             {placeLabel}
                                          </span>
                                       )}
                                       <span className="inline-flex items-center gap-1.5">
                                          <CalendarClock className="h-4 w-4 text-slate-600" />
                                          {job.appliedAt ?? job.savedAt ?? "Chưa xác định thời gian"}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="shrink-0 rounded-2xl bg-white/70 px-4 py-3 text-right shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Trạng thái hiện tại</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900">{statusMeta.label}</p>
                                 </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                 {job.salary && renderTag(job.salary)}
                                 {job.field && renderTag(job.field)}
                                 {job.type && renderTag(job.type)}
                                 {job.industry && renderTag(job.industry)}
                              </div>

                              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
                                 <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${tone.accent}`} />
                                    <div>
                                       <p className="text-sm font-semibold text-slate-900">{statusMeta.note}</p>
                                       <p className="mt-1 text-sm leading-6 text-slate-700">Nếu hồ sơ đã được xử lý, trạng thái sẽ được phản ánh ngay tại đây.</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Clock3 className="h-4 w-4" />
                                    Cập nhật theo thời gian nộp
                                 </div>
                              </div>
                           </article>
                        );
                     })
                  )}
               </div>
            </div>

            <aside className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] md:p-8">
               <h3 className="text-lg font-black tracking-tight text-slate-900">Giải thích trạng thái</h3>
               <div className="mt-5 space-y-3">
                  {[
                     { title: "Đang chờ xác nhận", detail: "Hồ sơ đã gửi nhưng nhà tuyển dụng chưa phản hồi." },
                     { title: "Hồ sơ đã tiếp nhận", detail: "Hệ thống ghi nhận, đang chờ xử lý nội bộ." },
                     { title: "Mời phỏng vấn", detail: "Bạn đã qua vòng sàng lọc và có lịch trao đổi tiếp theo." },
                     { title: "Trúng tuyển", detail: "Ứng tuyển thành công, có thể bắt đầu bước nhận việc." },
                     { title: "Không phù hợp", detail: "Hồ sơ chưa đáp ứng yêu cầu tuyển chọn hiện tại." },
                  ].map((item) => (
                     <div key={item.title} className="rounded-2xl border border-gray-200 bg-emerald-50 px-4 py-4">
                        <p className="text-sm font-bold text-slate-900">{toVietnameseJobTitle(item.title)}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{item.detail}</p>
                     </div>
                  ))}
               </div>

               <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-50/80">Mẹo theo dõi</p>
                  <p className="mt-2 text-sm leading-7 text-white/90">
                     Hãy lưu lại các job quan tâm trước, sau đó ứng tuyển từ cùng một thẻ để tra cứu dễ hơn khi danh sách hồ sơ tăng lên.
                  </p>
               </div>
            </aside>
         </div>
      </section>
   );
}
