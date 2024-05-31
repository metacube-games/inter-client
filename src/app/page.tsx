"use client";
import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { Countdown } from "./components/Countdown";
import { useState } from "react";

export default function Home() {
  const [ended, setEnded] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20 relative">
      {ended ? (
        <>
          <div className="absolute w-full h-full object-cover circular-landscape">
            <Image
              src={"/stoveArmy.jpg"}
              className="absolute w-full h-full object-cover opacity-90 "
              style={{ filter: "blur(2px) brightness(0.5)" }}
              alt="Stove army spaceship"
            />
          </div>

          <div className="absolute top-0 left-0 p-6">
            <Link href="https://metacube.games" passHref legacyBehavior>
              <a className="text-white text-lg text-black-500 hover:text-gray-300 transition duration-150 ease-in-out">
                <span className="font-bold text-white">&lt;</span> Back to Metacube
              </a>
            </Link>
          </div>
          <div className="w-screen flex flex-col items-center z-10 text-center mb-10 top-0">
            <h1 className="text-2xl font-bold mb-0 mx-auto text-white ">
              The Stove army will be back stronger and bigger soon!
            </h1>
          </div>
        </>
      ) : (
        <>
          <div className="absolute w-full h-full object-cover circular-landscape">
            <video
              src={"/Trim.mp4"}
              autoPlay
              muted
              loop
              playsInline
              className="absolute w-full h-full object-cover opacity-75"
            />
          </div>

          <div className="absolute top-0 left-0 p-6">
            <Link href="https://metacube.games" passHref legacyBehavior>
              <a className="text-white text-lg text-black-500 hover:text-gray-300 transition duration-150 ease-in-out">
                <span className="font-bold text-white">&lt;</span> Back to Metacube
              </a>
            </Link>
          </div>
          <div className="w-screen flex flex-col items-center z-10 text-center mb-10 top-0">
            <h1 className="text-2xl font-bold mb-0 mx-auto text-white ">
              The Stove army spaceship is coming!
            </h1>
          </div>
        </>
      )}
      <Image
        src="/metacube.svg"
        alt="Metacube logo"
        width={80}
        height={80}
        style={{
          filter: "drop-shadow(0 0 12px #0ec630)",
          margin: "0px",
          padding: "0px",
          top: "0px",
        }}
        className="mb-12 w-auto z-10 box  "
        priority
      ></Image>
      <Countdown ended={ended} setEnded={setEnded} />
      <div className="absolute flex flex-col items-center bottom-2 ">
        <h2 className="text-3xl font-bold text-white">Join us</h2>
        <div className="flex flex-row space-y-0 space-x-24 p-0">
          <div className="flex flex-row space-y-0 space-x-24 p-0">
            <SocialIcon
              url="https://x.com/metacubeGames"
              bgColor="transparent"
              fgColor="whitesmoke"
              style={{ height: 96, width: 96 }}
              className="transition-transform duration-300 opacity-90 hover:opacity-100 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              url="https://discord.gg/FGV6HkMbNj"
              bgColor="transparent"
              fgColor="whitesmoke"
              style={{ height: 96, width: 96 }}
              className="transition-transform duration-300 opacity-90 hover:opacity-100 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
