import React, { useState } from "react";
import styles from "./CreatePlaylist.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createPlaylist } from "@/redux/playlistSlice";
import { SpotifyUser } from "@/assets/interfaces";

interface CreatePlaylistProps {
  showCreatePlaylist: boolean;
  toggleCreatePlaylist: () => void;
  user: SpotifyUser;
}

const CreatePlaylist: React.FC<CreatePlaylistProps> = ({
  showCreatePlaylist,
  toggleCreatePlaylist,
  user,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicState, setPublicState] = useState(true);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (name !== "" && user) {
      dispatch(
        createPlaylist({ userId: user.id, name, description, publicState })
      );
      toggleCreatePlaylist();
    }
  };

  return (
    <>
      {showCreatePlaylist ? (
        <>
          <form className={styles.form} onSubmit={handleCreatePlaylist}>
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
              <button type="button" onClick={toggleCreatePlaylist}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
          <div className="grey-screen" onClick={toggleCreatePlaylist}></div>
        </>
      ) : null}
    </>
  );
};

export default CreatePlaylist;
