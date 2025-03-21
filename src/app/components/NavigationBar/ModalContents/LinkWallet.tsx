"use client";
import React, { useEffect, useState, useRef } from "react";
import { LoginButton } from "../LoginButton";
import { connect, disconnect } from "get-starknet";
import {
  getRewardAddress,
  setRewardAddressBAPI,
} from "@/app/backendAPI/backendAPI";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";
import toast, { Toaster } from "react-hot-toast";

export function LinkWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [rewardAddress, setRewardAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const isLogin = useAuthStore((state) => state.isConnected);
  const googleID = useAuthStore((state) => state.googleId);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when wallet is connected
  useEffect(() => {
    if (walletAddress && googleID?.length > 5 && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [walletAddress, googleID]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        toast.success("Address copied to clipboard!");
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy address");
      });
  };

  const connectWallet = async () => {
    if (walletAddress) {
      // Disconnect logic
      setIsLoading(true);
      try {
        await disconnect();
        setWalletAddress(null);
        toast.success("Wallet disconnected successfully");
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
        toast.error("Failed to disconnect wallet");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Connect logic
      setIsLoading(true);
      connect()
        .then((starknet) => {
          if (starknet) {
            return starknet.enable();
          }
          throw new Error("Starknet not available");
        })
        .then(([address]) => {
          setWalletAddress(address);
          toast.success("Wallet connected successfully");
        })
        .catch((error) => {
          console.error("Error connecting wallet:", error);
          toast.error("Failed to connect wallet");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const rewardAync = async () => {
    const rewardAddress = (await getRewardAddress()) as any;
    const fRewardAddress = `0x${rewardAddress?.address}`;
    setRewardAddress(fRewardAddress);
  };

  const confirmLinking = () => {
    setIsLoading(true);
    setRewardAddressBAPI(walletAddress as string)
      .then(() => {
        toast.success("Successfully linked wallet");
      })
      .catch((error) => {
        console.error("Error linking wallet:", error);
        toast.error("Failed to link wallet. Please try again.");
      })
      .finally(() => {
        rewardAync();
        setIsLoading(false);
      });
  };

  const buttonStyle =
    "bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black";
  const disabledButtonStyle =
    "bg-gray-400 text-white font-bold py-2 px-6 rounded-md shadow-md cursor-not-allowed flex items-center justify-center";

  // useEffect(() => {
  //   getRewardAddress()
  //     .then((rewardAddress: any) => {
  //       const fRewardAddress = `0x${rewardAddress?.address}`;
  //       setRewardAddress(fRewardAddress);
  //     })
  //     .catch((err) => console.error(err));
  // }, [googleID, isLogin]);

  return (
    <div className="max-w-lg mx-0 sm:mx-auto">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#121212",
            color: "#fff",
            border: "1px solid #10B981",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      <div
        className="bg-black bg-opacity-30 p-4 rounded-lg mb-6 border-l-4 border-yellow-500"
        role="alert"
      >
        <h2 className="text-md mb-2 text-white font-medium">
          If you played with a Google account, you have to link a wallet to be
          eligible for potential giveaways, airdrops, and to receive the NFTs
          you found.
        </h2>
      </div>

      <section className=" text-white bg-black bg-opacity-40 p-5 rounded-lg ">
        <h2 className="text-center mb-4 font-medium">
          Need a wallet? Get one for free here:
        </h2>
        <div className="flex flex-wrap justify-center gap-8 mt-4 items-baseline">
          <a
            href="https://www.argent.xyz/argent-x/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg hover:bg-black hover:bg-opacity-40 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Download Argent X Wallet"
          >
            <Image
              src="/argentX.webp"
              alt="Argent X Wallet"
              width={60}
              height={50}
              style={{ height: "auto" }}
              className="mb-2"
            />
            <p className="text-white text-center">Argent X</p>
          </a>
          <a
            href="https://braavos.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-3 rounded-lg hover:bg-black hover:bg-opacity-40 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Download Braavos Wallet"
          >
            <Image
              src="/Braavos.webp"
              alt="Braavos Wallet"
              width={60}
              height={50}
              style={{ height: "auto", width: "auto" }}
              className="mb-2"
            />
            <p className="text-white text-center">Braavos</p>
          </a>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Both wallets are secure, non-custodial and allow you to interact with
          StarkNet dApps
        </p>
      </section>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 mt-8">
        <fieldset className="bg-black bg-opacity-50 p-5 rounded-lg">
          <legend className="text-xl font-bold   text-white flex items-center px-2">
            <span className="bg-green-800 text-white w-7 h-7 rounded-full flex items-center justify-center mr-3">
              1
            </span>
            Log your Google account
          </legend>
          <div className="flex justify-start flex-col items-center gap-3 h-24">
            <LoginButton onlyGoogleLogin />

            {!(googleID?.length > 5) ? (
              <></> // <LoginButton onlyGoogleLogin />
            ) : (
              <div className="flex items-center text-white bg-green-900/50 p-2 rounded-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span aria-live="polite" className="text-sm">
                  Google connection confirmed
                </span>
              </div>
            )}
          </div>
        </fieldset>
        {!(rewardAddress?.length > 5) && (
          <>
            <fieldset className="bg-black bg-opacity-50 p-5 rounded-lg">
              <legend className="text-xl mb-4 text-white font-bold flex items-center px-2">
                <span className="bg-green-800 text-white w-7 h-7 rounded-full flex items-center justify-center mr-3">
                  2
                </span>
                Link your wallet
              </legend>
              <div className="flex flex-col items-center gap-4 h-24 mb-2">
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isLoading}
                  aria-label={
                    walletAddress ? "Disconnect wallet" : "Connect wallet"
                  }
                  className={`${walletAddress ? "bg-red-700 hover:bg-red-600" : "bg-green-700 hover:bg-green-600"} text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out flex items-center justify-center   focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black cursor-pointer`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
                </button>
                <div
                  className="flex flex-col justify-center items-center"
                  aria-live="polite"
                >
                  <div className="text-gray-400 text-sm ">
                    <span
                      className={` text-center flex items-center ${walletAddress ? "text-green-400" : "text-yellow-500"}`}
                    >
                      {walletAddress ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Connected
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Not Connected
                        </>
                      )}
                    </span>
                  </div>

                  {walletAddress && (
                    <div className="flex items-center flex-col mt-1 gap-1">
                      <p className="text-xs text-gray-400 font-mono break-all text-center">
                        {walletAddress}
                      </p>
                      <button
                        onClick={() => copyToClipboard(walletAddress)}
                        className="ml-2 p-1 text-gray-400 hover:text-white transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label="Copy address to clipboard"
                        title="Copy to clipboard"
                      >
                        {copySuccess ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="bg-black bg-opacity-50 p-5 rounded-lg">
              <legend className="text-xl mb-4 text-white font-bold flex items-center px-2">
                <span className="bg-green-800 text-white w-7 h-7 rounded-full flex items-center justify-center mr-3">
                  3
                </span>
                Confirm
              </legend>
              <div className="flex flex-col items-center gap-4 mb-2">
                <button
                  type="button"
                  ref={confirmButtonRef}
                  onClick={confirmLinking}
                  disabled={
                    !(walletAddress && walletAddress.length > 5) ||
                    !(googleID?.length > 5) ||
                    isLoading ||
                    rewardAddress?.length > 5
                  }
                  className={
                    !(walletAddress && walletAddress.length > 5) ||
                    !(googleID?.length > 5) ||
                    isLoading ||
                    rewardAddress?.length > 5
                      ? disabledButtonStyle
                      : buttonStyle
                  }
                  aria-live="polite"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {rewardAddress?.length > 5
                    ? "Reward address linked"
                    : "Confirm Wallet Linking"}
                </button>
                {(!(walletAddress && walletAddress.length > 5) ||
                  !(googleID?.length > 5)) &&
                !(rewardAddress?.length > 5) ? (
                  <p className="text-xs text-yellow-500">
                    {!googleID?.length
                      ? "Please log in with Google first"
                      : !walletAddress
                        ? "Please connect your wallet"
                        : ""}
                  </p>
                ) : null}
              </div>
            </fieldset>
          </>
        )}
      </form>

      {rewardAddress?.length > 5 && (
        <div className="text-center" role="status" aria-live="polite">
          <h2 className="text-xl sm:text-2xl mb-6 text-white font-bold">
            All good! You have a reward address linked.
          </h2>
          <div className="flex justify-center mt-6 mb-6 flex-col text-center gap-4">
            <div className="p-4 bg-black bg-opacity-50 rounded-lg border border-green-800 inline-block mx-auto group hover:bg-opacity-70 transition-all duration-200">
              <p className="text-gray-400 mb-1 text-sm">Reward address:</p>
              <div className="flex items-center justify-center">
                <p className="text-green-400 font-mono break-all text-sm">
                  {rewardAddress}
                </p>
                <button
                  onClick={() => copyToClipboard(rewardAddress)}
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  aria-label="Copy address to clipboard"
                  title="Copy to clipboard"
                >
                  {copySuccess ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
