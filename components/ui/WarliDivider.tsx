/**
 * A decorative Warli-inspired divider: a row of stylised tribal "dancers"
 * (triangle bodies + circle heads) flanked by gold rules.
 * Purely decorative — hidden from screen readers.
 */
export default function WarliDivider({ className = "" }: { className?: string }) {
  const figures = Array.from({ length: 5 });

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-gold/60" />
      <div className="flex items-end gap-2 text-gold">
        {figures.map((_, i) => (
          <svg
            key={i}
            width="16"
            height="22"
            viewBox="0 0 16 22"
            fill="none"
            className={i % 2 === 0 ? "opacity-90" : "opacity-60 -scale-x-100"}
          >
            {/* head */}
            <circle cx="8" cy="3" r="2.4" fill="currentColor" />
            {/* body — two triangles (hourglass dancer) */}
            <path d="M8 6 L13 11 L3 11 Z" fill="currentColor" />
            <path d="M8 16 L13 11 L3 11 Z" fill="currentColor" />
            {/* arms */}
            <path d="M8 8 L1 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M8 8 L15 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* legs */}
            <path d="M8 16 L4 21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M8 16 L12 21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        ))}
      </div>
      <span className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
