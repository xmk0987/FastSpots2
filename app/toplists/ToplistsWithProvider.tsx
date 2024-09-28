"use client"; // This makes the component a Client Component

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import ToplistsClient from "./ToplistsClient";
import { SpotifyArtist, SpotifyTrack } from "@/assets/interfaces";

interface ToplistsClientProps {
  initialTopTracks: SpotifyTrack[];
  initialTopArtists: SpotifyArtist[];
}

const TopListsWithProvider: React.FC<ToplistsClientProps> = ({
  initialTopTracks,
  initialTopArtists,
}) => {
  return (
    <Provider store={store}>
      <ToplistsClient
        initialTopTracks={initialTopTracks}
        initialTopArtists={initialTopArtists}
      />{" "}
    </Provider>
  );
};

export default TopListsWithProvider;
