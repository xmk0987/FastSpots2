"use client";

import React from "react";
import styles from "./ConfirmationModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  deleteTracksFromPlaylist,
  setConfirmDelete,
} from "../../../../redux/playlistSlice";

const ConfirmationModal = () => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const { selectedPlaylist, selectedTracks } = useSelector(
    (state: RootState) => state.playlists
  );

  const onConfirm = () => {
    if (selectedTracks?.length === 0) {
      return;
    }

    dispatch(
      deleteTracksFromPlaylist({
        playlistId: selectedPlaylist ? selectedPlaylist.id : "me",
        tracksToDelete: selectedTracks,
      })
    );
  };

  const onCancel = () => {
    dispatch(setConfirmDelete(false));
  };

  return (
    <>
      <div className={styles.confirmDelete}>
        <h4>Delete {selectedTracks.length} from this list?</h4>
        <div className={styles.confirmDeleteOptions}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      <div className="grey-screen" onClick={onCancel}></div>
    </>
  );
};

export default ConfirmationModal;
