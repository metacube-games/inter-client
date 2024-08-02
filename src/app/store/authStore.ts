import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { StarknetWindowObject } from "get-starknet";

interface AuthState {
  isConnected: boolean;
  isAuthLoading: boolean;
  walletAddress: string;
  googleId: string;
  address: string;
  username: string;
  isStarknetID: boolean;
  publicKey: string;
  accessToken: string;
}

const initialState: AuthState = {
  isConnected: false,
  isAuthLoading: false,
  walletAddress: "",
  googleId: "",
  address: "",
  username: "",
  isStarknetID: false,
  publicKey: "",
  accessToken: "",
};

type SetterActions = {
  [K in keyof AuthState as `set${Capitalize<string & K>}`]: (
    value: AuthState[K]
  ) => void;
};

interface AdditionalActions {
  setPublicKeyFromStarknet: (starknet: StarknetWindowObject) => void;
  setPublicKeyFromCookies: (publicKeyCookies: string) => void;
  reset: () => void;
}

type AuthStore = AuthState & SetterActions & AdditionalActions;

export const useAuthStore = create<AuthStore>()((set) => {
  const store: Partial<AuthStore> = {
    ...initialState,
    setPublicKeyFromStarknet: (starknet: StarknetWindowObject) => {
      if (starknet.account === undefined) {
        throw new Error("Starknet account not found");
      }
      let publicKey = starknet.account.address.substring(2);
      while (publicKey.length < 64) {
        publicKey = "0" + publicKey;
      }
      set({ publicKey });
    },
    setPublicKeyFromCookies: (publicKeyCookies: string) =>
      set({ publicKey: publicKeyCookies }),
    reset: () => set(initialState),
  };

  Object.keys(initialState).forEach((key) => {
    const setterName = `set${
      key.charAt(0).toUpperCase() + key.slice(1)
    }` as keyof SetterActions;
    if (!(setterName in store)) {
      store[setterName] = (value: any) => set({ [key]: value });
    }
  });

  return store as AuthStore;
});

export const SAG = useAuthStore.getState();

export const useAuthSelectors = <K extends keyof AuthState>(...keys: K[]) => {
  return useAuthStore(
    useShallow(
      (state) =>
        Object.fromEntries(
          keys.map((key) => [key, state[key]])
        ) as unknown as Pick<AuthState, K>
    )
  );
};
