import React from "react";
import styles from "./MusicPlayer.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MusicPlayerWithProvider from "./MusicPlayerWithProvider";
import { fetchUser } from "@/api/user/user";

const MusicPlayer = async () => {
  const cookieStore = cookies(); // Server-side cookie access
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  try {
    const user = await fetchUser(accessToken);

    return (
      <div className={styles.container}>
        {user.product === "premium" ? (
          <MusicPlayerWithProvider />
        ) : (
          <p>Player requires Spotify premium.</p>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.container}>
        <p>User not found.</p>
      </div>
    );
  }
};

export default MusicPlayer;
