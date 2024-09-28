"use client";
import React, { useEffect } from "react";
import styles from "./Playlists.module.css";
import Sidebar from "../Sidebar/Sidebar";
import PlaylistHeader from "../Header/PlaylistHeader";
import TrackList from "../Tracklist/TrackList";
import PlaylistPopup from "../Popup/PlaylistPopup";
import ConfirmationModal from "../Confirmation/ConfirmationModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setNotificationMessage } from "../../../../redux/playlistSlice";
import { fetchPlaylists } from "../../../../redux/playlistSlice";
import { PageProps } from "@/assets/interfaces";
import TrackListHeader from "../TracklistHeader/TrackListHeader";

const PlaylistsClient: React.FC<PageProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch
  const {
    playlists,
    confirmPopup,
    confirmDelete,
    notificationMessage,
    loading,
    tracks,
  } = useSelector((state: RootState) => state.playlists);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (notificationMessage) {
      // Clear the notification after 3 seconds
      timer = setTimeout(() => {
        dispatch(setNotificationMessage(null));
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [dispatch, notificationMessage]);

  // Fetch playlists on mount
  useEffect(() => {
    // Only fetch if playlists are empty
    if (!playlists || playlists.length === 0) {
      dispatch(fetchPlaylists());
    }
  }, [dispatch]);

  return (
    <main className={styles.container}>
      <Sidebar user={user} />
      <section className={styles.playlistContainer}>
        <>
          <PlaylistHeader />
          <div className={styles.tracksContainer}>
            <TrackListHeader user={user} />
            {tracks.length === 0 && loading ? (
              <div className={styles.loading}>Fetching Tracks...</div>
            ) : (
              <TrackList user={user} />
            )}
          </div>
          {confirmPopup && <PlaylistPopup user={user} />}
          {confirmDelete && <ConfirmationModal />}
        </>
      </section>
    </main>
  );
};

export default PlaylistsClient;
