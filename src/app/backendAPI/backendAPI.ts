"use client";

import ky from "ky";
let accessToken = "";
const BASE_URL = "https://api.metacube.games:8080/";

const createApi = (token: string) =>
  ky.create({
    prefixUrl: BASE_URL,
  });

let api = createApi("");

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export const getAllStatistics = () => api.get("info/stats").json();

export const postConnect = (publicKey: string, r: string, s: string) =>
  api
    .post("auth/connect", {
      json: { publicKey, r, s },
    })
    .json();

export const postConnectGoogle = (credential: string) =>
  api
    .post("auth/connect", {
      searchParams: { google: "true" },
      json: { credential },
    })
    .json();

export async function getRewardAddress() {
  return api
    .get("profile/address", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
    .json();
}

export async function setRewardAddressBAPI(address: string) {
  return api
    .post("profile/address", {
      json: { address },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
    .json();
}

export const disconnect = () => api.get("auth/disconnect").json();

export const getNonce = (publicKey: string) => {
  if (!publicKey) {
    throw new Error("Public key is required");
  }
  return api.get("auth/nonce", { searchParams: { publicKey } }).json();
};

export const getRefresh = (reconnect: boolean) =>
  api
    .get("auth/refresh", {
      searchParams: { reconnect: reconnect.toString() },
      credentials: "include",
    })
    .json();

export const handleApiError = (error: unknown) => {
  if (error instanceof ky) {
    console.error(
      `HTTP Error ${(error as any)?.response.status}: ${
        (error as any)?.response.statusText
      }`
    );
  } else if (error instanceof Error) {
    console.error("API Error:", error.message);
  } else {
    console.error("Unknown API Error:", error);
  }
  throw error;
};
