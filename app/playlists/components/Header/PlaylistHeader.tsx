"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PlaylistHeader.module.css";
import placeholder from "../../../../assets/images/placeholder.jpg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import EditIcon from "../../../../assets/icons/EditIcon";
import { updatePlaylistDetails } from "../../../../redux/playlistSlice";

const PlaylistHeader = () => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const { selectedPlaylist } = useSelector(
    (state: RootState) => state.playlists
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState(
    selectedPlaylist?.name ? selectedPlaylist?.name : ""
  );
  const [description, setDescription] = useState(
    selectedPlaylist?.description ? selectedPlaylist.description : ""
  );
  const [publicState, setPublicState] = useState(
    selectedPlaylist?.public ? selectedPlaylist.public : false
  );

  useEffect(() => {
    if (selectedPlaylist) {
      setName(selectedPlaylist.name);
      setDescription(
        selectedPlaylist?.description ? selectedPlaylist.description : ""
      );
      setPublicState(
        selectedPlaylist?.public ? selectedPlaylist.public : false
      );
    }
  }, [selectedPlaylist]);

  const toggleEditMode = () => {
    setEditMode(false);
  };

  const updatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (name !== "" && selectedPlaylist) {
      dispatch(
        updatePlaylistDetails({
          playlistId: selectedPlaylist?.id,
          name,
          description,
          publicState,
        })
      );
      setEditMode(false);
    }
  };

  return (
    <>
      <div className={styles.playlistHeader}>
        {selectedPlaylist ? (
          <button
            className={styles.editButton}
            onClick={() => setEditMode(!editMode)}
          >
            <EditIcon />
          </button>
        ) : null}
        <div className={styles.playlistHeaderImage}>
          <Image
            src={
              selectedPlaylist && selectedPlaylist.images?.length > 0
                ? selectedPlaylist.images[0].url
                : placeholder
            }
            alt="Playlist cover"
            priority
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className={styles.playlistHeaderInfo}>
          <h1>{selectedPlaylist ? selectedPlaylist.name : "Liked Tracks"}</h1>
          {selectedPlaylist ? (
            <p>
              {selectedPlaylist.public ? "Public playlist" : "Private playlist"}
            </p>
          ) : null}
          {selectedPlaylist ? <p>{selectedPlaylist.description}</p> : null}
        </div>
      </div>
      {editMode ? (
        <>
          <form className={styles.form} onSubmit={updatePlaylist}>
            <h3>Edit Playlist</h3>
            <div className={styles.formItem}>
              <label>Name:</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.formItem}>
              <label>Visibility:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="public"
                    checked={publicState}
                    onChange={() => setPublicState(true)}
                  />
                  Public
                </label>
                <label>
                  <input
                    type="radio"
                    value="private"
                    checked={!publicState}
                    onChange={() => setPublicState(false)}
                  />
                  Private
                </label>
              </div>
            </div>
            <div className={styles.formOptions}>
              <button type="button" onClick={toggleEditMode}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
          <div className="grey-screen" onClick={toggleEditMode}></div>
        </>
      ) : null}
    </>
  );
};

export default PlaylistHeader;
