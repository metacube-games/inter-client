import { connect, disconnect, StarknetWindowObject } from "get-starknet";
import {
  postConnect,
  getNonce,
  setAccessToken,
} from "../backendAPI/backendAPI";
import { getPublicKey, setPublicKey } from "./starknet";

export const CHAIN_IDS = {
  MAINNET: "0x534e5f4d41494e",
  GOERLI: "SN_GOERLI",
};

const getCurrentChainId = () => CHAIN_IDS.MAINNET;

export async function connectToStarknet() {
  const connection = await connect({
    modalMode: "alwaysAsk",
    modalTheme: "dark",
  });

  if (connection && connection.isConnected) {
    const address = connection.selectedAddress || connection.account.address;
    setPublicKey(connection);

    const nonceData = (await getNonce(getPublicKey())) as any;
    const signature = await signMessage(connection, nonceData?.nonce);

    if (signature.length !== 3) {
      signature.unshift(0);
    }
    if (signature.length === 5) {
      signature[1] = signature[1] + "|" + signature[2];
      signature[2] = signature[3] + "|" + signature[4];
    }
    if (signature.length === 6) {
      signature[1] = signature[4];
      signature[2] = signature[5];
    }

    const data = await postConnect(
      getPublicKey(),
      signature[1],
      signature[2]
    ).then((data: any) => {
      if (data?.accessToken) setAccessToken(data.accessToken);
      return data;
    });
    return data;
  }
  return null;
}

export async function disconnectWallet() {
  await disconnect();
  // Additional cleanup if needed
}

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
