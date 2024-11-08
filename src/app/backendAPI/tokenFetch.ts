export async function fetchToken(reconnect: boolean) {
  const response = await fetch(
    `https://play.metacube.games/api/set-cookie?reconnect=${reconnect}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to set token cookie");
  }

  const data = await response.json();
  return data.message;
}
