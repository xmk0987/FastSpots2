import { NextApiRequest, NextApiResponse } from "next";
import {
  addTracksToPlaylist,
  createPlaylist,
  deleteTracksFromPlaylist,
  fetchPlaylists,
  fetchPlaylistTracks,
  updatePlaylistDetails,
} from "@/api/playlists/playlists";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, playlistId, nextUri, userId } = req.query;
  const accessToken = req.cookies.spotify_access_token;

  // Handle missing access token (unauthorized)
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }

  try {
    let data;
    if (type === "playlists") {
      data = await fetchPlaylists(accessToken);
    } else if (type === "tracks") {
      data = await fetchPlaylistTracks(
        accessToken,
        playlistId as string,
        nextUri as string
      );
    } else if (type === "addTracks") {
      const { tracks } = req.body;
      if (!tracks || !Array.isArray(tracks)) {
        return res
          .status(400)
          .json({ message: "Invalid or missing tracks", status: 400 });
      }
      data = await addTracksToPlaylist(
        accessToken,
        playlistId as string,
        tracks
      );
    } else if (type === "deleteTracks") {
      const { tracks } = req.body;
      if (!tracks || !Array.isArray(tracks)) {
        return res
          .status(400)
          .json({ message: "Invalid or missing tracks", status: 400 });
      }
      data = await deleteTracksFromPlaylist(
        accessToken,
        playlistId as string,
        tracks
      );
    } else if (type === "updatePlaylist") {
      const { name, description, publicState } = req.body;
      data = await updatePlaylistDetails(
        accessToken,
        playlistId as string,
        name,
        description,
        publicState
      );
    } else if (type === "createPlaylist") {
      const { name, description, publicState } = req.body;
      data = await createPlaylist(
        accessToken,
        userId as string,
        name,
        description,
        publicState
      );
    } else {
      return res.status(400).json({ message: "Invalid type", status: 400 });
    }

    // Return success response
    return res.status(200).json({ data });
  } catch (error: unknown) {
    console.error("Error occurred while handling request: ", error);

    // Safely handle the error and return structured JSON error response
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, status: 500 });
    } else {
      return res
        .status(500)
        .json({ message: "An unknown error occurred", status: 500 });
    }
  }
}
