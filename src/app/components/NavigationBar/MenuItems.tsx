"use client"; // If you're using Next.js 13 app directory, ensure it's a client component

import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function MenuItems() {
  return (
    <Link
      href="https://market.metacube.games"
      target="_blank" // This ensures the link opens a new tab
      className="flex items-center space-x-2 px-3 py-2 rounded-sm bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400 transition duration-150 ease-in-out cursor-pointer"
    >
      <ShoppingBagIcon className="h-5 w-5" />
      <span className="hidden md:inline">Market</span>
    </Link>
  );
}

/* {menuItems.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setActiveModal(name)}
          className="flex items-center space-x-2 px-3 py-2 rounded-sm bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400 transition duration-150 ease-in-out"
        >
          <Icon className="h-5 w-5" />
          <span className="hidden md:inline">{name}</span>
        </button>
      ))} */
