"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  useEffectEvent,
} from "react";
import { publicImageSrc } from "@/lib/media";

function SingleImage({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const image = publicImageSrc(src);
  const isProxied = image.startsWith("/api/media");
  const className = `absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
    active ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
  } group-hover:scale-[1.04]`;

  if (isProxied) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={alt} className={className} />
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className={className}
    />
  );
}

/** Auto-rotates through project photos; pauses on hover / focus. */
export function ProjectPhotoRotator({
  images,
  alt,
  intervalMs = 4200,
}: {
  images: string[];
  alt: string;
  intervalMs?: number;
}) {
  const photos = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useEffectEvent(() => {
    setIndex((i) => (i + 1) % photos.length);
  });

  useEffect(() => {
    if (photos.length < 2 || paused) return;
    const id = window.setInterval(() => advance(), intervalMs);
    return () => window.clearInterval(id);
  }, [photos.length, paused, intervalMs]);

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  if (!photos.length) return null;

  if (photos.length === 1) {
    return <SingleImage src={photos[0]} alt={alt} active />;
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {photos.map((src, i) => (
        <SingleImage
          key={`${src}-${i}`}
          src={src}
          alt={i === index ? alt : ""}
          active={i === index}
        />
      ))}

      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show photo ${i + 1} of ${photos.length}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition ${
              i === index
                ? "w-5 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
