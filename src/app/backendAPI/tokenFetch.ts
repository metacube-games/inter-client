export async function fetchToken(reconnect: boolean): Promise<string> {
  try {
    const response = await fetch(
      `https://play.metacube.games/api/set-cookie?reconnect=${reconnect}`,
      {
        method: "GET",
        credentials: "include", // Ensures cookies are included
      }
    );

    if (!response.ok) {
      // Handle specific HTTP error status if needed
      throw new Error(
        `Failed to set token cookie: ${response.status} ${response.statusText}`
      );
    }

    // Check if the response contains JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error("Failed to parse JSON response");
    }

    return data.message || "Token cookie set successfully";
  } catch (error: any) {
    console.error("Error in fetchToken:", error.message);
    throw new Error(
      error.message || "Unknown error occurred while fetching token"
    );
  }
}
