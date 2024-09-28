import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for the music player
interface MusicPlayerState {
  playerData: any;
  progress: number;
  volume: number;
  previousVolume: number | null;
  loading: boolean;
  error: string | null;
  currentlyPlayingIndex: number | null;
}

const initialState: MusicPlayerState = {
  playerData: null,
  progress: 0,
  volume: 50,
  previousVolume: null,
  loading: false,
  error: null,
  currentlyPlayingIndex: null,
};

// Async thunks for API calls
export const fetchPlayer = createAsyncThunk(
  "musicPlayer/fetchPlayer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/spotify/musicPlayer?type=player`);
      if (response.ok) {
        const { data } = await response.json();
        return data;
      } else {
        return rejectWithValue("Failed to fetch player data");
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const controlPlayer = createAsyncThunk(
  "musicPlayer/controlPlayer",
  async (type: "play" | "stop" | "skipNext" | "skipPrevious", { dispatch }) => {
    const response = await fetch(`/api/spotify/musicPlayer?type=${type}`);
    if (response.ok) {
      setTimeout(() => {
        dispatch(fetchPlayer());
      }, 500);
    }
  }
);

export const toggleShuffle = createAsyncThunk(
  "musicPlayer/toggleShuffle",
  async (shuffleState: boolean, { dispatch }) => {
    const response = await fetch(
      `/api/spotify/musicPlayer?type=shuffle&state=${!shuffleState}`
    );
    if (response.ok) {
      // Add a short delay to ensure Spotify updates its state
      setTimeout(() => {
        dispatch(fetchPlayer());
      }, 500); // Adjust the delay as needed (e.g., 500ms)
    }
  }
);

export const toggleRepeat = createAsyncThunk(
  "musicPlayer/toggleRepeat",
  async (repeatState: "off" | "track", { dispatch }) => {
    const state = repeatState === "off" ? "track" : "off";
    const response = await fetch(
      `/api/spotify/musicPlayer?type=repeat&state=${state}`
    );
    if (response.ok) {
      // Add a short delay to ensure Spotify updates its state
      setTimeout(() => {
        dispatch(fetchPlayer());
      }, 500); // Adjust the delay as needed (e.g., 500ms)
    }
  }
);

export const seekPlayer = createAsyncThunk(
  "musicPlayer/seekPlayer",
  async (position: number, { dispatch }) => {
    const response = await fetch(
      `/api/spotify/musicPlayer?type=seek&position=${position}`
    );
    if (response.ok) {
      // Add a short delay to ensure Spotify updates its state
      setTimeout(() => {
        dispatch(fetchPlayer());
      }, 500); // Adjust the delay as needed (e.g., 500ms)
    }
  }
);

export const changeVolume = createAsyncThunk(
  "musicPlayer/changeVolume",
  async (volume: number, { dispatch }) => {
    const response = await fetch(
      `/api/spotify/musicPlayer?type=volume&position=${Math.floor(volume)}`
    );
    if (response.ok) {
      dispatch(setVolume(volume));
    }
  }
);

// Async thunk to play a specific song by URI or context URI
export const playSongByURI = createAsyncThunk(
  "musicPlayer/playSongByURI",
  async (
    {
      songURI,
      contextUri,
      offset,
    }: {
      songURI?: string;
      contextUri?: string;
      offset?: { uri: string };
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/spotify/musicPlayer?type=play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songUri: songURI, contextUri, offset }),
      });

      if (response.ok) {
        // Add a short delay to allow Spotify to update the player state
        setTimeout(() => {
          dispatch(fetchPlayer());
        }, 500);
      } else {
        return rejectWithValue("Failed to play the song");
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create the slice
const musicPlayerSlice = createSlice({
  name: "musicPlayer",
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setPreviousVolume(state, action: PayloadAction<number | null>) {
      state.previousVolume = action.payload;
    },
    setPlayerData(state, action: PayloadAction<any>) {
      state.playerData = action.payload;
      state.progress = action.payload.progress_ms;
      state.volume = action.payload.device.volume_percent;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.playerData = action.payload;
          state.progress = action.payload.progress_ms;
          state.volume = action.payload.device.volume_percent;
        }
      })
      .addCase(fetchPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the actions
export const { setProgress, setVolume, setPreviousVolume, setPlayerData } =
  musicPlayerSlice.actions;

// Export the reducer
export default musicPlayerSlice.reducer;
