/** Little jewellery drawings used in the playful motion pieces. Sized with font-size (1em). */
export const Jhumka = () => (
  <svg width="1em" height="1.3em" viewBox="0 0 40 52">
    <circle cx="20" cy="6" r="5" fill="#E9B949" stroke="#6B1026" strokeWidth="2" />
    <path d="M6 30 a14 14 0 0 1 28 0 z" fill="#E9B949" stroke="#6B1026" strokeWidth="2.5" />
    <path d="M20 11 v6" stroke="#6B1026" strokeWidth="2.5" />
    {[8, 14, 20, 26, 32].map((x) => (
      <circle key={x} cx={x} cy={36 + (x === 20 ? 4 : 0)} r="2.6" fill="#C81E63" stroke="#6B1026" strokeWidth="1.5" />
    ))}
  </svg>
);
export const Ring = () => (
  <svg width="1em" height="1em" viewBox="0 0 40 40">
    <circle cx="20" cy="24" r="12" fill="none" stroke="#E9B949" strokeWidth="5" />
    <circle cx="20" cy="24" r="12" fill="none" stroke="#6B1026" strokeWidth="1.5" />
    <path d="M14 10 l6 -7 l6 7 l-6 6 z" fill="#0E5A45" stroke="#6B1026" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const Necklace = () => (
  <svg width="1.2em" height="1em" viewBox="0 0 48 40">
    <path d="M4 4 q20 40 40 0" fill="none" stroke="#E9B949" strokeWidth="4" strokeLinecap="round" />
    <path d="M24 26 l6 6 l-6 8 l-6 -8 z" fill="#C81E63" stroke="#6B1026" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const Heart = () => (
  <svg width="1em" height="1em" viewBox="0 0 40 40">
    <path d="M20 35 C4 24 2 14 8 8 c5 -5 11 -3 12 3 c1 -6 7 -8 12 -3 c6 6 4 16 -12 27 z" fill="#C81E63" stroke="#6B1026" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);
export const Bangle = () => (
  <svg width="1em" height="1em" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#E9B949" strokeWidth="6" />
    <circle cx="20" cy="20" r="14" fill="none" stroke="#6B1026" strokeWidth="1.5" strokeDasharray="3 5" />
  </svg>
);
export const Bow = () => (
  <svg width="1.2em" height="1em" viewBox="0 0 48 40">
    <path d="M24 20 L6 8 Q2 20 6 32 Z M24 20 L42 8 Q46 20 42 32 Z" fill="#F6C9D6" stroke="#6B1026" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="24" cy="20" r="5" fill="#C81E63" stroke="#6B1026" strokeWidth="2" />
  </svg>
);
