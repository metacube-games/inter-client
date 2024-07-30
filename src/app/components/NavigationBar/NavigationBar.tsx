"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuItems } from "./MenuItems";
import { LoginButton } from "./LoginButton";
import { Modal } from "./Modal";
import { useAuthStore } from "@/app/store/authStore";

export function NavigationBar() {
  const { isConnected, walletAddress } = useAuthStore((state) => ({
    isConnected: state.isConnected,
    walletAddress: state.walletAddress,
  }));

  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-50">
      <Link href="https://metacube.games" passHref legacyBehavior>
        <a className="text-white text-lg hover:text-gray-300 transition duration-150 ease-in-out">
          <span className="font-bold text-white">&lt;</span> Back to Metacube
        </a>
      </Link>
      <div className="flex items-center space-x-4">
        <MenuItems setActiveModal={setActiveModal} />
        <LoginButton isConnected={isConnected} walletAddress={walletAddress} />
      </div>
      <Modal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </nav>
  );
}
