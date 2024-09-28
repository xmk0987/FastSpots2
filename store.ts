import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "./redux/playlistSlice";
import musicPlayerReducer from "./redux/musicPlayerSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    musicPlayer: musicPlayerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
