export default function SiteFooter() {
  return (
    <footer className="border-t border-sand/20 py-12 px-6 bg-cream">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-display font-bold text-xl text-ink block">Nomichi</span>
          <span className="text-[9px] uppercase tracking-wider text-ink/30 font-sans font-light">
            © {new Date().getFullYear()} Nomichi Explorers Private Limited
          </span>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-ink/35 font-sans">
          <span>Wander</span>
          <span className="text-sand">·</span>
          <span>Connect</span>
          <span className="text-sand">·</span>
          <span>Belong</span>
        </div>
        <a href="/login" className="text-[10px] uppercase tracking-widest font-bold text-ink/35 hover:text-rust transition-colors font-sans">
          Team →
        </a>
      </div>
    </footer>
  )
}
