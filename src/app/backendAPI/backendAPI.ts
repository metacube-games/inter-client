import axios, { AxiosResponse } from "axios";

let accessToken = "";
const BASE_URL = "https://api.metacube.games:8080/";

function treatHTTPResponseACB(res: AxiosResponse<any, any>) {
  if (res.status === 200) {
    return res.data;
  } else {
    const error = { response: res };
    throw error;
  }
}

const createApi = () => {
  return axios.create({
    baseURL: BASE_URL,
  });
};

let api = createApi();
function setAccessTokenCookie(token: string) {
  document.cookie = `refreshToken=${token}; path=/; Secure; SameSite=Strict; Max-Age=86400;`;
}

// document.cookie = `refreshToken=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=None`;

export function setAccessToken(token: string) {
  accessToken = token;
  setAccessTokenCookie(token);
}

export function getAccessToken() {
  return accessToken;
}

export async function getAllStatistics() {
  const result = await api.get("info/stats");
  return treatHTTPResponseACB(result);
}

export const postConnect = async (publicKey: string, r: string, s: string) => {
  const result = await api.post("auth/connect", { publicKey, r, s });
  return treatHTTPResponseACB(result);
};

export const postConnectGoogle = async (credential: string) => {
  const result = await api.post(
    "auth/connect",
    { credential },
    { params: { google: "true" } }
  );
  return treatHTTPResponseACB(result);
};

export async function getRewardAddress() {
  const result = await api.get("profile/address", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return treatHTTPResponseACB(result);
}

export async function setRewardAddressBAPI(address: string) {
  const result = await api.post(
    "profile/address",
    { address },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return treatHTTPResponseACB(result);
}

export const disconnect = async () => {
  const result = await api.get("auth/disconnect");
  return treatHTTPResponseACB(result);
};

export const getNonce = async (publicKey: string) => {
  if (!publicKey) {
    throw new Error("Public key is required");
  }
  const result = await api.get("auth/nonce", { params: { publicKey } });
  return treatHTTPResponseACB(result);
};

export const getRefresh = async (reconnect: boolean) => {
  const result = await api.get("auth/refresh", {
    params: { reconnect: reconnect.toString() },
    withCredentials: true,
  });
  return treatHTTPResponseACB(result);
};

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(
      `HTTP Error ${error.response?.status}: ${error.response?.statusText}`
    );
  } else if (error instanceof Error) {
    console.error("API Error:", error.message);
  } else {
    console.error("Unknown API Error:", error);
  }
  throw error;
};
