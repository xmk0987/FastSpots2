// app/toplists/page.tsx (Server Component)
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchTopArtists, fetchTopTracks } from "../../api/toplists/toplists";
import MusicPlayer from "../components/MusicPlayer/MusicPlayer";
import { SpotifyArtist, SpotifyTrack } from "../../assets/interfaces";
import TopListsWithProvider from "./ToplistsWithProvider";

const Toplists = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  const topTracks: SpotifyTrack[] = await fetchTopTracks(accessToken);
  const topArtists: SpotifyArtist[] = await fetchTopArtists(accessToken);

  return (
    <>
      <Navbar />
      <TopListsWithProvider
        initialTopTracks={topTracks}
        initialTopArtists={topArtists}
      />
      <MusicPlayer />
    </>
  );
};

export default Toplists;
