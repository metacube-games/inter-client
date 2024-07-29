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
  const { isConnected, isAuthLoading, walletAddress } = useAuthStore(
    (state) => ({
      isConnected: state.isConnected,
      isAuthLoading: state.isAuthLoading,
      walletAddress: state.walletAddress,
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
          console.log(data);
          setPublicKeyFromCookies(data.playerData.publicKey);
          // SAG.setPublicKeyFromCookies(data.playerData.publicKey);
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
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleAuth = async (authFunction: () => Promise<any>) => {
    handleClose();
    try {
      SAG.setIsAuthLoading(true);
      console.log("authFunction", authFunction);
      const authData = await authFunction();
      console.log("after authFunction", authData);
      if (authData) {
        SAG.setIsConnected(true);
        if (authData.address) SAG.setWalletAddress(authData.address);
        if (authData.googleId) SAG.setGoogleId(authData.googleId);
        // SAG.setAccessToken(authData.accessToken);
        setAccessToken(authData.accessToken);
        SAG.setUsername(authData.username);
        SAG.setIsStarknetID(authData.username.includes(".stark"));
        setupRefreshInterval();
        toast.success("Login successful");
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

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <button
        onClick={isConnected ? handleLogout : handleOpen}
        disabled={isAuthLoading}
        className="px-4 py-2 rounded transition duration-150 ease-in-out bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400"
      >
        {isConnected ? `${walletAddress.slice(0, 5)}...` : "Login"}
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
      {isAuthLoading && <span className="ml-2 text-green-400">Loading...</span>}
    </>
  );
}
