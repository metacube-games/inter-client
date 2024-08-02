import React, { useEffect, useCallback } from "react";
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
import ReactDOM from "react-dom";

const REFRESH_INTERVAL = 270000;
let intervalId: any;

export function LoginButton() {
  const { open, handleOpen, handleClose } = useOpenConnexionModal();
  const { isConnected, isAuthLoading, address, walletAddress } = useAuthStore(
    (state) => ({
      isConnected: state.isConnected,
      isAuthLoading: state.isAuthLoading,
      walletAddress: state.walletAddress,
      address: state.address,
    })
  );

  useEffect(() => {
    if (intervalId) return;

    getRefresh(true)
      .then((data: any) => {
        setPublicKeyFromCookies(data?.playerData?.publicKey);
        setAccessToken(data?.accessToken);
        SAG.setAccessToken(data?.accessToken);

        setInitialStates(data);
      })
      .catch(console.error);

    if (isConnected) {
      intervalId = setInterval(() => {
        getRefresh(false)
          .then((data: any) => {
            setPublicKeyFromCookies(data?.playerData?.publicKey);
            setAccessToken(data?.accessToken);
            SAG.setAccessToken(data?.accessToken);
          })
          .catch(console.error);
      }, REFRESH_INTERVAL);
    }
    return () => clearInterval(intervalId);
  }, [isConnected]);

  const handleLogout = useCallback(async () => {
    try {
      await disconnect();
      if (walletAddress) {
        await disconnectWallet();
      }
      SAG.reset();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  }, [walletAddress]);

  const handleAuth = useCallback(
    async (authFunction: () => any) => {
      try {
        SAG.setIsAuthLoading(true);
        const authData = await authFunction();
        setInitialStates(authData);
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed");
      } finally {
        handleClose();
        SAG.setIsAuthLoading(false);
      }
    },
    [handleClose]
  );

  const handleWalletConnect = useCallback(
    () => handleAuth(connectToStarknet),
    [handleAuth]
  );

  const handleGoogleLogin = useCallback(
    (credentialResponse: { credential: string }) => {
      if (credentialResponse.credential) {
        handleAuth(() => postConnectGoogle(credentialResponse.credential));
      }
    },
    [handleAuth]
  );

  const displayContent = useCallback(() => {
    if (isAuthLoading) {
      return <LoadingSpinner />;
    }
    if (isConnected) {
      return address?.length > 6
        ? `${address.slice(0, 3)}...${address.slice(-2)}`
        : address;
    }
    return "Login";
  }, [isAuthLoading, isConnected, address]);

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
      {open &&
        ReactDOM.createPortal(
          <LoginModal
            onClose={handleClose}
            onGoogleLogin={handleGoogleLogin}
            onWalletConnect={handleWalletConnect}
          />,
          document.body
        )}
    </>
  );
}

function setInitialStates(authData: any) {
  SAG.setIsConnected(true);
  const pb = authData.playerData.publicKey;

  if (pb) {
    SAG.setIsConnected(true);
    SAG.setGoogleId(pb.startsWith("google") ? pb : "");
    SAG.setWalletAddress(pb.startsWith("google") ? "" : pb);
    SAG.setAddress(pb);
    console.log(authData);
    setAccessToken(authData.accessToken);
    SAG.setAccessToken(authData?.accessToken);

    SAG.setUsername(authData.playerData.username);
    SAG.setIsStarknetID(authData.playerData.username?.includes(".stark"));
  }
}

function LoginModal({
  onClose,
  onGoogleLogin,
  onWalletConnect,
}: {
  onClose: () => void;
  onGoogleLogin: (credentialResponse: { credential: string }) => void;
  onWalletConnect: () => void;
}) {
  useEffect(() => {
    const handleEscape = (event: { key: string }) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-black border border-green-400 p-6 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-green-400">Login</h2>
        <div className="space-y-4">
          <GoogleLogin
            onSuccess={onGoogleLogin as any}
            onError={() => toast.error("Google login failed")}
          />
          <button
            onClick={onWalletConnect}
            className="w-full px-4 py-2 bg-green-400 text-black rounded hover:bg-green-500 transition duration-150 ease-in-out"
          >
            Connect with digital wallet
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
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
