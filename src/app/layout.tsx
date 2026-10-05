import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lyriahealth.co.uk"),
  title: "Lyria — Healthcare before you need it",
  description:
    "A UK healthcare membership offering fast private GP consultations and tiered biomarker blood-test screening. Join the waitlist — launching once CQC registration is confirmed.",
  keywords: [
    "Lyria Health",
    "private GP UK",
    "healthcare membership",
    "biomarker screening",
    "blood test membership",
  ],
  openGraph: {
    title: "Lyria — Healthcare before you need it",
    description:
      "Fast GP consultations and biomarker screening, in one membership. Join the waitlist.",
    url: "https://lyriahealth.co.uk",
    siteName: "Lyria",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Lyria — Healthcare before you need it",
    description:
      "Fast GP consultations and biomarker screening, in one membership. Join the waitlist.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1b2c47",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} font-sans flex min-h-screen flex-col antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
