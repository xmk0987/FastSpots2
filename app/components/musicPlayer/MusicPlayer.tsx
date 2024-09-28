import React from "react";
import styles from "./MusicPlayer.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MusicPlayerWithProvider from "./MusicPlayerWithProvider";

const MusicPlayer = async () => {
  const cookieStore = cookies(); // Server-side cookie access
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  return (
    <div className={styles.container}>
      <MusicPlayerWithProvider />
    </div>
  );
};

export default MusicPlayer;
