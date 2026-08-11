const benefits = [
  "Identify what's holding your marketing back",
  "Discover opportunities to generate more qualified leads",
  "Find ways to improve your lead follow-up and conversion",
  "Understand where AI can improve your marketing",
  "Get clear next steps based on your business",
];

export default function Benefits() {
  return (
    <section className="section-pad bg-[#f8ead5]">
      <div className="container-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">How you benefit</p>
          <h2 className="display text-4xl font-black md:text-5xl">Practical direction, built around your business.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {benefits.map((benefit, index) => (
            <article key={benefit} className={`card p-6 ${index < 3 ? "lg:col-span-2" : index === 3 ? "lg:col-span-3" : "lg:col-span-3"}`}>
              <span className="mb-5 grid size-10 place-items-center rounded-xl bg-[#bc4f4f]/10 font-black text-[#bc4f4f]">✓</span>
              <h3 className="text-base font-extrabold leading-6">{benefit}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
