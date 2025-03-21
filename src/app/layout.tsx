import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Enhanced Metadata for SEO and Social Sharing
export const metadata: Metadata = {
  metadataBase: new URL("https://play.metacube.games"),
  title: {
    default: "Metacube | Revolutionary Web3 Gaming Platform on Starknet",
    template: "%s | Metacube Gaming",
  },
  description:
    "Experience the future of gaming with Metacube on Starknet. Join our Web3 gaming platform featuring digital asset ownership, competitive gameplay, and blockchain integration.",
  keywords: [
    "Metacube",
    "Web3 gaming",
    "Starknet blockchain",
    "blockchain gaming platform",
    "digital asset ownership",
    "NFT gaming",
    "competitive blockchain games",
    "play-to-own",
    "Web3 game platform",
    "Starknet dApp",
    "crypto gaming",
    "blockchain entertainment",
  ],
  authors: [{ name: "Clashware Sàrl", url: "https://metacube.games" }],
  creator: "Clashware Sàrl",
  publisher: "Metacube Games",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Metacube | Revolutionary Web3 Gaming Platform",
    description:
      "Join Metacube's Web3 gaming revolution on Starknet. Experience true digital asset ownership, competitive gameplay, and the future of blockchain gaming.",
    url: "https://play.metacube.games",
    siteName: "Metacube Gaming",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://metacube.games/opengraph-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Metacube - Web3 Gaming Platform on Starknet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metacube | Web3 Gaming Revolution",
    description:
      "Step into the future of gaming with Metacube on Starknet. Experience true digital asset ownership and competitive blockchain gaming.",
    creator: "@MetacubeGames",
    site: "@MetacubeGames",
    images: [
      {
        url: "https://metacube.games/opengraph-image.jpeg",
        alt: "Metacube Gaming Platform on Starknet",
      },
    ],
  },
  alternates: {
    canonical: "https://play.metacube.games",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

// add tab icon

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="custom-scrollbar">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect to Google OAuth for faster login */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link
          rel="preconnect"
          href="https://accounts.google.com"
          crossOrigin="anonymous"
        />

        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://play.metacube.games/#website",
                  url: "https://play.metacube.games",
                  name: "Metacube Gaming",
                  description: "Revolutionary Web3 Gaming Platform on Starknet",
                  publisher: {
                    "@type": "Organization",
                    name: "Metacube Games",
                    url: "https://metacube.games",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://metacube.games/logo.png",
                    },
                    sameAs: [
                      "https://twitter.com/MetacubeGames",
                      "https://discord.gg/FGV6HkMbNj",
                    ],
                  },
                },
                {
                  "@type": "VideoGame",
                  name: "Metacube",
                  description:
                    "A revolutionary Web3 gaming platform on Starknet featuring true digital asset ownership and competitive gameplay.",
                  genre: ["Blockchain", "Web3", "Competitive"],
                  gamePlatform: ["Web Browser", "Starknet"],
                  url: "https://play.metacube.games",
                  applicationCategory: "Game",
                  operatingSystem: "Web Browser",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Metacube Games",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <GoogleOAuthProvider clientId="285204904976-ps77qml7rfllm9scd78fsqgik5tscbkn.apps.googleusercontent.com">
        <body className={inter.className}>{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}
