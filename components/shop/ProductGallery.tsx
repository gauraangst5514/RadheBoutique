"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; publicId: string }[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-surface rounded-lg flex items-center justify-center">
        <p className="text-ivory/40">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-surface rounded-lg overflow-hidden group cursor-zoom-in">
        <Image
          src={images[activeIndex].url}
          alt={`${name} - Image ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-bg/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-ivory">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.publicId}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                index === activeIndex
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-bg"
                  : "opacity-60 hover:opacity-100 border border-border hover:border-gold"
              }`}
            >
              <Image
                src={image.url}
                alt={`${name} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
