import { create } from "zustand";

interface ConnexionModalState {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useOpenConnexionModal = create<ConnexionModalState>((set) => ({
  open: false,
  handleOpen: () => set({ open: true }),
  handleClose: () => set({ open: false }),
}));

interface ModalState {
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
