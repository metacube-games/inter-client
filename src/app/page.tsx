import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import { SocialIcon } from "react-social-icons";
import { Countdown } from "./components/Countdown";

export default function Home() {
  // Initialize state for days, hours, minutes, and seconds
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20 relative">
      <div className="absolute top-0 left-0 p-6">
        <Link href="https://metacube.games" passHref legacyBehavior>
          <a className="text-lg text-black-500 hover:text-gray-700 transition duration-150 ease-in-out">
            <span className="font-bold">&lt;</span> Back to Metacube
          </a>
        </Link>
      </div>
      <Image
        src="/metacube-black.png"
        alt="Metacube logo"
        width={80}
        height={80}
        className="mb-12 w-auto"
        priority
      ></Image>
      <Countdown />
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-xl mb-2 font-bold text-center">
          100 alpha NFTs will be hidden in the cubes!
        </h1>
        <h2 className="text-3xl font-bold">Join us</h2>
        <div className="flex flex-row space-y-0 space-x-24 p-0">
          <div className="flex flex-row space-y-0 space-x-24 p-0">
            <SocialIcon
              url="https://x.com/metacubeGames"
              bgColor="transparent"
              fgColor="#000000"
              style={{ height: 96, width: 96 }}
              className="transition-transform duration-300 opacity-90 hover:opacity-100 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              url="https://discord.gg/FGV6HkMbNj"
              bgColor="transparent"
              fgColor="#000000"
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

