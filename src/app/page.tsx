"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/x";
import "react-social-icons/discord";

export default function Home() {
  // Initialize state for days, hours, minutes, and seconds
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    // Function to update the time left
    const updateTimer = () => {
      const nowTimeStamp = new Date().getTime();
      // Set the target date and time: 10th of February 2024, 5pm UTC
      const targetDate = new Date(Date.UTC(2024, 1, 10, 17, 0, 0));
      const targetFinishDate = new Date(Date.UTC(2024, 1, 10, 17, 30, 0));

      const targetTimeStamp = targetDate.getTime();
      const difference = targetTimeStamp - nowTimeStamp;
      const endedTime = targetFinishDate.getTime() - nowTimeStamp;

      // Calculate time left if the difference is positive
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
        setEnded(false);
      } else if (endedTime < 0) {
        setEnded(true);
      } else {
        // If the target date has passed, set all values to zero
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        window.location.reload();
      }
    };

    // Update timer immediately and every second
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
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
        width={100}
        height={100}
        className="mb-16"
      ></Image>
      <div className="text-center">
        {ended ? (
          <h1 className="text-4xl font-bold mb-4 mx-auto">
            Alpha test just finished, follow us on our socials to stay updated
            for the next event!
          </h1>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4 mx-auto">
              Get Ready to Play
            </h1>

            <div className="text-2xl">
              <span>{timeLeft.days} Days </span>
              <span>{timeLeft.hours} Hours </span>
              <span>{timeLeft.minutes} Minutes </span>
              <span>{timeLeft.seconds} Seconds</span>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center mt-16 ">
        <h1 className="text-3xl font-bold">Join us</h1>
        <div className="flex flex-row space-y-0 space-x-0 space-x-24 p-0">
          <div className="flex flex-row space-y-0 space-x-0 space-x-24 p-0">
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
