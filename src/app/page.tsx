"use client";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { Countdown } from "./components/Countdown";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { useState } from "react";
import { LegalLinks } from "./components/legals";

// Social links array for easy mapping
const socialLinks = [
  "https://x.com/metacubeGames",
  "https://discord.gg/FGV6HkMbNj",
];

const SocialLink = ({ url }: { url: string }) => (
  <SocialIcon
    url={url}
    style={{ width: 96, height: 96 }}
    bgColor="transparent"
    fgColor="whitesmoke"
    className="
      transition-transform duration-300
      opacity-90 hover:opacity-100
      hover:scale-105
      m-[5px] -mt-[25px] -mb-[5px] p-0
    "
    target="_blank"
    rel="noopener noreferrer"
  />
);

export default function Home() {
  const [ended, setEnded] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-20">
      {/* Navigation Bar & Legal Links */}
      <NavigationBar />
      <LegalLinks />

      {/* Background Video/Image */}
      {ended ? (
        <div className="absolute inset-0 w-full h-full brightness-90">
          <Image
            src="/stoveArmy.jpg"
            fill
            alt="Stove army spaceship"
            className="object-cover opacity-90 blur-xs brightness-50"
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full brightness-75">
          <video
            src="/Trim.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover opacity-75 brightness-75"
          />
        </div>
      )}

      {/* Main Heading Section (with blurred backdrop) */}
      <div className="z-10 text-center mt-[40px] mb-[-40px] select-none">
        <div className="relative inline-block px-4 py-2 bg-black/40 backdrop-blur-sm rounded-md">
          <h1
            className={`
              text-xl sm:text-2xl md:text-3xl
              font-extrabold italic tracking-wide
              bg-clip-text text-transparent
              bg-gradient-to-r from-green-400 to-green-500
              drop-shadow-md
              shadow-emerald-200
              transition-all duration-500
              ${!ended ? "  hover:drop-shadow-xl  animate-pulse" : ""}
            `}
          >
            {ended ? (
              <>
                <strong>The Stove Army</strong> will be back <em>stronger</em>{" "}
                and <em>bigger</em> soon!
              </>
            ) : (
              <>
                The Stove Army spaceship is <strong>coming!</strong>
              </>
            )}
          </h1>
        </div>
      </div>

      {/* Logo */}
      <Image
        src="/metacube.svg"
        alt="Metacube logo"
        width={80}
        height={80}
        priority
        className="
        mt-8  mb-4 w-auto z-10
          filter drop-shadow-lg
        "
        style={{
          filter: "drop-shadow(0 0 12px #0ec630)",
        }}
      />

      {/* Countdown */}
      <Countdown ended={ended} setEnded={setEnded} />

      {/* Extra spacing between Countdown & Join Us */}
      <div className="mb-12" />

      {/* Footer: Join Us */}
      <div className="absolute bottom-4 flex flex-col items-center z-10">
        <h2
          className="
            text-xl sm:text-3xl font-extrabold italic
            text-white mb-4 tracking-widest uppercase
             transition-colors duration-300
          "
        >
          Join Us
        </h2>
        <div className="flex space-x-24">
          {socialLinks.map((url) => (
            <SocialLink key={url} url={url} />
          ))}
        </div>
      </div>
    </main>
  );
}
