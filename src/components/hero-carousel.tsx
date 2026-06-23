"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    image: "/marketing/lanyu-hero.jpg",
    eyebrow: "东方之美 · 心之所向",
    title: ["天然翡翠", "岚玉珍藏"],
    subtitle: "从珍藏到分享，岚玉陪伴您的每一段旅程。",
    ctaText: "探索藏品系列",
    ctaHref: "/collections",
  },
  {
    image: "/marketing/lanyu-hero-illustrated.svg",
    eyebrow: "匠心雕琢 · 方得圆满",
    title: ["玉不琢", "不成器"],
    subtitle: "每一件岚玉，皆经匠心雕琢而成。",
    ctaText: "了解品牌理念",
    ctaHref: "/collections",
  },
  {
    image: "/marketing/lanyu-guanyin.jpg",
    eyebrow: "慈悲护佑 · 平安吉祥",
    title: ["观音在心", "岁岁平安"],
    subtitle: "天然翡翠观音吊坠，愿你心安自在。",
    ctaText: "查看观音系列",
    ctaHref: "/collections/GUANYIN",
  },
  {
    image: "/marketing/lanyu-story.jpg",
    eyebrow: "从珍藏到分享",
    title: ["每一块玉石", "都有它的缘分"],
    subtitle: "希望每一块玉石，都能遇见属于自己的珍惜之人。",
    ctaText: "阅读品牌故事",
    ctaHref: "/collections",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title.join(" ")}
            fill
            priority={i === 0}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(44,43,41,0.35)_0%,rgba(44,43,41,0.05)_40%,rgba(44,43,41,0.05)_100%)]" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-start gap-4 px-6 sm:px-16 pt-28">
        <p className="text-xs tracking-[0.25em] text-ivory-light/90">{SLIDES[index].eyebrow}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-ivory-light leading-tight">
          {SLIDES[index].title[0]}
          <br />
          {SLIDES[index].title[1]}
        </h1>
        <p className="text-sm text-ivory-light/80 max-w-sm">{SLIDES[index].subtitle}</p>
        <Link
          href={SLIDES[index].ctaHref}
          className="mt-4 inline-flex w-fit items-center gap-2 border border-ivory-light text-ivory-light px-6 py-2 text-sm tracking-wide hover:bg-ivory-light hover:text-ink transition-colors"
        >
          {SLIDES[index].ctaText}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="absolute bottom-8 right-6 sm:right-16 z-10 flex items-center gap-4">
        <div className="flex gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-ivory-light" : "w-1.5 bg-ivory-light/40"
              }`}
            />
          ))}
        </div>
        <p className="text-xs tracking-widest text-ivory-light/90 font-serif">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
      </div>

      <div id="hero-end-sentinel" className="absolute bottom-0 h-px w-full" />
    </section>
  );
}
