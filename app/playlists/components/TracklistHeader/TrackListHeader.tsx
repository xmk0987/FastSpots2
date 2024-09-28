"use client";

import React, { useState, useEffect } from "react";
import styles from "./TrackListHeader.module.css";
import { SpotifyUser } from "../../../../assets/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import FilterOptions from "./components/FilterOptions";
import PlaylistOptions from "./components/PlaylistOptions";

interface TrackListHeaderProps {
  user: SpotifyUser;
}

const TrackListHeader: React.FC<TrackListHeaderProps> = ({ user }) => {
  const { selectedTracks, notificationMessage } = useSelector(
    (state: RootState) => state.playlists
  );

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false); // Track screen size

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 500);
    };

    // Add event listener to check screen size
    window.addEventListener("resize", checkScreenSize);

    // Check screen size on component mount
    checkScreenSize();

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className={styles.tracksHeader}>
      {isSmallScreen ? (
        selectedTracks.length > 0 ? (
          <PlaylistOptions user={user} />
        ) : (
          <FilterOptions />
        )
      ) : (
        <>
          <FilterOptions />
          <PlaylistOptions user={user} />
        </>
      )}
      {notificationMessage ? (
        <p
          className={styles.notification}
          style={{ textAlign: selectedTracks.length === 0 ? "end" : "center" }}
        >
          {notificationMessage}
        </p>
      ) : null}
    </div>
  );
};

export default TrackListHeader;
