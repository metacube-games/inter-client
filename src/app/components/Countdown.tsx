"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useModalStore } from "../store/connexionModalStore";

const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
  <div className="inline-block mb-2 sm:mb-0 sm:mx-2">
    <span className="font-bold text-2xl sm:text-3xl">{value}</span>{" "}
    <span className="text-lg sm:text-2xl">{unit}</span>
  </div>
);

export const Countdown = ({
  ended,
  setEnded,
}: {
  ended: boolean;
  setEnded: (arg0: boolean) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  useEffect(() => {
    const targetDate = new Date(Date.UTC(2024, 7, 3, 16, 0, 0));
    const targetFinishDate = new Date(Date.UTC(2024, 7, 4, 0, 0, 0));

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;
      const endedTime = targetFinishDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setEnded(false);
      } else if (endedTime < 0) {
        setEnded(true);
      } else {
        // window.location.reload();
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [setEnded]);

  if (ended) {
    return (
      <div className="text-center  mx-auto z-10 text-white mb-16 -mt-20  bg-gray-950 rounded-xl  p-4 bg-opacity-70 w-fit ">
        <h1 className="text-lg sm:text-2xl font-bold mb-6">
          Beta test complete. Follow our socials for final event updates!
        </h1>
        <h2 className="text-lg sm:text-xl text-white">
          <span className="font-extrabold  text-green-400 ">Won Assets?:</span>{" "}
          Check wallet in some hours... Trade on{" "}
          <Link
            href="https://element.market/collections/metacube-passcards?search[toggles][0]=ALL"
            passHref
          >
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold  py-1 px-2 rounded transition duration-300">
              Element
            </button>
          </Link>
        </h2>
        <h2 className="text-lg sm:text-xl  text-white mt-4">
          <span className="font-extrabold text-green-400  ">
            Google account user?:
          </span>{" "}
          Link a wallet to receive your rewards{" "}
          <button
            onClick={() => setActiveModal("Link Wallet")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded transition duration-300"
          >
            Link wallet
          </button>
        </h2>
      </div>
    );
  }

  return (
    <div className="text-center w-4/5 mx-auto z-10 text-white mb-16 -mt-20">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">Beta starts in</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <TimeUnit key={unit} value={value} unit={unit} />
        ))}
      </div>
      {/* <p className="text-lg sm:text-xl mt-10 font-bold">
        2500 beta Assets will be hidden in the cubes!
      </p> */}
    </div>
  );
};
