import React from "react";
import Link from "next/link";
import { MenuItems } from "./MenuItems";
import { Modal } from "./Modal";

export function NavigationBar() {
  return (
    <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
      <Link href="https://metacube.games" passHref legacyBehavior>
        <a className="text-white text-lg hover:text-gray-300 transition duration-150 ease-in-out">
          <span className="font-bold text-white">&lt;</span> Back to Metacube
        </a>
      </Link>
      <div className="flex items-center space-x-4">
        <MenuItems />
      </div>
      <Modal />
    </nav>
  );
}
