"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export const Countdown = ({ ended, setEnded }: { ended: boolean, setEnded: (arg0: boolean) => void }) => {
  const secondsRef = useRef<HTMLSpanElement>(null);
  const minutesRef = useRef<HTMLSpanElement>(null);
  const hoursRef = useRef<HTMLSpanElement>(null);
  const daysRef = useRef<HTMLSpanElement>(null);
  // const [ended, setEnded] = useState(false);

  useEffect(() => {
    // Function to update the time left
    const updateTimer = () => {
      if (!secondsRef.current) return;
      if (!minutesRef.current) return;
      if (!hoursRef.current) return;
      if (!daysRef.current) return;

      const nowTimeStamp = new Date().getTime();
      // Set the target date and time: 10th of February 2024, 5pm UTC
      const targetDate = new Date(Date.UTC(2024, 5, 1, 16, 0, 0));
      const targetFinishDate = new Date(Date.UTC(2024, 5, 2, 1, 0, 0));

      const targetTimeStamp = targetDate.getTime();
      const difference = targetTimeStamp - nowTimeStamp;
      const endedTime = targetFinishDate.getTime() - nowTimeStamp;

      // Calculate time left if the difference is positive
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // if (secondsLeft.current)
        secondsRef.current.innerText = `${seconds} Seconds `;
        minutesRef.current.innerText = `${minutes} Minutes `;
        hoursRef.current.innerText = `${hours} Hours `;
        daysRef.current.innerText = `${days} Days `;
        setEnded(false);
      } else if (endedTime < 0) {
        setEnded(true);
      } else {
        // If the target date has passed, set all values to zero
        window.location.reload();
        secondsRef.current.innerText = `0 Seconds `;
        minutesRef.current.innerText = `0 Minutes `;
        hoursRef.current.innerText = `0 Hours `;
        daysRef.current.innerText = `0 Days `;
      }
    };
    // Update timer immediately and every second
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center w-auto z-10 text-white mb-16" style={{ width: '80vw' }}>
      {ended ? (
        <>
          <h1 className="text-4xl font-bold mb-4 mx-auto">
            Beta test just finished, follow us on our socials to stay updated for
            the next event!
          </h1>
          <h2 className="text-2xl font-bold mb-0 mx-auto text-green-400  ">
            If you won NFTs, they should appear soon in your wallet and you will be able to trade them on {" "}
            <Link href="https://element.market/collections/metacube-passcards?search[toggles][0]=ALL" passHref={true}>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                Element
              </button>
            </Link>
          </h2>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4 mx-auto">
            Beta starts in</h1>
          <div className="text-2xl">
            <span ref={daysRef}> 0 Days </span>
            <span ref={hoursRef}> 0 Hours </span>
            <span ref={minutesRef}> 0 Minutes </span>
            <span ref={secondsRef}> 0 Seconds</span>
          </div>
          <span className="text-xl mt-10 font-bold text-center">
            2500 beta NFTs will be hidden in the cubes!
          </span>

        </>
      )}
    </div>
  );
};
