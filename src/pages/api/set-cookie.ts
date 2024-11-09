// pages/api/set-cookie.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "https://api.metacube.games:8080/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Define your parameters (assuming `reconnect` is part of req.query)
    const reconnect = req?.query?.reconnect || "false"; // Default to 'false' if not provided

    // Make a request to the backend to refresh the token
    const backendResponse = await axios.get(`${BASE_URL}auth/refresh`, {
      params: { reconnect: reconnect.toString() },
      withCredentials: true, // Ensures cookies are included in the request if required
    });

    // Check if the response is successful
    if (backendResponse.status !== 200) {
      return res
        .status(backendResponse.status)
        .json({ error: "Failed to fetch token" });
    }

    // Extract the token or cookies from the backend response
    const token = backendResponse.data.token;

    // Set the token as a cookie in the response
    res.setHeader(
      "Set-Cookie",
      `refreshToken=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400;`
    );

    res.status(200).json({ message: "Token cookie set successfully" });
  } catch (error) {
    console.error("Error fetching token from backend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
