import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchPlayer,
  controlPlayer,
  toggleShuffle,
  toggleRepeat,
  seekPlayer,
  changeVolume,
  setProgress,
  setPreviousVolume,
  playSongByURI,
} from "../../../redux/musicPlayerSlice";
import styles from "./MusicPlayer.module.css";
import Image from "next/image";
import PlayIcon from "@/assets/icons/PlayIcon";
import StopIcon from "@/assets/icons/StopIcon";
import SkipNextIcon from "@/assets/icons/SkipNextIcon";
import SkipPreviousIcon from "@/assets/icons/SkipPreviousIcon";
import ShuffleIcon from "@/assets/icons/ShuffleIcon";
import ShuffleOnIcon from "@/assets/icons/ShuffleOnIcon";
import RepeatIcon from "@/assets/icons/RepeatIcon";
import VolumeIcon from "@/assets/icons/VolumeIcon";
import MuteIcon from "@/assets/icons/MuteIcon";

const MusicPlayerClient = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);

  const { playerData, progress, volume, previousVolume } = useSelector(
    (state: RootState) => state.musicPlayer
  );
  const { sortedTracks, selectedPlaylist } = useSelector(
    (state: RootState) => state.playlists
  );

  useEffect(() => {
    if (!playerData) {
      dispatch(fetchPlayer());
    }
  }, [dispatch, playerData]);

  // Update the song progress manually
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (playerData?.is_playing) {
      interval = setInterval(() => {
        dispatch(setProgress(progress + 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }; // Return a proper cleanup function
  }, [playerData, progress, dispatch]);

  const handleOption = (
    type: "play" | "stop" | "skipNext" | "skipPrevious"
  ) => {
    dispatch(controlPlayer(type));
  };

  const handleShuffle = () => {
    dispatch(toggleShuffle(playerData.shuffle_state));
  };

  const handleRepeat = () => {
    dispatch(toggleRepeat(playerData.repeat_state));
  };

  const handleSpotifyOpen = async () => {
    window.open("https://open.spotify.com/", "_blank");

    setIsFetching(true);
    setTimeout(() => {
      dispatch(fetchPlayer());
      setIsFetching(false);
    }, 10000);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPosition =
      (clickX / progressBar.clientWidth) * playerData.item.duration_ms;
    dispatch(seekPlayer(Math.floor(newPosition)));
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = (clickX / volumeBar.clientWidth) * 100;
    dispatch(changeVolume(newVolume));
  };

  const mute = () => {
    if (volume === 0 && previousVolume !== null) {
      dispatch(changeVolume(previousVolume));
      dispatch(setPreviousVolume(null));
    } else {
      dispatch(setPreviousVolume(volume));
      dispatch(changeVolume(0));
    }
  };

  const progressPercentage = (progress / playerData?.item?.duration_ms) * 100;

  const playSong = useCallback(
    (uri: string) => {
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
    },
    [dispatch, playerData, selectedPlaylist]
  );

  const handleSkipNext = useCallback(() => {
    if (
      sortedTracks.length > 0 &&
      playerData.repeat_state === "off" &&
      !playerData.shuffle_state
    ) {
      const currentIndex = sortedTracks.findIndex(
        (track) => track.track.uri === playerData.item.uri
      );
      const nextIndex = (currentIndex + 1) % sortedTracks.length;
      const nextTrackURI = sortedTracks[nextIndex]?.track.uri;

      if (nextTrackURI) {
        playSong(nextTrackURI);
      }
    } else {
      dispatch(controlPlayer("skipNext"));
    }
  }, [
    dispatch,
    playSong,
    playerData?.item.uri,
    playerData?.repeat_state,
    playerData?.shuffle_state,
    sortedTracks,
  ]);

  const handleSkipPrevious = () => {
    if (
      sortedTracks.length > 0 &&
      playerData.repeat_state === "off" &&
      !playerData.shuffle_state
    ) {
      console.log("inside");
      const currentIndex = sortedTracks.findIndex(
        (track) => track.track.uri === playerData.item.uri
      );
      const previousIndex =
        (currentIndex - 1 + sortedTracks.length) % sortedTracks.length;

      const previousTrackURI = sortedTracks[previousIndex]?.track.uri;

      console.log(previousTrackURI);

      if (previousTrackURI) {
        playSong(previousTrackURI);
      }
    } else {
      dispatch(controlPlayer("skipPrevious"));
    }
  };

  useEffect(() => {
    if (playerData && progress >= playerData.item.duration_ms) {
      handleSkipNext();
    }
  }, [handleSkipNext, playerData, progress]);

  return (
    <>
      {playerData ? (
        <>
          <div className={styles.info}>
            <Image
              src={playerData?.item?.album?.images[0].url}
              width={40}
              height={40}
              alt="Album cover"
            />
            <div className={styles.infoText}>
              <p>{playerData.item?.name}</p>
              <p>{playerData.item?.artists[0]?.name}</p>
            </div>
          </div>
          <div className={styles.player}>
            <div className={styles.playerOptions}>
              <button
                onClick={handleShuffle}
                disabled={selectedPlaylist === null}
              >
                {playerData.shuffle_state ? (
                  <ShuffleOnIcon color={"red"} />
                ) : (
                  <ShuffleIcon />
                )}
              </button>
              <button onClick={handleSkipPrevious}>
                <SkipPreviousIcon />
              </button>
              {playerData.is_playing ? (
                <button onClick={() => handleOption("stop")}>
                  <StopIcon size="30px" />
                </button>
              ) : (
                <button onClick={() => handleOption("play")}>
                  <PlayIcon size="30px" />
                </button>
              )}
              <button onClick={handleSkipNext}>
                <SkipNextIcon />
              </button>
              <button onClick={handleRepeat}>
                <RepeatIcon
                  color={playerData.repeat_state !== "off" ? "red" : undefined}
                />
              </button>
            </div>
            <div className={styles.playerProgress}>
              <p>{formatTime(progress)}</p>
              <div className={styles.playerProgressBar} onClick={handleSeek}>
                <div
                  className={styles.progressFilled}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p>{formatTime(playerData.item?.duration_ms)}</p>
            </div>
          </div>
          <div className={styles.volume}>
            <button onClick={mute}>
              {volume !== 0 ? <VolumeIcon size="20px" /> : <MuteIcon />}
            </button>
            <div className={styles.volumeProgress} onClick={handleVolume}>
              <div
                className={styles.volumeFilled}
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
        </>
      ) : (
        <button onClick={handleSpotifyOpen}>
          {isFetching
            ? "Fetching Player Data..."
            : "Open Spotify & start playing a song then refresh"}
        </button>
      )}
    </>
  );
};

// Helper function to format time in ms to mm:ss
const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
};

export default MusicPlayerClient;
