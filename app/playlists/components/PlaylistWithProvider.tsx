"use client"; // This makes the component a Client Component

import React from "react";
import { Provider } from "react-redux";
import { store } from "../../../store";
import PlaylistsClient from "./Client/PlaylistsClient";
import { SpotifyUser } from "../../../assets/interfaces";

const PlaylistsWithProvider: React.FC<{ user: SpotifyUser }> = ({ user }) => {
  return (
    <Provider store={store}>
      <PlaylistsClient user={user} />
    </Provider>
  );
};

export default PlaylistsWithProvider;
