import { SpotifyUser } from "@/assets/interfaces";

export const fetchUser = async (accessToken: string): Promise<SpotifyUser> => {
  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch  user");
  }

  const data = await response.json();
  return data ? data : null;
};
