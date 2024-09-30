/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import styles from "./Toplists.module.css";
import { getImageBrightness } from "./helpers/imageBrightness";
import { SpotifyArtist, SpotifyTrack } from "@/assets/interfaces";
import placeholder from "@/assets/images/placeholder.jpg";
import PlayIcon from "@/assets/icons/PlayIcon";
import { playSongByURI } from "@/redux/musicPlayerSlice";
import NoteIcon from "@/assets/icons/NoteIcon";

interface ToplistsClientProps {
  initialTopTracks: SpotifyTrack[];
  initialTopArtists: SpotifyArtist[];
}

const ToplistsClient: React.FC<ToplistsClientProps> = ({
  initialTopTracks,
  initialTopArtists,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const { playerData } = useSelector((state: RootState) => state.musicPlayer);

  const [trackBrightnessClass, setTrackBrightnessClass] = useState<
    "light" | "dark"
  >("light");
  const [artistBrightnessClass, setArtistBrightnessClass] = useState<
    "light" | "dark"
  >("light");

  // State for time frame and number of items
  const [timeFrameTracks, setTimeFrameTracks] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [timeFrameArtists, setTimeFrameArtists] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [amountTracks, setAmountTracks] = useState<number>(20);
  const [amountArtists, setAmountArtists] = useState<number>(20);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>(initialTopTracks);
  const [topArtists, setTopArtists] =
    useState<SpotifyArtist[]>(initialTopArtists);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState<number | null>(
    null
  );

  // Fetch updated data from API
  const fetchUpdatedData = async (
    type: "tracks" | "artists",
    timeRange: string,
    limit: number
  ) => {
    const response = await fetch(
      `/api/spotify/toplists?type=${type}&timeRange=${timeRange}&limit=${limit}`
    );

    if (response.ok) {
      const { data } = await response.json();
      return data;
    } else {
      if (response.status === 401) {
      } else {
        console.log("error occured");
      }
    }
  };

  // Analyze brightness for top tracks cover
  useEffect(() => {
    const analyzeTrackBrightness = async () => {
      if (topTracks.length > 0) {
        const firstTrackCover = topTracks[0]?.album.images[0]?.url;
        const brightness = await getImageBrightness(firstTrackCover);
        setTrackBrightnessClass(brightness);
      }
    };

    analyzeTrackBrightness();
  }, [topTracks]);

  // Analyze brightness for top artists cover
  useEffect(() => {
    const analyzeArtistBrightness = async () => {
      if (topArtists.length > 0) {
        const firstArtistImage = topArtists[0]?.images[0]?.url;
        const brightness = await getImageBrightness(firstArtistImage);
        setArtistBrightnessClass(brightness);
      }
    };

    analyzeArtistBrightness();
  }, [topArtists]);

  // Handlers for onChange events
  const handleTimeFrameTracksChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTimeFrame = event.target.value;
    if (
      newTimeFrame === "short_term" ||
      newTimeFrame === "medium_term" ||
      newTimeFrame === "long_term"
    ) {
      setTimeFrameTracks(newTimeFrame);
      const updatedTracks = await fetchUpdatedData(
        "tracks",
        newTimeFrame,
        amountTracks
      );

      setTopTracks(updatedTracks);
    }
  };

  const handleAmountTracksChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newAmount = Number(event.target.value);
    setAmountTracks(newAmount);
    const updatedTracks = await fetchUpdatedData(
      "tracks",
      timeFrameTracks,
      newAmount
    );
    setTopTracks(updatedTracks);
  };

  const handleTimeFrameArtistsChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTimeFrame = event.target.value;
    if (
      newTimeFrame === "short_term" ||
      newTimeFrame === "medium_term" ||
      newTimeFrame === "long_term"
    ) {
      setTimeFrameArtists(newTimeFrame);
      const updatedArtists = await fetchUpdatedData(
        "artists",
        newTimeFrame,
        amountArtists
      );
      setTopArtists(updatedArtists);
    }
  };

  const playSong = (uri: string) => {
    if (playerData) {
      dispatch(playSongByURI({ songURI: uri }));
    }
  };

  const handleAmountArtistsChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newAmount = Number(event.target.value);
    setAmountArtists(newAmount);
    const updatedArtists = await fetchUpdatedData(
      "artists",
      timeFrameArtists,
      newAmount
    );
    setTopArtists(updatedArtists);
  };

  return (
    <main className={styles.container}>
      {/* Top Tracks Section */}
      <section
        style={{
          backgroundImage:
            topTracks?.length > 0 && topTracks[0]?.album?.images?.length > 0
              ? `url(${topTracks[0]?.album.images[0].url})`
              : "none",
          backgroundSize: topTracks?.length > 0 ? "cover" : "initial",
          backgroundPosition: topTracks?.length > 0 ? "center" : "initial",
          backgroundRepeat: topTracks?.length > 0 ? "no-repeat" : "initial",
        }}
      >
        <div
          className={`${styles.listContainer} ${styles[trackBrightnessClass]}`}
        >
          <div className={styles.listHeader}>
            <h3>TOP TRACKS</h3>
            <div className={styles.listOptions}>
              <div className={styles.listOption}>
                <label htmlFor="timeFrameTracks">Time frame:</label>
                <select
                  name="timeFrameTracks"
                  id="timeFrameTracks"
                  value={timeFrameTracks}
                  onChange={handleTimeFrameTracksChange}
                >
                  <option value="long_term">1 Year</option>
                  <option value="medium_term">6 Months</option>
                  <option value="short_term">1 Month</option>
                </select>
              </div>
              <div className={styles.listOption}>
                <label htmlFor="amountTracks">Show:</label>
                <select
                  name="amountTracks"
                  id="amountTracks"
                  value={amountTracks}
                  onChange={handleAmountTracksChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.list}>
            {topTracks?.length > 0 ? (
              topTracks.map((track: SpotifyTrack, index: number) => (
                <div
                  key={track.id}
                  className={`${styles.listItem} ${
                    playerData ? styles.listItemTrack : ""
                  } ${!playerData ? styles.disabled : ""}`}
                  onMouseEnter={() => setHoveredTrackIndex(index)}
                  onMouseLeave={() => setHoveredTrackIndex(null)}
                  onClick={() => {
                    if (playerData) playSong(track.uri);
                  }}
                >
                  <div className={styles.listItemPosition}>
                    {hoveredTrackIndex === index ||
                    playerData?.item?.uri === track.uri ? (
                      <button onClick={() => playSong(track.uri)}>
                        {playerData?.item?.uri === track.uri ? (
                          <NoteIcon />
                        ) : (
                          <PlayIcon />
                        )}
                      </button>
                    ) : (
                      <p>{index + 1}.</p>
                    )}
                  </div>
                  <div className={styles.listItemImage}>
                    <img
                      src={
                        track.album.images?.length > 0
                          ? track.album.images[0].url
                          : placeholder.src
                      }
                      alt={track.name}
                    />
                  </div>
                  <div className={styles.trackInfo}>
                    <a
                      href={track.external_urls.spotify}
                      target="blank_"
                      className={styles.trackName}
                    >
                      {track.name}
                    </a>
                    <a href={track.album.external_urls.spotify} target="blank_">
                      {" "}
                      {track.album.artists[0].name}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No tracks found</p>
            )}
          </div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section
        style={{
          backgroundImage:
            topArtists?.length > 0 && topArtists[0]?.images?.length > 0
              ? `url(${topArtists[0]?.images[0].url})`
              : "none",
          backgroundSize: topArtists?.length > 0 ? "cover" : "initial",
          backgroundPosition: topArtists?.length > 0 ? "center" : "initial",
          backgroundRepeat: topArtists?.length > 0 ? "no-repeat" : "initial",
        }}
      >
        <div
          className={`${styles.listContainer} ${styles[artistBrightnessClass]}`}
        >
          <div className={styles.listHeader}>
            <h3>TOP ARTISTS</h3>
            <div className={styles.listOptions}>
              <div className={styles.listOption}>
                <label htmlFor="timeFrameArtists">Time frame:</label>
                <select
                  name="timeFrameArtists"
                  id="timeFrameArtists"
                  value={timeFrameArtists}
                  onChange={handleTimeFrameArtistsChange}
                >
                  <option value="long_term">1 Year</option>
                  <option value="medium_term">6 months</option>
                  <option value="short_term">1 Month</option>
                </select>
              </div>
              <div className={styles.listOption}>
                <label htmlFor="amountArtists">Show:</label>
                <select
                  name="amountArtists"
                  id="amountArtists"
                  value={amountArtists}
                  onChange={handleAmountArtistsChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.list}>
            {topArtists?.length > 0 ? (
              topArtists.map((artist: SpotifyArtist, index: number) => (
                <div key={artist.id} className={styles.listItem}>
                  <div className={styles.listItemPosition}>
                    <p>{index + 1}.</p>
                  </div>
                  <div className={styles.listItemImage}>
                    <img
                      src={
                        artist.images?.length > 0
                          ? artist.images[0].url
                          : placeholder.src
                      }
                      alt={artist.name}
                    ></img>
                  </div>
                  <div className={styles.trackInfo}>
                    <a target="blank_" href={artist.external_urls.spotify}>
                      {artist.name}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No artists found</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ToplistsClient;
