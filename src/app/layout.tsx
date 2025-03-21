import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Enhanced Metadata for SEO and Social Sharing
export const metadata: Metadata = {
  metadataBase: new URL("https://play.metacube.games"),
  title: "Metacube Play | Free-to-Play Blockchain Game Countdown - Starknet",
  description:
    "Join the countdown to Metacube’s launch on Starknet! Log in to view your assets and prepare for the ultimate free-to-play blockchain gaming experience.",
  keywords: [
    "Metacube",
    "Starknet blockchain",
    "free-to-play game",
    "blockchain gaming",
    "NFT assets",
    "multiplayer blockchain game",
    "Metacube countdown",
    "digital collectibles",
    "crypto gaming",
    "Starknet NFT",
  ],
  authors: [{ name: "Clashware Sàrl", url: "https://metacube.games" }],
  creator: "Clashware Sàrl",
  publisher: "Metacube Games",
  robots: "index, follow",
  openGraph: {
    title: "Metacube Play | Free-to-Play Blockchain Game Countdown",
    description:
      "Get ready for Metacube: a free-to-play multiplayer blockchain game on Starknet. Log in, check your assets, and join the launch countdown!",
    url: "https://play.metacube.games",
    siteName: "Metacube",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://metacube.games/metadata-image.png",
        width: 1200,
        height: 630,
        alt: "Metacube Countdown - Free-to-Play Blockchain Game on Starknet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metacube Play | Free-to-Play Blockchain Game Countdown",
    description:
      "Countdown to Metacube’s launch on Starknet! Log in to see your assets and join the free-to-play blockchain gaming revolution.",
    creator: "@MetacubeGames",
    images: [
      {
        url: "https://metacube.games/metadata-image.png",
        alt: "Metacube Launch Countdown on Starknet",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="custom-scrollbar">
      <head>
        {/* Preconnect to Google OAuth for faster login */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        {/* Structured Data for Game and Countdown */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "VideoGame",
                name: "Metacube",
                description:
                  "Metacube is a free-to-play multiplayer blockchain game on Starknet. Log in to view your assets and join the countdown to launch!",
                genre: ["Blockchain", "Free-to-Play", "Multiplayer"],
                gamePlatform: "Starknet",
                url: "https://play.metacube.games",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  availability: "https://schema.org/PreOrder",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Event",
                name: "Metacube Game Launch Countdown",
                description:
                  "Countdown to the launch of Metacube, a free-to-play blockchain game on Starknet.",
                url: "https://play.metacube.games",
                startDate: "2025-03-15T00:00:00Z", // Replace with actual launch date
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode:
                  "https://schema.org/OnlineEventAttendanceMode",
                organizer: {
                  "@type": "Organization",
                  name: "Metacube Games",
                  url: "https://metacube.games",
                },
              },
            ]),
          }}
        />
      </head>
      <GoogleOAuthProvider clientId="285204904976-ps77qml7rfllm9scd78fsqgik5tscbkn.apps.googleusercontent.com">
        <body className={inter.className}>{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}
