"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
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
              className={`relative h-16 w-16 rounded overflow-hidden border ${
                index === active ? "border-gold" : "border-line"
              }`}
            >
              <Image src={url} alt={`${alt} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="aspect-square flex-1 bg-ivory-light border border-line rounded overflow-hidden relative order-1 sm:order-2">
        {current ? (
          <Image src={current} alt={alt} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink-soft text-sm">
            No image
          </div>
        )}
      </div>
    </div>
  );
}
