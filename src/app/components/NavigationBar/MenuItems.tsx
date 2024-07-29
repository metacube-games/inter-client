import React from "react";
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "NFTs", icon: BuildingStorefrontIcon },
  { name: "Stats", icon: ChartBarIcon },
];

export function MenuItems({
  setActiveModal,
}: {
  setActiveModal: (name: string) => void;
}) {
  return (
    <div className="flex space-x-4">
      {menuItems.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setActiveModal(name)}
          className="flex items-center space-x-2 px-3 py-2 rounded bg-black bg-opacity-50 hover:bg-opacity-70 text-green-400 transition duration-150 ease-in-out"
        >
          <Icon className="h-5 w-5" />
          <span className="hidden md:inline">{name}</span>
        </button>
      ))}
    </div>
  );
}
