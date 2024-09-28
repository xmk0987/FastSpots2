import React from "react";
import CheckedBoxIcon from "@/assets/icons/CheckedBoxIcon";
import AddIcon from "@/assets/icons/AddIcon";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setSelectedTracks,
  setConfirmPopup,
  setConfirmDelete,
} from "@/redux/playlistSlice";
import styles from "../TrackListHeader.module.css";
import { SpotifyUser } from "@/assets/interfaces";

interface PlaylistOptionsProps {
  user: SpotifyUser;
}

const PlaylistOptions: React.FC<PlaylistOptionsProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const { selectedPlaylist, selectedTracks } = useSelector(
    (state: RootState) => state.playlists
  );

  const deselectAll = () => {
    dispatch(setSelectedTracks([]));
  };

  const toggleDeleteConfirmation = () => {
    dispatch(setConfirmDelete(true));
  };

  const togglePlaylistPopup = () => {
    dispatch(setConfirmPopup(true));
  };

  return (
    <div className={styles.playlistOptions}>
      {selectedTracks.length === 0 ? null : (
        <>
          <p>{selectedTracks.length} / 100 selected</p>
          <div className={styles.playlistOption}>
            <button className="tooltip" onClick={deselectAll}>
              <CheckedBoxIcon size="16px" />
              <span className="tooltiptext">Deselect all</span>
            </button>
          </div>
          <div className={styles.playlistOption}>
            <button className="tooltip" onClick={togglePlaylistPopup}>
              <AddIcon size="16px" />
              <span className="tooltiptext">Add to a playlist</span>
            </button>
          </div>
          {selectedPlaylist?.owner.id === user.id ? (
            <div className={styles.playlistOption}>
              <button className="tooltip" onClick={toggleDeleteConfirmation}>
                <RemoveIcon size="16px" />
                <span className="tooltiptext">Remove from this playlist</span>
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default PlaylistOptions;
