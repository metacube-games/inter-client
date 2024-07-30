import React, { useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { SAG, useAuthStore } from "@/app/store/authStore";
import { useOpenConnexionModal } from "@/app/store/connexionModalStore";
import { connectToStarknet, disconnectWallet } from "@/app/utils/walletUtils";
import {
  postConnectGoogle,
  disconnect,
  getRefresh,
  setAccessToken,
} from "@/app/backendAPI/backendAPI";
import { setPublicKeyFromCookies } from "@/app/utils/starknet";

const REFRESH_INTERVAL = 270000;

export function LoginButton() {
  const { open, handleOpen, handleClose } = useOpenConnexionModal();
  const { isConnected, isAuthLoading, walletAddress, googleID } = useAuthStore(
    (state) => ({
      isConnected: state.isConnected,
      isAuthLoading: state.isAuthLoading,
      walletAddress: state.walletAddress,
      googleID: state.googleId,
    })
  );
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isConnected) {
      setupRefreshInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const setupRefreshInterval = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      getRefresh(false)
        .then((data: any) => {
          setPublicKeyFromCookies(data.playerData.publicKey);
          setAccessToken(data.accessToken);
        })
        .catch((err: any) => console.log(err));
    }, REFRESH_INTERVAL);
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      if (walletAddress) {
        await disconnectWallet();
      }
      SAG.reset();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleAuth = async (authFunction: () => Promise<any>) => {
    handleClose();
    try {
      SAG.setIsAuthLoading(true);
      const authData = await authFunction();
      SAG.setIsConnected(true);

      if (authData) {
        const pb = authData?.playerData?.publicKey;
        if (!pb) throw new Error("Public key is required");
        if (pb.startsWith("google")) {
          SAG.setGoogleId(pb);
        } else {
          SAG.setWalletAddress(pb);
        }
        // SAG.setAccessToken(authData.accessToken);
        setAccessToken(authData?.accessToken);
        SAG.setUsername(authData?.playerData?.username);
        SAG.setIsStarknetID(authData?.playerData?.username?.includes(".stark"));
        setupRefreshInterval();
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    } finally {
      SAG.setIsAuthLoading(false);
    }
  };

  const handleWalletConnect = () => handleAuth(connectToStarknet);
  const handleGoogleLogin = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      handleAuth(() => postConnectGoogle(credentialResponse.credential));
    }
  };

  const displayContent = () => {
    if (isAuthLoading) {
      return (
        <svg
          className="animate-spin h-5 w-5 text-green-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    if (isConnected) {
      const displayAddress =
        walletAddress.length > 3 ? walletAddress : googleID;
      if (displayAddress && displayAddress.length > 6) {
        const first3 = displayAddress.slice(0, 3);
        const last3 = displayAddress.slice(-3);
        return `${first3}...${last3}`;
      }
      return displayAddress;
    }

    return "Login";
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <button
        onClick={isConnected ? handleLogout : handleOpen}
        disabled={isAuthLoading}
        className="px-4 py-2 rounded transition duration-150 ease-in-out bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400"
      >
        {displayContent()}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-green-400 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Login</h2>
            <div className="space-y-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.error("Google Login Failed");
                  toast.error("Google login failed");
                }}
              />
              <button
                onClick={handleWalletConnect}
                className="w-full px-4 py-2 bg-green-400 text-black rounded hover:bg-green-500 transition duration-150 ease-in-out"
              >
                Connect with digital wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
