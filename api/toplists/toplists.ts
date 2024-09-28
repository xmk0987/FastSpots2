import { SpotifyArtist, SpotifyTrack } from "@/assets/interfaces";

export const fetchTopTracks = async (
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 20
): Promise<SpotifyTrack[]> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch top tracks");
  }

  const data = await response.json();
  return data ? data.items : [];
};

export const fetchTopArtists = async (
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 20
): Promise<SpotifyArtist[]> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch top artists");
  }

  const data = await response.json();
  return data ? data.items : [];
};
