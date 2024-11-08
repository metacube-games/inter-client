"use client";

import axios from "axios";

let accessToken = "";
const BASE_URL = "https://api.metacube.games:8080/";

const createApi = (token: string) => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

let api = createApi(accessToken);

export function setAccessToken(token: string) {
  accessToken = token;
  api = createApi(token); // Recreate API instance with new token
}

export function getAccessToken() {
  return accessToken;
}

export const getAllStatistics = () =>
  api.get("info/stats").then((res) => res.data);

export const postConnect = (publicKey: string, r: string, s: string) =>
  api
    .post("auth/connect", {
      publicKey,
      r,
      s,
    })
    .then((res) => res.data);

export const postConnectGoogle = (credential: string) =>
  api
    .post(
      "auth/connect",
      {
        credential,
      },
      {
        params: { google: "true" },
      }
    )
    .then((res) => res.data);

export async function getRewardAddress() {
  return api
    .get("profile/address", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    })
    .then((res) => res.data);
}

export async function setRewardAddressBAPI(address: string) {
  return api
    .post(
      "profile/address",
      {
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    )
    .then((res) => res.data);
}

export const disconnect = () =>
  api.get("auth/disconnect").then((res) => res.data);

export const getNonce = (publicKey: string) => {
  if (!publicKey) {
    throw new Error("Public key is required");
  }
  return api
    .get("auth/nonce", { params: { publicKey } })
    .then((res) => res.data);
};

export const getRefresh = (reconnect: boolean) =>
  api
    .get("auth/refresh", {
      params: { reconnect: reconnect.toString() },
      withCredentials: true,
    })
    .then((res) => res.data);

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
