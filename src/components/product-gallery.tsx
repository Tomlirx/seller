"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt, isSold = false }: { images: string[]; alt: string; isSold?: boolean }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-16 overflow-hidden border ${
                index === active ? "border-gold" : "border-line"
              }`}
            >
              <Image src={url} alt={`${alt} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="aspect-square flex-1 bg-stage overflow-hidden relative order-1 sm:order-2 shadow-[var(--shadow-product)]">
        {current ? (
          <>
            <Image src={current} alt={alt} fill className={`object-cover ${isSold ? "brightness-[0.55] grayscale-[0.5]" : ""}`} />
            {isSold && (
              <span className="absolute top-3 right-3 z-20 bg-canvas/90 text-gold text-[11px] tracking-[0.15em] px-3 py-1.5 border border-gold/40">
                已售 SOLD
              </span>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-stage-ink-soft text-sm">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
