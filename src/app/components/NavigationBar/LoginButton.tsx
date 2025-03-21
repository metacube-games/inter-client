import React, { useEffect, useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { SAG, useAuthStore } from "@/app/store/authStore";
import { useOpenConnexionModal } from "@/app/store/connexionModalStore";
import { connectToStarknet, disconnectWallet } from "@/app/utils/walletUtils";
import {
  postConnectGoogle,
  disconnect,
  setAccessToken,
} from "@/app/backendAPI/backendAPI";
import ReactDOM from "react-dom";
import { useShallow } from "zustand/react/shallow";

// The main Login component
export function LoginButton({
  onlyGoogleLogin = false,
}: {
  onlyGoogleLogin?: boolean;
}) {
  const { open, handleOpen, handleClose } = useOpenConnexionModal();
  const { isConnected, isAuthLoading, address, walletAddress } = useAuthStore(
    useShallow((state) => ({
      isConnected: state.isConnected,
      isAuthLoading: state.isAuthLoading,
      walletAddress: state.walletAddress,
      address: state.address,
    }))
  );

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      await disconnect();
      if (walletAddress) {
        await disconnectWallet();
      }
      SAG.reset();
      setAccessToken("");
      // Also consider clearing any interval or cookies here if needed
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  }, [walletAddress]);

  // Connect with StarkNet wallet
  const handleWalletConnect = useCallback(async () => {
    SAG.setIsAuthLoading(true);
    try {
      const data = await connectToStarknet();
      if (data) {
        setInitialStates(data);
      }
    } catch (err) {
      console.error("Wallet connect error:", err);
      toast.error("Wallet connection failed");
    } finally {
      SAG.setIsAuthLoading(false);
      handleClose();
    }
  }, [handleClose]);

  // Google OAuth callback
  const handleGoogleLogin = useCallback(
    (credentialResponse: { credential: string }) => {
      SAG.setIsAuthLoading(true);
      postConnectGoogle(credentialResponse?.credential)
        .then((data: any) => {
          if (data) {
            setInitialStates(data);
          }
        })
        .catch((err) => {
          console.error("Google login error:", err);
          toast.error("Google login failed");
        })
        .finally(() => {
          SAG.setIsAuthLoading(false);
          handleClose();
        });
    },
    [handleClose]
  );

  // Dynamic button content
  const displayContent = () => {
    if (isAuthLoading) return <LoadingSpinner />;
    if (isConnected) {
      // Show short version of address
      return address && address.length > 6
        ? `${address.slice(0, 3)}...${address.slice(-2)}`
        : address;
    }
    return "Login";
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {onlyGoogleLogin ? (
        <div className="bg-black p-1 rounded-md shadow-xl">
          <GoogleLogin
            onSuccess={handleGoogleLogin as any}
            onError={() => toast.error("Google login failed")}
          />
        </div>
      ) : (
        <>
          <button
            onClick={isConnected ? handleLogout : handleOpen}
            disabled={isAuthLoading}
            className="px-4 py-2 rounded-sm transition duration-150 ease-in-out bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400"
          >
            {displayContent()}
          </button>
          {open &&
            ReactDOM.createPortal(
              <LoginModal
                onClose={handleClose}
                handleGoogleLogin={handleGoogleLogin}
                onWalletConnect={handleWalletConnect}
              />,
              document.body
            )}
        </>
      )}
    </>
  );
}

// Helper to set store states
function setInitialStates(authData: any) {
  SAG.setIsConnected(true);
  setAccessToken(authData?.accessToken);

  const pb = authData?.playerData?.publicKey;
  if (!pb) return;

  SAG.setGoogleId(pb.startsWith("google") ? pb : "");
  SAG.setWalletAddress(pb.startsWith("google") ? "" : pb);
  SAG.setAddress(pb);
  SAG.setUsername(authData?.playerData?.username);
  SAG.setIsStarknetID(authData?.playerData?.username?.includes(".stark"));
}

// Modal for login (Google or wallet)
function LoginModal({
  onClose,
  handleGoogleLogin,
  onWalletConnect,
}: {
  onClose: () => void;
  handleGoogleLogin: (credentialResponse: { credential: string }) => void;
  onWalletConnect: () => void;
}) {
  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Modal overlay & content
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
            onSuccess={handleGoogleLogin as any}
            onError={() => toast.error("Google login failed")}
          />
          <button
            onClick={onWalletConnect}
            className="w-full px-4 py-2 bg-green-400 text-black rounded-sm hover:bg-green-500 transition duration-150 ease-in-out"
          >
            Connect with digital wallet
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple spinner
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
