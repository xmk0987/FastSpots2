import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar/Navbar";
import MusicPlayer from "../components/musicPlayer/MusicPlayer";
import { fetchUser } from "@/api/user/user";
import PlaylistsWithProvider from "./components/PlaylistWithProvider";

const Playlists = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  try {
    const user = await fetchUser(accessToken);
    return (
      <>
        <Navbar />
        <PlaylistsWithProvider user={user} />
        <MusicPlayer />
      </>
    );
  } catch (error) {
    console.log(error);
    return <p>User not found</p>;
  }
};

export default Playlists;
