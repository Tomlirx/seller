const ICONS: Record<string, React.ReactNode> = {
  mountain: (
    <path d="M3 18 L9 8 L13 14 L16 10 L21 18 Z" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 3 L19 6 V11 C19 16 16 19.5 12 21 C8 19.5 5 16 5 11 V6 Z" strokeLinejoin="round" />
  ),
  leaf: (
    <path d="M5 19 C5 11 11 5 19 5 C19 13 13 19 5 19 Z M5 19 C8 16 11 13 16 8" strokeLinejoin="round" />
  ),
  heart: (
    <path d="M12 20 C5 15 3 11 3 8 C3 5.5 5 4 7.5 4 C9.5 4 11 5 12 7 C13 5 14.5 4 16.5 4 C19 4 21 5.5 21 8 C21 11 19 15 12 20 Z" strokeLinejoin="round" />
  ),
};

const BADGES = [
  { icon: "mountain", zh: "天然翡翠", en: "NATURAL JADE" },
  { icon: "shield", zh: "严选品质", en: "QUALITY" },
  { icon: "leaf", zh: "匠心甄选", en: "CURATED" },
  { icon: "heart", zh: "结缘有缘人", en: "MEANINGFUL" },
] as const;

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
      {BADGES.map((badge) => (
        <div key={badge.icon} className="flex flex-col items-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 text-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="h-6 w-6">
              {ICONS[badge.icon]}
            </svg>
          </span>
          <p className="font-serif text-sm text-ink">{badge.zh}</p>
          <p className="text-[11px] tracking-widest text-ink-soft">{badge.en}</p>
        </div>
      ))}
    </div>
  );
}
