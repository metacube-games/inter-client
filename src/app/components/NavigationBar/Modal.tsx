import React, { useCallback, useRef } from "react";
import { NFTGallery } from "./ModalContents/NFTGallery";
import { StatsPanel } from "./ModalContents/StatsPanel";

export function Modal({
  activeModal,
  onClose,
}: {
  activeModal: string | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-black bg-opacity-90 text-green-400 p-6 rounded-lg border border-green-400 h-[95vh] w-auto max-w-[90vw] flex flex-col relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-400 hover:text-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">{activeModal}</h2>
        <div className="flex-grow overflow-auto min-w-[300px] stable-scrollbar">
          <ModalContent modalType={activeModal} />
        </div>
      </div>
    </div>
  );
}

function ModalContent({ modalType }: { modalType: string }) {
  switch (modalType) {
    case "NFTs":
      return (
        <div className="w-[800px] max-w-[90vw] ">
          <NFTGallery />
        </div>
      );
    case "Stats":
      return <StatsPanel />;
    default:
      return null;
  }
}