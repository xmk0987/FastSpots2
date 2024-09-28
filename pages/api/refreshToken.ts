import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { spotify_refresh_token } = req.cookies;
  const { redirectTo } = req.query; 

  console.log("refreshing token ", spotify_refresh_token, redirectTo);
  if (!spotify_refresh_token) {
    return res.status(400).json({ error: "No refresh token provided" });
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
        grant_type: "refresh_token",
        refresh_token: spotify_refresh_token,
      }),
    });

    const data = await response.json();

    if (!data.access_token) {
      return res.status(500).json({ error: "Failed to refresh access token" });
    }

    res.setHeader(
      "Set-Cookie",
      serialize("spotify_access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60, 
      })
    );

    res.redirect(redirectTo as string);
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
