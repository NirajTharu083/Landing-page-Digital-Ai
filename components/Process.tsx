const steps = [
  ["01", "Tell Me About Your Business", "Fill out the short form below so I can understand your business and current marketing situation."],
  ["02", "Book Your Free Consultation", "Choose a time for your one-to-one AI marketing consultation."],
  ["03", "Get Your Customized Marketing Plan", "We'll identify your key marketing opportunities and map out practical next steps for your business."],
];

export default function Process() {
  return (
    <section className="section-pad bg-white">
      <div className="container-shell">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">How it works</p>
          <h2 className="display text-4xl font-black md:text-5xl">Three simple steps.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, copy]) => (
            <article className="relative rounded-[1.5rem] border border-[#3d2424]/10 p-6 md:p-8" key={number}>
              <span className="text-4xl font-black text-[#e98b50]/45">{number}</span>
              <h3 className="mt-6 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#755e58]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
