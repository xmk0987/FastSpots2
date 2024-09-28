import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res
      .status(400)
      .json({ error: "No authorization code provided or invalid code" });
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
      }),
    });

    const data = await response.json();

    if (!data.access_token || !data.refresh_token) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve access token or refresh token" });
    }

    res.setHeader("Set-Cookie", [
      serialize("spotify_access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60,
      }),
      serialize("spotify_refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      }),
    ]);

    res.redirect("/toplists");
  } catch (error) {
    console.error("Error fetching access token:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
