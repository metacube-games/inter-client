import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cookie from "cookie";

const BASE_URL = "https://api.metacube.games:8080/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const reconnect = req.query.reconnect || "false";

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
        secure: true, // Ensure secure in production
        sameSite: "none", // Set to 'none' if cross-origin
        path: "/",
      })
    );

    res.status(200).json({ message: "Token cookie set successfully" });
  } catch (error) {
    console.error("Error fetching token from backend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
