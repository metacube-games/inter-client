// ModalContents/LinkWallet.tsx

import React, { useEffect, useState } from "react";
import { LoginButton } from "../LoginButton";
import { connect } from "get-starknet";
import {
  getAccessToken,
  getRewardAddress,
  setRewardAddressBAPI,
} from "@/app/backendAPI/backendAPI";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";

export function LinkWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const isLogin = useAuthStore((state) => state.isConnected);
  const googleID = useAuthStore((state) => state.googleId);
  const [rewardAddress, setRewardAddress] = useState("");
  console.log("accesT", getAccessToken());
  const connectWallet = async () => {
    try {
      const starknet = await connect();
      if (starknet) {
        const [address] = await starknet.enable();
        setWalletAddress(address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const confirmLinking = async () => {
    if (walletAddress && googleID?.length > 5) {
      try {
        setRewardAddressBAPI(walletAddress);
        alert("Failed to link wallet. Please try in some hours...");
      } catch (error) {
        console.error("Error linking wallet:", error);
        alert("Failed to link wallet. Please try again.");
      }
    } else {
      alert(
        "Please make sure you're logged in with Google and your wallet is connected."
      );
    }
  };

  const buttonStyle =
    "bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded justify-center";
  const disabledButtonStyle =
    "bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed";

  useEffect(() => {
    const getRaddress = async () => {
      try {
        const rewardAddress = (await getRewardAddress()) as any;
        console.log(rewardAddress);
        const fRewardAddress = `0x${rewardAddress?.address}`;
        setRewardAddress(fRewardAddress);
      } catch (err) {
        console.error(err);
      }
    };
    getRaddress();
  }, [googleID, isLogin]);

  if (rewardAddress?.length > 5) {
    return (
      <div>
        <h1 className="text-lg sm:text-2xl mb-4 text-white">
          All good! You already have a reward address linked.
        </h1>
        <div className="flex justify-center mt-6 mb-6 flex-col text-center gap-4">
          {/* {googleID?.length < 5 ? (
            <LoginButton
              onlyGoogleLogin
              setIsGoogleLoggedIn={setIsGoogleLoggedIn}
            />
          ) : (
            <p className="text-white">Connected with Google</p>
          )} */}
          <p className="text-white">Reward address: {rewardAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-md mb-4 text-white">
        If you won assets playing with a Google account, you have to link a
        wallet to receive your rewards
      </h1>
      <h2 className="text-xl font-bold mb-4 text-white">
        1) Login to the Google account you used during the event:
      </h2>
      <div className="flex justify-center mt-6 mb-6">
        {googleID?.length > 5 ? (
          <LoginButton onlyGoogleLogin />
        ) : (
          <p className="text-white">Already connected with Google</p>
        )}
      </div>
      <h2 className="text-xl mb-4 text-white font-bold">
        2) Link your wallet:
      </h2>
      <div className="flex flex-col items-center gap-4 mb-6">
        <button onClick={connectWallet} className={buttonStyle}>
          Connect Wallet
        </button>
        {walletAddress && (
          <p className="text-white">Wallet connected: {walletAddress}</p>
        )}
      </div>

      <h2 className="text-xl mb-4 text-white font-bold">3) Confirm:</h2>
      <div className="flex flex-col items-center gap-4 mb-6">
        <button
          onClick={confirmLinking}
          className={
            walletAddress && googleID?.length > 5
              ? buttonStyle
              : disabledButtonStyle
          }
          disabled={!walletAddress || !(googleID?.length > 5)}
        >
          Confirm
        </button>
      </div>

      <div className="mt-8 text-white">
        <p>You can get a wallet for free here:</p>
        <div className="flex justify-center space-x-16 mt-4">
          <a
            href="https://www.argent.xyz/argent-x/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex text-center justify-center flex-col"
          >
            <Image
              src="/argentX.webp"
              alt="Argent X"
              width={60}
              height={50}
              style={{ height: "auto", width: "auto" }}
            />
            <p className="text-white text-center -ml-1">Argent X</p>
          </a>
          <a
            href="https://braavos.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/Braavos.webp"
              alt="Braavos"
              width={60}
              height={50}
              style={{ height: "auto", width: "auto" }}
            />
            <p className="text-white text-center">Braavos</p>
          </a>
        </div>
      </div>
    </div>
  );
}
