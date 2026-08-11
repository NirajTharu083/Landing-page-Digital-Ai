export default function Urgency() {
  return (
    <section className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#3d2424] px-6 py-12 text-center text-white shadow-2xl md:px-14 md:py-16">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#f3cd97]">Limited consultation availability</p>
        <h2 className="display mx-auto max-w-2xl text-4xl font-black md:text-5xl">Book while consultation slots are open.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/75 md:text-base">I personally conduct each one-to-one consultation, so the number of calls I can take is limited.</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">If you&apos;d like a customized AI marketing plan for your business, book your available time while consultation slots are open.</p>
        <a className="cta mt-7" href="#consultation">Book Free Consultation <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
