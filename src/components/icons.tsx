type P = { size?: number; className?: string };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const ArrowLeft = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M15 5l-7 7 7 7" /></svg>
);
export const ArrowRight = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M9 5l7 7-7 7" /></svg>
);
export const ArrowRightSmall = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={2.6}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const SpinIcon = ({ size = 16 }: P) => (
  <svg {...base(size)} strokeWidth={2.2}><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></svg>
);
export const CartIcon = ({ size = 21 }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const SearchIcon = ({ size = 21 }: P) => (
  <svg {...base(size)} strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const MenuIcon = ({ size = 22 }: P) => (
  <svg {...base(size)} strokeWidth={2.2}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const CloseIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2.4}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const TryOnIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="11" r="3.5" /><path d="M7.5 18c1-2 2.6-3 4.5-3s3.5 1 4.5 3" /></svg>
);
export const CameraIcon = ({ size = 22 }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
export const PlayIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l13 8-13 8z" /></svg>
);
export const TrashIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
);
