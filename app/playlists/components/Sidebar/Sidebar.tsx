"use client";

import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { SpotifyPlaylist } from "@/assets/interfaces";
import Image from "next/image";
import SearchIcon from "@/assets/icons/SearchIcon";
import SortIcon from "@/assets/icons/SortIcon";
import ArrowDownIcon from "@/assets/icons/ArrowDownIcon";
import ArrowUpIcon from "@/assets/icons/ArrowUpIcon";
import placeholder from "@/assets/images/placeholder.jpg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  selectPlaylistAndFetchTracks,
  toggleSidebar,
} from "../../../../redux/playlistSlice";
import AddIcon from "@/assets/icons/AddIcon";
import { SpotifyUser } from "@/assets/interfaces";
import MenuIcon from "@/assets/icons/MenuIcon";
import CreatePlaylist from "@/app/components/CreatePlaylist/CreatePlaylist";

interface SidebarProps {
  user: SpotifyUser;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [sortedPlaylists, setSortedPlaylist] = useState<SpotifyPlaylist[]>([]);

  const [showCreatePlaylist, setShowCreatePlaylist] = useState<boolean>(false);

  const { playlists, selectedPlaylist, showSidebar } = useSelector(
    (state: RootState) => state.playlists
  );

  useEffect(() => {
    if (playlists && playlists.length > 0) {
      const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort playlists by name
      const sortedPlaylists = filteredPlaylists.sort((a, b) => {
        if (sortAscending) {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });

      setSortedPlaylist(sortedPlaylists);
    }
  }, [playlists, searchTerm, sortAscending]);

  const selectPlaylist = (playlist: SpotifyPlaylist | null) => {
    dispatch(selectPlaylistAndFetchTracks(playlist));
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortAscending((prevOrder) => !prevOrder);
  };

  const toggleCreatePlaylist = () => {
    setShowCreatePlaylist(!showCreatePlaylist);
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      {showSidebar ? (
        <section className={styles.sidebar}>
          <div className={styles.sortOptions}>
            <div className={styles.sortOptionsSort}>
              <div className={styles.searchWrapper}>
                <button>
                  <SearchIcon />
                </button>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div className={styles.dropdown}>
                <button>
                  <SortIcon />
                </button>
                <div className={styles.dropdownContent}>
                  <div onClick={toggleSortOrder}>
                    <p>Name</p>
                    {sortAscending ? (
                      <ArrowUpIcon size="20px" />
                    ) : (
                      <ArrowDownIcon size="20px" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button className="tooltip" onClick={toggleCreatePlaylist}>
              <AddIcon />
              <span className="tooltiptext">Create playlist</span>
            </button>
            <button onClick={handleToggleSidebar}>
              <MenuIcon />
            </button>
          </div>
          <div
            className={`${styles.playlist} ${
              !selectedPlaylist ? styles.selected : ""
            }`}
            onClick={() => selectPlaylist(null)}
          >
            <div className={styles.playlistImage}>
              <Image
                src={placeholder}
                alt={"Liked Tracks"}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p>Liked Tracks</p>
          </div>
          <span className={styles.liked}></span>
          <div className={styles.playlists}>
            {sortedPlaylists &&
              sortedPlaylists.length > 0 &&
              sortedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`${styles.playlist} ${
                    selectedPlaylist?.id === playlist.id ? styles.selected : ""
                  }`}
                  onClick={() => selectPlaylist(playlist)}
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
        </section>
      ) : (
        <button onClick={handleToggleSidebar} className={styles.menu}>
          <MenuIcon size="15px" />
        </button>
      )}
      <CreatePlaylist
        showCreatePlaylist={showCreatePlaylist}
        toggleCreatePlaylist={toggleCreatePlaylist}
        user={user}
      />
    </>
  );
};

export default Sidebar;
