import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building2, CalendarClock, Clock3, MapPin, Sparkles } from "lucide-react";
import { readAuthUser } from "../../utils/auth";
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
      badge: "border-slate-200 bg-slate-50 text-slate-700",
      border: "border-slate-200",
      accent: "bg-slate-500",
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

   const stats = useMemo(() => {
      return applications.reduce(
         (accumulator, item) => {
            const meta = getApplicationStatusMeta(item.status);
            accumulator.total += 1;
            accumulator[meta.bucket] += 1;
            return accumulator;
         },
         { total: 0, pending: 0, review: 0, interview: 0, success: 0, rejected: 0, neutral: 0 },
      );
   }, [applications]);

   const statCards = [
      {
         label: "Tổng hồ sơ",
         value: stats.total,
         helper: "Đang theo dõi trong hệ thống",
         icon: BadgeCheck,
      },
      {
         label: "Chờ xác nhận",
         value: stats.pending + stats.review,
         helper: "Đã nộp nhưng chưa có phản hồi cuối cùng",
         icon: Clock3,
      },
      {
         label: "Đã tiến triển",
         value: stats.interview + stats.success,
         helper: "Phỏng vấn, offer hoặc trúng tuyển",
         icon: BadgeCheck,
      },
   ];

   const renderTag = (label: string) => (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
         {label}
      </span>
   );

   if (!currentUser) {
      return (
         <section className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)]">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-10 text-white md:px-10">
               <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  Hồ sơ ứng tuyển
               </span>
               <h1 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">Công việc đã ứng tuyển</h1>
               <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
                  Theo dõi vị trí đã nộp, công ty, thời gian ứng tuyển và trạng thái phản hồi của từng hồ sơ.
               </p>
               <Link
                  to="/dang-nhap"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
               >
                  Đăng nhập để xem hồ sơ
                  <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
            <div className="px-6 py-8 md:px-10">
               <p className="text-sm text-slate-600">Bạn cần đăng nhập để xem danh sách công việc đã ứng tuyển.</p>
            </div>
         </section>
      );
   }

   return (
      <section className="mx-auto max-w-6xl space-y-6">
         <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-8 text-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.6)] md:px-10 md:py-10">
            <div className="max-w-3xl">
               <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  Theo dõi hồ sơ
               </span>
               <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Công việc đã ứng tuyển</h1>
               <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
                  Danh sách này thể hiện rõ bạn đã ứng tuyển vị trí nào, tại công ty nào, thời gian gửi hồ sơ và tình trạng hiện tại.
               </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
               {statCards.map((card) => {
                  const Icon = card.icon;

                  return (
                     <article key={card.label} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-4">
                           <div>
                              <p className="text-sm text-emerald-50/70">{card.label}</p>
                              <p className="mt-2 text-3xl font-black">{card.value}</p>
                           </div>
                           <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white">
                              <Icon className="h-5 w-5" />
                           </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-emerald-50/75">{card.helper}</p>
                     </article>
                  );
               })}
            </div>
         </div>

         <div className="grid gap-4 lg:grid-cols-[1.65fr_0.95fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] md:p-8">
               <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                     <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Danh sách hồ sơ</p>
                     <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{currentUser.name}</h2>
                     <p className="mt-2 text-sm leading-7 text-slate-600">
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
                     <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
                           <Building2 className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900">Chưa có hồ sơ nào</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">
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
                                       <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                                          Hồ sơ ứng tuyển
                                       </span>
                                       <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tone.badge}`}>
                                          {statusMeta.label}
                                       </span>
                                    </div>
                                    <h3 className="mt-3 text-xl font-black tracking-tight text-slate-900">{toVietnameseJobTitle(job.title ?? "Vị trí chưa xác định")}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                                       <span className="inline-flex items-center gap-1.5">
                                          <Building2 className="h-4 w-4 text-slate-400" />
                                          {job.company ?? "Chưa có công ty"}
                                       </span>
                                       {placeLabel && (
                                          <span className="inline-flex items-center gap-1.5">
                                             <MapPin className="h-4 w-4 text-slate-400" />
                                             {placeLabel}
                                          </span>
                                       )}
                                       <span className="inline-flex items-center gap-1.5">
                                          <CalendarClock className="h-4 w-4 text-slate-400" />
                                          {job.appliedAt ?? job.savedAt ?? "Chưa xác định thời gian"}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="shrink-0 rounded-2xl bg-white/70 px-4 py-3 text-right shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trạng thái hiện tại</p>
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
                                       <p className="mt-1 text-sm leading-6 text-slate-600">Nếu hồ sơ đã được xử lý, trạng thái sẽ được phản ánh ngay tại đây.</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
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

            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] md:p-8">
               <h3 className="text-lg font-black tracking-tight text-slate-900">Giải thích trạng thái</h3>
               <div className="mt-5 space-y-3">
                  {[
                     { title: "Đang chờ xác nhận", detail: "Hồ sơ đã gửi nhưng nhà tuyển dụng chưa phản hồi." },
                     { title: "Hồ sơ đã tiếp nhận", detail: "Hệ thống ghi nhận, đang chờ xử lý nội bộ." },
                     { title: "Mời phỏng vấn", detail: "Bạn đã qua vòng sàng lọc và có lịch trao đổi tiếp theo." },
                     { title: "Trúng tuyển", detail: "Ứng tuyển thành công, có thể bắt đầu bước nhận việc." },
                     { title: "Không phù hợp", detail: "Hồ sơ chưa đáp ứng yêu cầu tuyển chọn hiện tại." },
                  ].map((item) => (
                     <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-sm font-bold text-slate-900">{toVietnameseJobTitle(item.title)}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
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
