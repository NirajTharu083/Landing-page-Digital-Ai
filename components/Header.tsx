export default function Header() {
  return (
    <header className="relative z-20 border-b border-[#3d2424]/8 bg-[#fffaf1]/85 backdrop-blur-md">
      <div className="container-shell flex h-16 items-center justify-center md:h-20">
        <div aria-label="Digital Niraj" className="flex items-center gap-2 text-sm font-extrabold tracking-[-0.03em] md:text-base">
          <span className="grid size-8 place-items-center rounded-xl bg-[#bc4f4f] text-[10px] text-white shadow-sm">DN</span>
          <span>Digital <span className="text-[#bc4f4f]">Niraj</span></span>
        </div>
      </div>
    </header>
  );
}
