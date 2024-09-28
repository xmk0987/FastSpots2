import { NextApiRequest, NextApiResponse } from "next";
import {
  startPlayBack,
  fetchPlayer,
  stopPlayBack,
  skipNext,
  skipPrevious,
  toggleShuffle,
  toggleRepeat,
  seekPosition,
  seekVolume,
} from "@/api/player/player";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store");

  const { type, state, position } = req.query;
  const accessToken = req.cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    let data;
    switch (type) {
      case "player":
        data = await fetchPlayer(accessToken);
        break;

      case "play":
        const { contextUri, songUri, offset } = req.body;
        await startPlayBack(accessToken, contextUri as string, songUri, offset);
        break;

      case "stop":
        await stopPlayBack(accessToken);
        break;

      case "skipNext":
        await skipNext(accessToken);
        break;

      case "skipPrevious":
        await skipPrevious(accessToken);
        break;

      case "shuffle":
        if (state === "true" || state === "false") {
          await toggleShuffle(accessToken, state);
        }
        break;

      case "repeat":
        if (state === "off" || state === "track") {
          await toggleRepeat(accessToken, state);
        }
        break;

      case "seek":
        if (position) {
          await seekPosition(accessToken, parseInt(position as string));
        }
        break;

      case "volume":
        if (position) {
          await seekVolume(accessToken, parseInt(position as string));
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid type parameter" });
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
