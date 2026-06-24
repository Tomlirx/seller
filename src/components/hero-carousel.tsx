"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  eyebrow: string;
  title: [string, string];
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  theme: "dark" | "light";
  /** 图片本身已经把文字烧录进去了，暂时隐藏 HTML 文字层避免重叠；图片换成纯背景版后可移除此字段 */
  hasBakedText?: boolean;
};

const SLIDES: Slide[] = [
  {
    image: "/marketing/lanyu-pendant-rock.png",
    eyebrow: "LAN YU · 东方玉石艺术",
    title: ["Every Jade", "Has Its Own Destiny"],
    subtitle: "每一块玉石都有自己的生命轨迹。岚玉坚持天然玉石甄选，将东方审美与现代设计融合。",
    ctaText: "探索系列",
    ctaHref: "/collections",
    theme: "dark",
  },
  {
    image: "/marketing/lanyu-pendant-rock-alt.png",
    eyebrow: "匠心雕琢 · 方得圆满",
    title: ["玉不琢", "不成器"],
    subtitle: "每一件岚玉，皆经匠心雕琢而成，传承千年东方工艺。",
    ctaText: "查看佛公系列",
    ctaHref: "/collections/BUDDHA",
    theme: "dark",
  },
  {
    image: "/marketing/lanyu-guanyin.jpg",
    eyebrow: "慈悲护佑 · 平安吉祥",
    title: ["观音在心", "岁岁平安"],
    subtitle: "天然翡翠观音吊坠，愿你心安自在。",
    ctaText: "查看观音系列",
    ctaHref: "/collections/GUANYIN",
    theme: "dark",
  },
  {
    image: "/marketing/lanyu-story.jpg",
    eyebrow: "从珍藏到分享",
    title: ["每一块玉石", "都有它的缘分"],
    subtitle: "希望每一块玉石，都能遇见属于自己的珍惜之人。",
    ctaText: "查看更多藏品",
    ctaHref: "/collections/OTHER",
    theme: "dark",
  },
];

function SlideText({ slide, isLight }: { slide: Slide; isLight: boolean }) {
  return (
    <div className="max-w-[480px]">
      <p
        className={`font-serif text-xs tracking-[0.3em] mb-3 sm:mb-6 ${isLight ? "text-ivory-light/90" : "text-[#A08E7A]"}`}
      >
        {slide.eyebrow}
      </p>
      <h1
        className={`font-serif text-2xl sm:text-4xl lg:text-[3rem] font-light leading-[1.2] mb-3 sm:mb-7 ${isLight ? "text-ivory-light" : "text-ink"}`}
      >
        {slide.title[0]}
        <br />
        {slide.title[1]}
      </h1>
      <p
        className={`text-[13px] sm:text-base leading-[1.8] sm:leading-[2] mb-5 sm:mb-10 max-w-md ${isLight ? "text-ivory-light/80" : "text-ink-soft"}`}
      >
        {slide.subtitle}
      </p>
      <Link
        href={slide.ctaHref}
        className={`inline-flex items-center gap-3 border px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors duration-300 ${
          isLight
            ? "border-ivory-light text-ivory-light hover:bg-ivory-light hover:text-ink"
            : "border-[#D8C7B5] text-gold hover:bg-gold hover:text-white hover:border-gold"
        }`}
      >
        {slide.ctaText}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[index];
  const isLight = slide.theme === "light";

  return (
    <section className="relative w-full bg-ivory">
      <div className="relative aspect-[2/1] max-h-[80vh] w-full overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={s.image} alt={s.title.join(" ")} fill priority={i === 0} className="object-cover" />
            {s.theme === "light" && (
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(44,43,41,0.35)_0%,rgba(44,43,41,0.05)_40%,rgba(44,43,41,0.05)_100%)]" />
            )}
          </div>
        ))}

        {!slide.hasBakedText && (
          <div className="absolute inset-0 z-10 hidden sm:flex items-center pl-[7vw] pr-10">
            <SlideText slide={slide} isLight={isLight} />
          </div>
        )}
        {slide.hasBakedText && <Link href={slide.ctaHref} className="absolute inset-0 z-10" aria-label={slide.ctaText} />}

        <p
          className={`absolute right-6 sm:right-14 bottom-6 sm:bottom-10 z-10 font-serif text-2xl sm:text-4xl ${isLight ? "text-ivory-light/80" : "text-ink/70"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="absolute left-6 sm:left-14 bottom-6 sm:bottom-10 z-10 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? isLight
                    ? "w-6 bg-ivory-light"
                    : "w-6 bg-ink"
                  : isLight
                    ? "w-1.5 bg-ivory-light/40"
                    : "w-1.5 bg-ink/30"
              }`}
            />
          ))}
        </div>
      </div>

      {!slide.hasBakedText && (
        <div className="sm:hidden px-6 py-8">
          <SlideText slide={slide} isLight={false} />
        </div>
      )}
    </section>
  );
}
