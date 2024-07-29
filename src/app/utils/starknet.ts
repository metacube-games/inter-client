import { StarknetWindowObject } from "get-starknet";

let publicKey = "";

export function setPublicKey(starknet: StarknetWindowObject) {
  if (starknet.account === undefined) {
    throw new Error("Starknet account not found");
  }
  publicKey = starknet.account.address.substring(2);
  while (publicKey.length < 64) {
    publicKey = "0" + publicKey;
  }
}

export function setPublicKeyFromCookies(publicKeyCookies: string) {
  publicKey = publicKeyCookies;
}

// Possible constants for chain IDs
export const CHAIN_IDS = {
  MAINNET: "0x534e5f4d41494e",
  GOERLI: "SN_GOERLI",
};

// Determine the environment for chain selection
const getCurrentChainId = () => {
  return CHAIN_IDS.MAINNET;
};

export async function signMessage(
  starknet: StarknetWindowObject,
  message: string
) {
  if (!starknet || !starknet.account) {
    throw new Error(
      "Unable to sign message: StarkNet account is not initialized or starknet object is missing."
    );
  }

  const messageStructure = {
    domain: {
      name: "Metacube",
      chainId: getCurrentChainId(),
      version: "0.0.1",
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "chainId", type: "felt" },
        { name: "version", type: "felt" },
      ],
      Message: [{ name: "message", type: "felt" }],
    },
    primaryType: "Message",

    message: {
      message: "timestamp: " + message,
    },
  };

  try {
    return await starknet.account.signMessage(messageStructure);
  } catch (error) {
    console.error("Error signing the message:", error);
    throw error;
  }
}

export function getPublicKey() {
  return publicKey;
}
