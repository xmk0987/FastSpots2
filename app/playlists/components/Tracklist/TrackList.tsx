/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./TrackList.module.css";
import PlayIcon from "@/assets/icons/PlayIcon";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import CheckedBoxIcon from "@/assets/icons/CheckedBoxIcon";
import CheckBoxEmptyIcon from "@/assets/icons/CheckBoxEmptyIcon";
import { SpotifyPlaylistTrack, SpotifyUser } from "@/assets/interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  deleteTracksFromPlaylist,
  fetchPlaylistTracks,
  selectPlaylistAndFetchTracks,
  setSelectedTracks,
} from "@/redux/playlistSlice";
import { playSongByURI } from "@/redux/musicPlayerSlice";
import NoteIcon from "@/assets/icons/NoteIcon";

interface TrackListProps {
  user: SpotifyUser;
}

const TrackList: React.FC<TrackListProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const {
    tracks,
    selectedPlaylist,
    selectedTracks,
    nextTracksUri,
    sortedTracks,
    loading,
  } = useSelector((state: RootState) => state.playlists);
  const { playerData } = useSelector((state: RootState) => state.musicPlayer);

  const fetchNextData = useCallback(() => {
    dispatch(
      fetchPlaylistTracks({
        playlistId: selectedPlaylist ? selectedPlaylist.id : "me",
        nextTracksUri: nextTracksUri,
      })
    );
  }, [dispatch, nextTracksUri, selectedPlaylist]);

  useEffect(() => {
    if (nextTracksUri) {
      fetchNextData();
    }
  }, [fetchNextData, nextTracksUri, selectedPlaylist]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastTrackElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      // Disconnect the previous observer if it exists
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextTracksUri) {
          fetchNextData();
        }
      });

      // If the node exists, observe it
      if (node) observer.current.observe(node);
    },
    [fetchNextData, loading, nextTracksUri]
  );

  useEffect(() => {
    if (!selectedPlaylist && !nextTracksUri && tracks.length === 0) {
      dispatch(selectPlaylistAndFetchTracks(null));
    }
  }, [dispatch, nextTracksUri, selectedPlaylist, tracks.length]);

  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null
  );

  const toggleTrackSelection = (trackURI: string) => {
    const updatedSelectedTracks = selectedTracks.includes(trackURI)
      ? selectedTracks.filter((track: string) => track !== trackURI)
      : [...selectedTracks, trackURI];

    dispatch(setSelectedTracks(updatedSelectedTracks));
  };

  const deleteTracks = (uri: string) => {
    dispatch(
      deleteTracksFromPlaylist({
        playlistId: selectedPlaylist ? selectedPlaylist.id : "me",
        tracksToDelete: [uri],
      })
    );
  };

  const playSong = (uri: string) => {
    if (playerData) {
      if (selectedPlaylist) {
        dispatch(
          playSongByURI({
            offset: { uri },
            contextUri: selectedPlaylist ? selectedPlaylist.uri : undefined,
          })
        );
      } else {
        dispatch(
          playSongByURI({
            songURI: uri,
          })
        );
      }
    }
  };

  return (
    <div className={styles.tracks}>
      {sortedTracks?.map((track: SpotifyPlaylistTrack, index: number) => {
        if (sortedTracks.length === index + 1) {
          return (
            <div
              key={index + track.track.uri} // Use a unique key
              className={styles.track}
              ref={lastTrackElementRef}
              onMouseEnter={() => setHoveredTrackIndex(index)} // Set the hovered track index
              onMouseLeave={() => setHoveredTrackIndex(null)} // Reset hover state on mouse leave
            >
              <div className={styles.trackPosition}>
                {hoveredTrackIndex === index ||
                playerData?.item?.uri === track.track.uri ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from bubbling up
                      playSong(track.track.uri);
                    }}
                  >
                    {playerData?.item?.uri === track.track.uri ? (
                      <NoteIcon color={"var(--accent-color)"} />
                    ) : (
                      <PlayIcon />
                    )}
                  </button>
                ) : (
                  <p>{index + 1}.</p>
                )}
              </div>
              <div className={styles.trackImage}>
                <img
                  alt="Track cover"
                  src={track.track.album.images[0]?.url || "/placeholder.jpg"}
                ></img>
              </div>
              <div className={styles.trackInfo}>
                <div className={styles.trackNameArtist}>
                  <p>{track.track.name}</p>
                  <p>{track.track.artists[0].name}</p>
                </div>
                <p className={styles.trackAlbum}>{track.track.album.name}</p>

                <div className={styles.trackLength}>
                  <p>{formatTime(track.track.duration_ms)}</p>
                </div>
              </div>
              <div className={styles.trackOptions}>
                {selectedPlaylist?.owner.id === user.id ? (
                  <button
                    className={styles.deleteTrack}
                    onClick={() => deleteTracks(track.track.uri)}
                  >
                    <RemoveIcon size="15px" />
                  </button>
                ) : null}

                <button onClick={() => toggleTrackSelection(track.track.uri)}>
                  {selectedTracks.includes(track.track.uri) ? (
                    <CheckedBoxIcon size="15px" />
                  ) : (
                    <CheckBoxEmptyIcon size="15px" />
                  )}
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={index + track.track.uri} // Use a unique key
              className={styles.track}
              onMouseEnter={() => setHoveredTrackIndex(index)} // Set the hovered track index
              onMouseLeave={() => setHoveredTrackIndex(null)} // Reset hover state on mouse leave
            >
              <div className={styles.trackPosition}>
                {hoveredTrackIndex === index ||
                playerData?.item?.uri === track.track.uri ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from bubbling up
                      playSong(track.track.uri);
                    }}
                  >
                    {playerData?.item?.uri === track.track.uri ? (
                      <NoteIcon color={"var(--accent-color)"} />
                    ) : (
                      <PlayIcon />
                    )}
                  </button>
                ) : (
                  <p>{index + 1}.</p>
                )}
              </div>
              <div className={styles.trackImage}>
                <img
                  alt="Track cover"
                  src={track.track.album.images[0]?.url || "/placeholder.jpg"}
                />
              </div>
              <div className={styles.trackInfo}>
                <div className={styles.trackNameArtist}>
                  <p>{track.track.name}</p>
                  <p>{track.track.artists[0].name}</p>
                </div>
                <p className={styles.trackAlbum}>{track.track.album.name}</p>

                <div className={styles.trackLength}>
                  <p>{formatTime(track.track.duration_ms)}</p>
                </div>
              </div>
              <div className={styles.trackOptions}>
                {selectedPlaylist?.owner.id === user.id ? (
                  <button
                    className={styles.deleteTrack}
                    onClick={() => deleteTracks(track.track.uri)}
                  >
                    <RemoveIcon size="15px" />
                  </button>
                ) : null}

                <button onClick={() => toggleTrackSelection(track.track.uri)}>
                  {selectedTracks.includes(track.track.uri) ? (
                    <CheckedBoxIcon size="15px" />
                  ) : (
                    <CheckBoxEmptyIcon size="15px" />
                  )}
                </button>
              </div>
            </div>
          );
        }
      })}
      {nextTracksUri ? <p>Fetching more songs...</p> : null}
    </div>
  );
};

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
};

export default TrackList;
