// app/pages/api/set-cookie.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "https://api.metacube.games:8080/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get reconnect parameter from the request query, default to 'false'
    const reconnect = req.query.reconnect?.toString() || "false";

    // Request token from backend
    const backendResponse = await axios.get(`${BASE_URL}auth/refresh`, {
      params: { reconnect },
      withCredentials: true, // Ensures cookies are included in the request if required
    });

    // Check if the backend responded successfully
    if (backendResponse.status !== 200) {
      return res
        .status(backendResponse.status)
        .json({ error: "Failed to fetch token" });
    }

    // Extract the token from the backend response data
    const token = backendResponse.data.token;

    // Ensure token exists before setting the cookie
    if (token) {
      // Set the token as a secure, HttpOnly cookie
      res.setHeader(
        "Set-Cookie",
        `userToken=${token}; Path=/; HttpOnly; Secure; SameSite=None`
      );
      // On the server, allow credentials for cross-origin requests
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://play.metacube.games/"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");

      return res.status(200).json({ message: "Token cookie set successfully" });
    } else {
      // Handle case where token is missing from backend response
      return res.status(500).json({ error: "Token not provided in response" });
    }
  } catch (error: any) {
    // Log and handle errors, check if axios response is available
    console.error("Error fetching token from backend:", error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error ||
      "Internal server error while fetching token";

    return res.status(status).json({ error: message });
  }
}
