import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const scope = [
    "user-read-private",
    "user-read-email",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "ugc-image-upload",
    "playlist-modify-public",
    "user-top-read",
    "user-read-recently-played",
    "user-library-modify",
    "user-library-read",
  ].join(" ");

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "Missing Spotify Client ID or Redirect URI",
    });
  }

  const spotifyAuthUrl =
    `https://accounts.spotify.com/authorize?` +
    new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    }).toString();

  // Redirect the user to Spotify's authorization page
  res.redirect(spotifyAuthUrl);
}
