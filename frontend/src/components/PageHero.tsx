type PageHeroProps = {
   title: string;
   subtitle: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
   return (
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 md:px-10 md:py-14 shadow-sm">
         <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
         <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-200/70 blur-3xl" />
         <div className="relative">
            <p className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
               JobPilot Frontend
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">{subtitle}</p>
         </div>
      </section>
   );
}
