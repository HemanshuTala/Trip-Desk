export default function MarqueeStrip() {
  const items = ['Slow Travel', 'Offbeat Routes', 'Small Groups', 'Real Hosts', 'Curated Journeys', 'Honest Travel']

  return (
    <div className="w-full bg-rust overflow-hidden py-3.5 flex">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 8 }).flatMap((_, i) =>
          items.map((item) => (
            <span key={`${i}-${item}`} className="text-cream text-[10px] font-bold tracking-widest uppercase mx-8 shrink-0">
              {item} ·
            </span>
          ))
        )}
      </div>
    </div>
  )
}
