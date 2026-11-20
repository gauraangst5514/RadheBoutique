/** A one-time burst of confetti and little hearts falling from the top, for the order confirmation page. */
export function Confetti() {
  const colours = ["#C81E63", "#E9B949", "#F28C28", "#F6C9D6", "#6B1026", "#0E5A45"];
  const bits = Array.from({ length: 36 }, (_, k) => ({
    left: `${(k * 37) % 100}%`,
    delay: `${(k % 9) * 0.12}s`,
    dur: `${2.6 + (k % 5) * 0.35}s`,
    drift: `${((k % 7) - 3) * 22}px`,
    colour: colours[k % colours.length],
    heart: k % 6 === 0,
    w: 6 + (k % 3) * 3,
  }));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((b, k) => (
        <span
          key={k}
          className="confetti absolute -top-6 block"
          style={{ left: b.left, animationDelay: b.delay, animationDuration: b.dur, ["--drift" as string]: b.drift, color: b.colour }}
        >
          {b.heart ? (
            <span className="text-[18px] leading-none">♥</span>
          ) : (
            <span className="block rounded-[2px]" style={{ width: b.w, height: b.w * 1.6, background: b.colour }} />
          )}
        </span>
      ))}
    </div>
  );
}
