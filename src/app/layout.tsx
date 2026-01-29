import type { Metadata } from "next";
import { Inter, Patrick_Hand_SC } from "next/font/google";
import "../sass/main.scss";

const sansSerif = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const serif = Patrick_Hand_SC({
  variable: "--font-patrick-hand-sc",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ein mal eins",
  description: "Das große 1x1 - Dein persönliches Training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body suppressHydrationWarning className={`${sansSerif.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
