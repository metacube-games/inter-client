import ky from "ky";
import { useAuthStore } from "../store/authStore";

const BASE_URL = "https://api.metacube.games:8080/";
let accessToken = "";

let api: any;

export function setAccessToken(token: string) {
  accessToken = token;
  api = ky.create({
    prefixUrl: BASE_URL,
    credentials: "include", // This is equivalent to withCredentials: true
    hooks: {
      beforeRequest: [
        (request) => {
          if (accessToken.length > 0) {
            request.headers.set("Authorization", `Bearer ${accessToken}`);
          }
        },
      ],
    },
  });
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
  api.get("profile/address", {}).json();
}

export const disconnect = () => api.get("auth/disconnect").json();

export const getNonce = (publicKey: string) => {
  if (!publicKey) {
    throw new Error("Public key is required");
  }
  return api.get("auth/nonce", { searchParams: { publicKey } }).json();
};

export const getRefresh = (firstConnection: boolean) =>
  api.get("auth/refresh", { searchParams: { firstConnection } }).json();

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
