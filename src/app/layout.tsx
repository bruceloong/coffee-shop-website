import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroImage from "@/assets/images/hero-bg.jpg";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://coffee.mengyadiary.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brew Haven · 精品咖啡烘焙坊",
    template: "%s · Brew Haven",
  },
  description:
    "Brew Haven 精品咖啡烘焙坊——源自 2018 年的手冲与意式咖啡体验，精选全球单一产区咖啡豆，搭配手工烘焙甜点。",
  keywords: ["精品咖啡", "手冲咖啡", "咖啡烘焙", "咖啡店", "Brew Haven", "意式浓缩"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "Brew Haven",
    title: "Brew Haven · 精品咖啡烘焙坊",
    description:
      "源自 2018 年的手冲与意式咖啡体验，精选全球单一产区咖啡豆，搭配手工烘焙甜点。",
    images: [{ url: HeroImage.src, width: 1600, height: 900, alt: "Brew Haven 门店" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brew Haven · 精品咖啡烘焙坊",
    description: "源自 2018 年的手冲与意式咖啡体验。",
    images: [HeroImage.src],
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#171009" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Brew Haven",
  url: SITE_URL,
  image: HeroImage.src,
  telephone: "+86-10-8888-7777",
  priceRange: "¥¥",
  address: {
    "@type": "PostalAddress",
    streetAddress: "三里屯太古里北区 N3-101",
    addressLocality: "北京市",
    addressCountry: "CN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 39.9368, longitude: 116.4472 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "23:00",
    },
  ],
  servesCuisine: ["Coffee", "Dessert"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${fraunces.variable} ${notoSansSC.variable} ${notoSerifSC.variable} antialiased`}
      >
        {/* JSON-LD 结构化数据（内容为本地静态对象，无用户输入） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
