"use client";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { Countdown } from "./components/Countdown";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { useState } from "react";
import { LegalLinks } from "./components/legals";

const SocialLink = ({ url }: { url: string }) => (
  <SocialIcon
    url={url}
    bgColor="transparent"
    fgColor="whitesmoke"
    className="transition-transform duration-300 opacity-90 hover:opacity-100 hover:scale-105"
    style={{
      height: 96,
      width: 96,
      margin: "5px",
      marginTop: "-25px",
      marginBottom: "-5px",
      padding: "0px",
    }} // Increased size here
    target="_blank"
    rel="noopener noreferrer"
  />
);

export default function Home() {
  const [ended, setEnded] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20 relative">
      <NavigationBar />
      <LegalLinks />
      {ended ? (
        <div className="absolute inset-0 w-full h-full object-cover circular-landscape">
          <Image
            src="/stoveArmy.jpg"
            fill
            className="object-cover opacity-90 blur-sm brightness-50"
            alt="Stove army spaceship"
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full object-cover circular-landscape brightness-75">
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

      <div className="z-10 text-center mb-10">
        <h1 className="text-xl  sm:text-2xl md:text-3xl font-bold mb-0 text-white">
          {ended
            ? "The Stove army will be back stronger and bigger soon!"
            : "The Stove army spaceship is coming!"}
        </h1>
      </div>

      <Image
        src="/metacube.svg"
        alt="Metacube logo"
        width={80}
        height={80}
        className="mb-12 w-auto z-10 filter drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 12px #0ec630)" }}
        priority
      />

      <Countdown ended={ended} setEnded={setEnded} />

      <div className="absolute bottom-2 flex flex-col items-center">
        <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
          Join us
        </h2>
        <div className="flex space-x-24 ">
          <SocialLink url="https://x.com/metacubeGames" />
          <SocialLink url="https://discord.gg/FGV6HkMbNj" />
        </div>
      </div>
    </main>
  );
}
