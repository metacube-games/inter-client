import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Link Wallet - Metacube",
  description: "Link your wallet to receive rewards from Metacube Games",
  keywords: [
    "wallet",
    "blockchain",
    "rewards",
    "metacube",
    "games",
    "starknet",
    "crypto",
  ],
  authors: [{ name: "Metacube Games" }],
  openGraph: {
    title: "Link Your Wallet - Metacube Games",
    description:
      "Connect your wallet and receive your rewards from Metacube Games",
    type: "website",
    siteName: "Metacube Games",
    locale: "en_US",
    images: [
      {
        url: "https://metacube.games/opengraph-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Metacube - Web3 Gaming Platform on Starknet",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Your Wallet - Metacube Games",
    description:
      "Connect your wallet and receive your rewards from Metacube Games",
    creator: "@metacubeGames",
    images: [
      {
        url: "https://metacube.games/opengraph-image.jpeg",
        alt: "Metacube Gaming Platform on Starknet",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10B981",
};

export default function LinkWalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="285204904976-ps77qml7rfllm9scd78fsqgik5tscbkn.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
