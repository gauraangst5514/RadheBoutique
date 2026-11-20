import type { Product, ProductImage } from "@/lib/types";

/** Shows the product's best image: a cut-out on brand pink (studio look) if there is one, else the photo. */
export function pickImage(p: Pick<Product, "images">): ProductImage | null {
  return p.images.find((i) => i.kind === "cutout") ?? p.images.find((i) => i.kind === "photo") ?? p.images[0] ?? null;
}

export function ProductImg({ p, img, className = "" }: { p: Pick<Product, "images" | "name">; img?: ProductImage | null; className?: string }) {
  const image = img === undefined ? pickImage(p) : img;
  if (!image) {
    return (
      <div className={`placeholder-stripes flex items-center justify-center p-3 text-center text-sm font-bold text-[#3B1406] ${className}`}>
        Photo coming soon
      </div>
    );
  }
  if (image.kind === "cutout") {
    return (
      <div className={`flex items-center justify-center bg-blush ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.alt ?? p.name} className="size-[86%] object-contain drop-shadow-[0_18px_18px_rgba(90,15,46,.25)]" loading="lazy" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.url} alt={image.alt ?? p.name} className={className} loading="lazy" />;
}
