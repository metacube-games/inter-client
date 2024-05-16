import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://play.metacube.games"),
  title: "Metacube | Free2Play on Starknet",
  description:
    "Metacube is a Massive Multiplayer Free2Play Event game on Starknet. Compete with thousands of players, own the assets you collect, and conquer the Metacube.",
  openGraph: {
    images: [
      {
        url: "https://metacube.games/metadata-image.jpeg",
        width: 800,
        height: 600,
        alt: "Metacube Free2Play Event on Starknet",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://metacube.games/metadata-image.jpeg",
        alt: "Metacube Free2Play Event on Starknet",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Metacube Game - Play for free, collect your assets on Starknet</title>
        <meta name="description" content="Play for free, collect your assets on Starknet with Metacube Game. Start your adventure today!" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="keywords" content="Metacube Game, Starknet gaming, collect digital assets, blockchain game, free to play, NFT, NFT game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
