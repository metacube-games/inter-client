import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";

const BASE_URL = "https://api.metacube.games:8080/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow credentials and specific origin for cookies to be set
  res.setHeader("Access-Control-Allow-Origin", "https://play.metacube.games"); // Ensure no trailing slash
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Handle CORS preflight request
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  try {
    const reconnect = req.query.reconnect || "false";

    // Attempt to fetch the token from backend
    const backendResponse = await axios.get(`${BASE_URL}auth/refresh`, {
      params: { reconnect },
      withCredentials: true,
    });

    // Check if the backend response status is successful
    if (backendResponse.status !== 200) {
      console.error(
        "Error: Non-200 response from backend:",
        backendResponse.status
      );
      return res
        .status(backendResponse.status)
        .json({ error: "Failed to fetch token" });
    }

    // Extract token and set it as a cookie
    const token = backendResponse.data.token;
    if (!token) {
      console.error(
        "Error: Token missing in backend response:",
        backendResponse.data
      );
      return res.status(500).json({ error: "Token not found in response" });
    }

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("userToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only use Secure in production
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
