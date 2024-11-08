async function fetchToken() {
  const response = await fetch("http://play.metacube.games/api/set-cookie", {
    method: "GET",
    // Include credentials to allow cookies to be set
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to set token cookie");
  }

  const data = await response.json();
  return data.message;
}
