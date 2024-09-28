// pages/api/spotify/toplists.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchTopArtists, fetchTopTracks } from "@/api/toplists/toplists";
import { SpotifyArtist, SpotifyTrack } from "@/assets/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, timeRange, limit } = req.query; // 'type' could be 'tracks' or 'artists'
  const accessToken = req.cookies.spotify_access_token; // Access token from cookies

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    let data: SpotifyArtist[] | SpotifyTrack[];
    if (type === "tracks") {
      data = await fetchTopTracks(
        accessToken,
        timeRange as string,
        Number(limit)
      );
    } else if (type === "artists") {
      data = await fetchTopArtists(
        accessToken,
        timeRange as string,
        Number(limit)
      );
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    return res.status(200).json({ data });
  } catch (error: unknown) {
    // Check if the error is an instance of Error before accessing `message`
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
