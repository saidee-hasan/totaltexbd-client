import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://totalapparel.com"),
  title: "Total Apparel",
  description: "Total Apparel - Precision Garment Manufacturing",
  openGraph: {
    title: "Total Apparel",
    description: "Precision Garment Manufacturing",
    url: "https://totalapparel.com",
    siteName: "Total Apparel",
    images: [
      {
        url: "/images/garment_manufacturing.png",
        width: 1200,
        height: 630,
        alt: "Total Apparel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Total Apparel",
    description: "Precision Garment Manufacturing",
    images: ["/images/garment_manufacturing.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
