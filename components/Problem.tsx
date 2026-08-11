export default function Problem() {
  return (
    <section className="section-pad bg-white">
      <div className="container-shell grid items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-16">
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">Is this for you?</p>
          <h2 className="display text-4xl font-black md:text-5xl">A clearer path to consistent leads and sales.</h2>
        </div>
        <div className="card p-6 md:p-8">
          <p className="text-base leading-7 text-[#5f4540]">If you&apos;re a small or medium business owner struggling with inconsistent leads or sales, this free one-to-one consultation is for you.</p>
          <div className="my-5 h-px bg-[#3d2424]/10" />
          <p className="text-base leading-7 text-[#5f4540]">We&apos;ll look at your current marketing, identify key opportunities, and create a practical AI marketing plan customized for your business.</p>
          <a href="#consultation" className="mt-5 inline-flex font-extrabold text-[#bc4f4f]">Book Free Consultation →</a>
        </div>
      </div>
    </section>
  );
}
