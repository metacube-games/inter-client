import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";

const BASE_URL = "https://api.metacube.games:8080/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow credentials and specific origin for cookies to be set
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://your-frontend-domain.com"
  );
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

    // Continue with the token fetching and cookie setting as before
    const backendResponse = await axios.get(`${BASE_URL}auth/refresh`, {
      params: { reconnect },
      withCredentials: true,
    });

    if (backendResponse.status !== 200) {
      return res
        .status(backendResponse.status)
        .json({ error: "Failed to fetch token" });
    }

    const token = backendResponse.data.token;

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("userToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", // Cross-site cookie setting
        path: "/",
      })
    );

    res.status(200).json({ message: "Token cookie set successfully" });
  } catch (error) {
    console.error("Error fetching token from backend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
