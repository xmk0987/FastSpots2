"use client"; // This makes the component a Client Component

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import MusicPlayerClient from "./MusicPlayerClient";

const MusicPlayerWithProvider = () => {
  return (
    <Provider store={store}>
      <MusicPlayerClient />
    </Provider>
  );
};

export default MusicPlayerWithProvider;
