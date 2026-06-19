import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snap — Know what it's worth",
  description:
    "Snap a photo of damage or wear. Get a fair value and a sharable report in 20 seconds. Built for Airbnb hosts, drivers, marketplace traders, renters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=supreme@300,400,500,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
