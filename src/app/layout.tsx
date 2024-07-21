import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://play.metacube.games"),
  title: "Metacube | Free-to-Play Blockchain Game on Starknet",
  description:
    "Compete in Metacube, a massive multiplayer Free-to-Play event game on Starknet. Collect assets and conquer the Metacube universe.",
  openGraph: {
    title: "Metacube | Free-to-Play Blockchain Game on Starknet",
    description:
      "Compete, collect, and conquer in Metacube - the ultimate Free-to-Play blockchain game on Starknet.",
    url: "https://play.metacube.games",
    siteName: "Metacube",
    images: [
      {
        url: "https://play.metacube.games/opengraph-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Metacube Game - Free-to-Play on Starknet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metacube | Free-to-Play Blockchain Game on Starknet",
    description:
      "Compete, collect, and conquer in Metacube - the ultimate Free-to-Play blockchain game on Starknet.",
    images: [
      {
        url: "https://play.metacube.games/twitter-image.jpeg",
        alt: "Metacube Game - Free-to-Play on Starknet",
      },
    ],
  },
  keywords: [
    "Metacube",
    "Starknet",
    "blockchain game",
    "free-to-play",
    "NFT",
    "digital assets",
    "multiplayer",
  ],
  alternates: {
    canonical: "https://play.metacube.games",
    languages: {
      "en-US": "https://play.metacube.games",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              name: "Metacube",
              description:
                "A massive multiplayer Free-to-Play event game on Starknet",
              genre: ["Blockchain", "Free-to-Play", "Multiplayer"],
              gamePlatform: "Starknet",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              url: "https://play.metacube.games",
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
