export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[680px] items-center py-16 text-center md:min-h-[760px] md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(243,205,151,.75),transparent_38%),linear-gradient(180deg,#fffaf1_0%,#fffdf8_100%)]" />
      <div className="absolute left-1/2 top-20 -z-10 size-[520px] -translate-x-1/2 rounded-full border border-[#bc4f4f]/10 opacity-70 md:size-[740px]" />
      <div className="container-shell mx-auto max-w-4xl">
        <div className="eyebrow mb-6">✦ Free one-to-one consultation</div>
        <h1 className="display mx-auto max-w-4xl text-[2.7rem] font-black sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          Get a Free Customized <span className="text-[#bc4f4f]">AI Marketing Plan</span> for Your Business
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-7 text-[#5f4540] md:text-xl md:leading-8">
          Discover a clearer way to generate leads, improve your marketing, and turn more opportunities into customers.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#755e58] md:text-base">
          We&apos;ll look at your current marketing, identify key opportunities, and create a practical AI marketing plan customized for your business.
        </p>
        <a className="cta mt-8 w-full sm:w-auto" href="#consultation">Book Free Consultation <span aria-hidden="true">↓</span></a>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#755e58]">
          <span>✓ One-to-one</span><span>✓ Customized plan</span><span>✓ Free consultation</span>
        </div>
      </div>
    </section>
  );
}
