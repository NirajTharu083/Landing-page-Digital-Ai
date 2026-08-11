import Header from "@/components/Header";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_10%,rgba(243,205,151,.85),transparent_32%),#fffaf1]">
      <Header />
      <section className="container-shell py-14 text-center md:py-20">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#bc4f4f] text-2xl text-white shadow-xl">✓</div>
        <h1 className="display mx-auto mt-7 max-w-3xl text-4xl font-black sm:text-5xl md:text-6xl">Congratulations! Your First Step Is Complete.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#5f4540]">Your request for a <strong>Free AI Marketing Consultation</strong> has been received.</p>
        <p className="mt-2 font-bold text-[#bc4f4f]">Now complete the next steps below.</p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 text-left md:grid-cols-2">
          <article className="card bg-white p-6 md:p-8">
            <span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">Step 1</span>
            <h2 className="mt-3 text-2xl font-black">Check Your Email</h2>
            <p className="mt-3 leading-7 text-[#755e58]">We&apos;ve sent you the information you need to continue with your consultation.</p>
            <p className="mt-4 font-extrabold">Check your inbox and follow the instructions in the email.</p>
          </article>
          <article className="card bg-white p-6 md:p-8">
            <span className="text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">Step 2</span>
            <h2 className="mt-3 text-2xl font-black">Have a Question? Message Me on WhatsApp</h2>
            <p className="mt-3 leading-7 text-[#755e58]">If you have any questions before the consultation, you can contact me directly on WhatsApp.</p>
            <a className="cta mt-6 w-full sm:w-auto" href="https://t.ly/PicEi" target="_blank" rel="noopener noreferrer">Message Me on WhatsApp →</a>
          </article>
        </div>

        <section className="mx-auto mt-6 max-w-4xl rounded-[1.5rem] bg-[#3d2424] p-6 text-left text-white md:p-10">
          <h2 className="text-2xl font-black md:text-3xl">What Happens During Your Consultation?</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {["Look at your current marketing situation", "Identify key marketing opportunities", "Discuss ways to generate more qualified leads", "Explore where AI can improve your marketing and follow-up", "Map out practical next steps for your business"].map((item) => <p className="flex gap-3 text-sm leading-6 text-white/80" key={item}><span className="font-black text-[#f3cd97]">✓</span>{item}</p>)}
          </div>
        </section>

        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="display text-4xl font-black">See You on the Consultation Call!</h2>
          <p className="mt-4 leading-7 text-[#755e58]">Come prepared to talk about your business, your current marketing challenges, and what you want to achieve.</p>
          <p className="mt-4 font-extrabold">I look forward to helping you create a clearer AI marketing plan for your business.</p>
        </div>
      </section>
    </main>
  );
}
