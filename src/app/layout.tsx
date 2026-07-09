import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC, Noto_Sans_SC, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { BackToTop } from "@/components/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "岚玉 LAN YU",
    template: "%s · 岚玉 LAN YU",
  },
  description: "天然翡翠 · 精选藏品 — Natural jadeite, curated from a private collection.",
  openGraph: {
    siteName: "岚玉 LAN YU",
    locale: "zh_CN",
    type: "website",
    images: ["/marketing/lanyu-moongate.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} ${notoSansSC.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink font-sans pb-16 sm:pb-0">
        <Providers>
          <Nav />
          {children}
          <Footer />
          <MobileBottomNav />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
