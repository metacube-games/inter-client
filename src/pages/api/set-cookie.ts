import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";

const BASE_URL = "https://api.metacube.games:8080/";
const createApi = () => {
  return axios.create({
    baseURL: BASE_URL,
  });
};
let api = createApi();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow credentials and specific origin for cookies to be set
  res.setHeader("Access-Control-Allow-Origin", "https://play.metacube.games");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req?.method === "OPTIONS") {
    // Handle CORS preflight request
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  try {
    const reconnect = req?.query?.reconnect || "false";

    // Extract cookies from the incoming request
    const cookies = req.headers?.cookie || "";

    // Attempt to fetch the token from backend
    const backendResponse = await api.get("auth/refresh", {
      params: { reconnect: reconnect?.toString() },
      withCredentials: true,
      headers: {
        // Forward the cookies to the backend
        Cookie: cookies,
      },
    });

    // Check if the backend response status is successful
    if (backendResponse?.status !== 200) {
      console.error(
        "Error: Non-200 response from backend:",
        backendResponse?.status
      );
      return res
        .status(backendResponse.status)
        .json({ error: "Failed to fetch token" });
    }

    // Extract token and set it as a cookie
    const token = backendResponse?.data?.accessToken;
    if (!token) {
      console.error(
        "Error: Token missing in backend response:",
        backendResponse?.data
      );
      return res.status(500).json({ error: "Token not found in response" });
    }

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("userToken", token, {
        httpOnly: true,
        secure: true, // Use secure only in production
        sameSite: "none", // Cross-site cookie setting
        path: "/",
      })
    );

    res.status(200).json({ message: "Token cookie set successfully" });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error response:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
