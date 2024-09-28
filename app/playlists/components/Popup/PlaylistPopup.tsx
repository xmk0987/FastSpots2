"use client";
import React from "react";
import { SpotifyUser } from "@/assets/interfaces";
import styles from "./PlaylistPopup.module.css";
import Image from "next/image";
import placeholder from "@/assets/images/placeholder.jpg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  addTracksToPlaylist,
  setConfirmPopup,
} from "../../../../redux/playlistSlice";

interface PlaylistPopupProps {
  user: SpotifyUser;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const { playlists, selectedPlaylist, selectedTracks } = useSelector(
    (state: RootState) => state.playlists
  );
  const usersPlaylists = playlists?.filter(
    (playlist) =>
      playlist.owner.id === user.id && playlist.id !== selectedPlaylist?.id
  );

  const addToPlaylist = (playlistId: string) => {
    if (selectedTracks?.length > 0) {
      dispatch(addTracksToPlaylist({ playlistId, selectedTracks }));
    }
  };

  const handleClosePopup = () => dispatch(setConfirmPopup(false));

  return (
    <>
      <div className={styles.container}>
        <button className={styles.close} onClick={handleClosePopup}>
          X
        </button>
        <h4>Add selected to:</h4>
        <div className={styles.playlists}>
          {usersPlaylists &&
            usersPlaylists.length > 0 &&
            usersPlaylists.map((playlist) => (
              <div
                key={"Dropdown" + playlist.id}
                className={`${styles.playlist}`}
                onClick={() => addToPlaylist(playlist.id)}
              >
                <div className={styles.playlistImage}>
                  <Image
                    src={
                      playlist.images?.length > 0
                        ? playlist.images[0]?.url
                        : placeholder
                    }
                    alt={playlist.name}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <p>{playlist.name}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="grey-screen" onClick={handleClosePopup}></div>
    </>
  );
};

export default PlaylistPopup;
