"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    image: "/marketing/lanyu-pendant-rock.png",
    eyebrow: "LAN YU · 东方玉石艺术",
    title: ["Every Jade", "Has Its Own Destiny"],
    subtitle: "每一块玉石都有自己的生命轨迹。岚玉坚持天然玉石甄选，将东方审美与现代设计融合。",
    ctaText: "探索系列",
    ctaHref: "/collections",
  },
  {
    image: "/marketing/lanyu-pendant-rock-alt.png",
    eyebrow: "匠心雕琢 · 方得圆满",
    title: ["玉不琢", "不成器"],
    subtitle: "每一件岚玉，皆经匠心雕琢而成，传承千年东方工艺。",
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

  const slide = SLIDES[index];

  return (
    <section className="relative grid sm:grid-cols-[42%_58%] min-h-[600px] sm:min-h-[calc(100vh-86px)] bg-ivory">
      <div className="flex items-center px-6 sm:pl-[7vw] sm:pr-10 py-16 sm:py-0 order-2 sm:order-1">
        <div className="max-w-[520px]">
          <p className="font-serif text-xs tracking-[0.3em] text-[#A08E7A] mb-6">{slide.eyebrow}</p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.6rem] font-light leading-[1.2] text-ink mb-7">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="text-[15px] sm:text-base leading-[2] text-ink-soft mb-10 max-w-md">{slide.subtitle}</p>
          <Link
            href={slide.ctaHref}
            className="inline-flex items-center gap-3 border border-[#D8C7B5] text-gold px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-white hover:border-gold transition-colors duration-300"
          >
            {slide.ctaText}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden order-1 sm:order-2 h-[50vh] sm:h-auto">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={s.image} alt={s.title.join(" ")} fill priority={i === 0} className="object-cover" />
          </div>
        ))}
        <p className="absolute right-6 sm:right-14 bottom-6 sm:bottom-16 font-serif text-3xl sm:text-5xl text-gold/80">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="absolute left-6 sm:left-14 bottom-6 sm:bottom-16 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
