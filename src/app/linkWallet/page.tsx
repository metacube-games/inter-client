import React from "react";
import { LinkWallet } from "../components/NavigationBar/ModalContents/LinkWallet";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Your Wallet | Metacube - Web3 Gaming Platform",
  description:
    "Connect your Web3 wallet to Metacube and unlock exclusive features, digital asset ownership, and in-game rewards in our blockchain gaming ecosystem on Starknet.",
  keywords: [
    "Metacube wallet",
    "Web3 wallet connection",
    "Starknet gaming",
    "blockchain gaming wallet",
    "digital asset ownership",
    "gaming NFT wallet",
    "Metacube connect",
    "crypto gaming account",
    "Web3 gaming platform",
    "Starknet wallet",
  ],
  openGraph: {
    title: "Connect Your Wallet to Metacube Gaming Platform",
    description:
      "Link your Web3 wallet to access Metacube's gaming features, manage digital assets, and join our blockchain gaming community on Starknet.",
    images: [
      {
        url: "https://metacube.games/wallet-connect.png",
        width: 1200,
        height: 630,
        alt: "Metacube Wallet Connection Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect Your Wallet to Metacube Gaming",
    description:
      "Link your Web3 wallet to join Metacube's gaming ecosystem. Manage assets and unlock exclusive features on Starknet.",
    images: [
      {
        url: "https://metacube.games/wallet-connect.png",
        alt: "Metacube Web3 Wallet Connection",
      },
    ],
  },
};

export default function LinkWalletPage() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-between">
        {/* Background Image/Video with preload for better performance */}
        <div className="absolute inset-0 bg-black" />

        {/* Header with improved accessibility */}
        <header className="relative z-10 w-full">
          <nav
            className="flex justify-between items-center p-6 pb-2"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              passHref
              legacyBehavior
              aria-label="Back to Metacube homepage"
            >
              <a className="text-white text-lg hover:text-gray-300 transition duration-150 ease-in-out">
                <span className="font-bold text-white">&lt;</span> Back to
                Metacube
              </a>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="https://metacube.games"
                className="text-white hover:text-green-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black rounded-md p-2"
                aria-label="Go to homepage"
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Homepage
                </span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main content section with ID for skip link */}
        <section
          id="main-content"
          className="relative z-10 bg-black bg-opacity-80 text-green-400 p-2 py-4 sm:py-8 sm:p-8 rounded-lg border border-green-400 max-w-3xl mx-auto my-12 md:my-24 shadow-lg shadow-green-900/20 w-[95%] md:w-auto"
          aria-labelledby="wallet-linking-title"
        >
          <div className="flex items-center justify-center mb-8">
            <h1
              id="wallet-linking-title"
              className="text-2xl md:text-3xl font-bold text-green-400"
            >
              Link Your Wallet
            </h1>
          </div>

          <div className="overflow-auto stable-scrollbar">
            <LinkWallet />
          </div>
        </section>

        {/* Footer with improved structure and accessibility */}
        <footer className="relative z-10 w-full text-center text-white p-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} Metacube Games. All rights reserved.
            </p>
            <div className="mt-2 text-xs opacity-50">
              <a
                href="https://metacube.games/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors underline"
                aria-label="View our Privacy Policy"
              >
                Privacy Policy
              </a>
              <span className="mx-2">|</span>
              <a
                href="https://metacube.games/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors underline"
                aria-label="View our Terms of Service"
              >
                Terms of Service
              </a>
            </div>
            <p className="mt-2 text-xs opacity-50">
              Built on{" "}
              <a
                href="https://starknet.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-400 transition-colors"
              >
                StarkNet
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* SEO Content */}
      <div className="w-full bg-black py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-white/80 text-sm text-center">
          <p className="mb-3">
            Connect your Web3 wallet to unlock the full potential of
            Metacube&apos;s gaming ecosystem. Our secure wallet linking system
            ensures seamless integration with our platform and future gaming
            experiences on the StarkNet blockchain.
          </p>
          <p className="mb-3">
            By linking your wallet, you gain access to exclusive features,
            including digital asset ownership, in-game rewards, and
            participation in our growing gaming community. Experience the power
            of decentralized gaming with enhanced security and true ownership of
            your gaming assets.
          </p>
          <p>
            Join thousands of players who have already connected their wallets
            to Metacube, becoming part of the next generation of blockchain
            gaming. Your journey into Web3 gaming starts here, with a simple and
            secure wallet connection.
          </p>
        </div>
      </div>
    </>
  );
}
