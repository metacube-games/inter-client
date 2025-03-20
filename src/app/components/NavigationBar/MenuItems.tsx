import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { LinkIcon } from "@heroicons/react/24/outline";

import Link from "next/link";

export function MenuItems() {
  return (
    <>
      <Link
        href="https://market.metacube.games"
        target="_blank" // This ensures the link opens a new tab
        className="flex items-center sm:space-x-2 px-3 py-2 rounded-sm bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400 transition duration-150 ease-in-out cursor-pointer"
      >
        <ShoppingBagIcon className="h-5 w-5" />
        <span className="hidden md:inline">Market</span>
      </Link>
      <Link
        href="/linkWallet"
        className="flex items-center sm:space-x-2 px-3 py-2 rounded-sm bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400 transition duration-150 ease-in-out cursor-pointer"
      >
        <LinkIcon className="h-5 w-5" />
        <span className="hidden md:inline">Link Wallet</span>
      </Link>
    </>
  );
}
