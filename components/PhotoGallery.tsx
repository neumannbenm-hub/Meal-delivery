"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  images: string[];
  altText: string;
}

export default function PhotoGallery({ images, altText }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
        <Image
          src={images[activeIndex]}
          alt={altText}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? "border-orange-500 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`${altText} photo ${i + 1}`}
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
