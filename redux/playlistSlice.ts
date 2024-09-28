import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SpotifyPlaylist, SpotifyPlaylistTrack } from "@/assets/interfaces";

interface PlaylistsState {
  playlists: SpotifyPlaylist[];
  selectedPlaylist: SpotifyPlaylist | null;
  tracks: SpotifyPlaylistTrack[];
  filteredTracks: SpotifyPlaylistTrack[];
  sortedTracks: SpotifyPlaylistTrack[];
  selectedTracks: string[];
  confirmPopup: boolean;
  confirmDelete: boolean;
  notificationMessage: string | null;
  searchTerm: string;
  sortBy: "name" | "added_at" | "release_date" | "popularity" | "artist";
  sortAscending: boolean;
  selectedGenre: string | null;
  loading: boolean;
  genres: string[];
  nextTracksUri: string | null;
  showSidebar: boolean;
}

const initialState: PlaylistsState = {
  playlists: [],
  selectedPlaylist: null,
  tracks: [],
  filteredTracks: [],
  sortedTracks: [],
  selectedTracks: [],
  confirmPopup: false,
  confirmDelete: false,
  notificationMessage: null,
  searchTerm: "",
  sortBy: "added_at",
  sortAscending: false,
  selectedGenre: null,
  loading: false,
  genres: [],
  nextTracksUri: null,
  showSidebar: true,
};

// Thunks for fetching playlists and tracks with credentials included
export const fetchPlaylists = createAsyncThunk(
  "playlists/fetchPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/spotify/playlists?type=playlists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const playlists = await response.json();
      return playlists;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

let currentFetchTracksController: AbortController | null = null;

export const fetchPlaylistTracks = createAsyncThunk(
  "playlists/fetchPlaylistTracks",
  async (
    {
      playlistId,
      nextTracksUri,
    }: { playlistId: string; nextTracksUri: string | null },
    { rejectWithValue }
  ) => {
    // If there's an ongoing fetch, abort it
    if (currentFetchTracksController) {
      currentFetchTracksController.abort();
    }

    // Create a new AbortController for the new request
    currentFetchTracksController = new AbortController();
    const signal = currentFetchTracksController.signal;

    const uri = nextTracksUri
      ? `/api/spotify/playlists?type=tracks&nextUri=${encodeURIComponent(
          nextTracksUri
        )}`
      : `/api/spotify/playlists?type=tracks&playlistId=${playlistId}`;

    try {
      const response = await fetch(uri, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal, // Attach the abort signal
      });

      if (!response.ok) {
        return rejectWithValue(response.status);
      }

      const data = await response.json();
      return {
        tracks: data.data.tracks,
        nextTracksUri: data.data.nextTracksUri,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }

        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    } finally {
      currentFetchTracksController = null;
    }
  }
);

export const addTracksToPlaylist = createAsyncThunk(
  "playlists/addTracksToPlaylist",
  async (
    {
      playlistId,
      selectedTracks,
    }: { playlistId: string; selectedTracks: string[] },
    { rejectWithValue }
  ) => {
    try {
      if (selectedTracks.length === 0) {
        return rejectWithValue({ message: "No tracks selected", type: 400 });
      }

      const response = await fetch(
        `/api/spotify/playlists?type=addTracks&playlistId=${playlistId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tracks: selectedTracks }),
        }
      );

      if (!response.ok) {
        return rejectWithValue(response.status);
      }

      return "Tracks added to playlist";
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTracksFromPlaylist = createAsyncThunk(
  "playlists/deleteTracksFromPlaylist",
  async (
    {
      playlistId,
      tracksToDelete,
    }: { playlistId: string; tracksToDelete: string[] },
    { rejectWithValue }
  ) => {
    try {
      if (tracksToDelete.length === 0) {
        return rejectWithValue({ message: "No tracks to delete", type: 400 });
      }

      const response = await fetch(
        `/api/spotify/playlists?type=deleteTracks&playlistId=${playlistId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tracks: tracksToDelete }),
        }
      );
      if (!response.ok) {
        return rejectWithValue(response.status);
      }

      return tracksToDelete;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

export const selectPlaylistAndFetchTracks = createAsyncThunk(
  "playlists/selectPlaylistAndFetchTracks",
  async (playlist: SpotifyPlaylist | null, { dispatch, rejectWithValue }) => {
    try {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        new Promise<void>((resolve) => {
          dispatch(setSelectedPlaylist(playlist));
          resolve();
        })
          .then(() => {
            const playlistId = playlist ? playlist.id : "me";
            return dispatch(
              fetchPlaylistTracks({ playlistId, nextTracksUri: null })
            ).unwrap();
          })
          .catch((error) => {
            return rejectWithValue(error);
          });
      }, 700);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePlaylistDetails = createAsyncThunk(
  "playlists/updatePlaylistDetails",
  async (
    {
      playlistId,
      name,
      description,
      publicState,
    }: {
      playlistId: string;
      name: string;
      description: string | null;
      publicState: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/spotify/playlists?type=updatePlaylist&playlistId=${playlistId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, description, publicState }),
        }
      );
      if (!response.ok) {
        return rejectWithValue(response.status);
      }

      return { playlistId, name, description, publicState };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlists/createPlaylist",
  async (
    {
      userId,
      name,
      description,
      publicState,
    }: {
      userId: string;
      name: string;
      description: string | null;
      publicState: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/spotify/playlists?type=createPlaylist&userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, description, publicState }),
        }
      );
      if (!response.ok) {
        return rejectWithValue(response.status);
      }

      const data = response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Function to filter and sort tracks
const filterAndSortTracks = (state: PlaylistsState) => {
  // Filter tracks based on search term and genre
  const filteredTracks = state.tracks.filter((track) => {
    const trackName = track.track.name.toLowerCase();
    const artistNames = track.track.artists
      .map((artist) => artist.name.toLowerCase())
      .join(" ");
    const genres =
      track.track.genres?.map((genre) => genre.toLowerCase()) || [];

    const matchesSearchTerm =
      trackName.includes(state.searchTerm.toLowerCase()) ||
      artistNames.includes(state.searchTerm.toLowerCase());

    const matchesGenre = state.selectedGenre
      ? genres.includes(state.selectedGenre.toLowerCase())
      : true;

    return matchesSearchTerm && matchesGenre;
  });

  // Sort tracks based on the current sorting criteria
  const sortedTracks = filteredTracks.sort((a, b) => {
    let comparison = 0;

    if (state.sortBy === "name") {
      comparison = a.track.name.localeCompare(b.track.name);
    } else if (state.sortBy === "added_at") {
      comparison =
        new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
    } else if (state.sortBy === "release_date") {
      comparison =
        new Date(a.track.album.release_date).getTime() -
        new Date(b.track.album.release_date).getTime();
    } else if (state.sortBy === "popularity") {
      comparison = a.track.popularity - b.track.popularity;
    } else if (state.sortBy === "artist") {
      comparison = a.track.artists[0].name.localeCompare(
        b.track.artists[0].name
      );
    }

    return state.sortAscending ? comparison : -comparison;
  });

  // Update the state
  state.filteredTracks = filteredTracks;
  state.sortedTracks = sortedTracks;
};

// Create the slice
const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setSelectedPlaylist(state, action: PayloadAction<SpotifyPlaylist | null>) {
      state.selectedPlaylist = action.payload;
      state.selectedTracks = [];
      state.tracks = [];
      state.nextTracksUri = null;
      state.selectedGenre = null;
      state.searchTerm = "";
      filterAndSortTracks(state);
    },

    setSelectedTracks(state, action: PayloadAction<string[]>) {
      state.selectedTracks = action.payload;
    },
    setConfirmPopup(state, action: PayloadAction<boolean>) {
      state.confirmPopup = action.payload;
    },
    setConfirmDelete(state, action: PayloadAction<boolean>) {
      state.confirmDelete = action.payload;
    },
    setNotificationMessage(state, action: PayloadAction<string | null>) {
      state.notificationMessage = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      filterAndSortTracks(state);
    },
    setSortBy(
      state,
      action: PayloadAction<
        "name" | "added_at" | "release_date" | "popularity" | "artist"
      >
    ) {
      state.sortBy = action.payload;
      filterAndSortTracks(state);
    },
    setSortAscending(state) {
      state.sortAscending = !state.sortAscending;
      filterAndSortTracks(state);
    },
    toggleSidebar(state) {
      state.showSidebar = !state.showSidebar;
    },
    setSelectedGenre(state, action: PayloadAction<string | null>) {
      state.selectedGenre = action.payload;
      filterAndSortTracks(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlists = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchPlaylistTracks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylistTracks.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        const { tracks, nextTracksUri } = action.payload;

        // Filter out any tracks that are already in the state
        const uniqueTracks = tracks.filter(
          (newTrack: SpotifyPlaylistTrack) =>
            !state.tracks.some(
              (track) => track.track.uri === newTrack.track.uri
            )
        );

        // Append only unique tracks to the existing tracks
        state.tracks = [...state.tracks, ...uniqueTracks];
        state.nextTracksUri = nextTracksUri;

        filterAndSortTracks(state);

        state.genres = Array.from(
          new Set(
            state.tracks?.flatMap(
              (track: SpotifyPlaylistTrack) => track.track.genres || []
            ) || []
          )
        );
        state.loading = false;
      })

      .addCase(addTracksToPlaylist.fulfilled, (state, action) => {
        state.notificationMessage = action.payload;
        state.confirmPopup = false;
      })

      .addCase(deleteTracksFromPlaylist.fulfilled, (state, action) => {
        state.tracks =
          state.tracks?.filter(
            (track) => !action.payload.includes(track.track.uri)
          ) || null;
        state.notificationMessage = "Selected tracks deleted from playlist";
        state.selectedTracks = [];
        state.confirmDelete = false;
        filterAndSortTracks(state);
      })
      .addCase(updatePlaylistDetails.fulfilled, (state, action) => {
        const { playlistId, name, description, publicState } = action.payload;

        // Find the playlist to update within the playlists array
        const playlistIndex = state.playlists.findIndex(
          (playlist) => playlist.id === playlistId
        );

        if (playlistIndex !== -1) {
          // Update the playlist details in the state
          state.playlists[playlistIndex] = {
            ...state.playlists[playlistIndex],
            name,
            description,
            public: publicState,
          };
        }

        // If the updated playlist is the currently selected one, update it as well
        if (
          state.selectedPlaylist &&
          state.selectedPlaylist.id === playlistId
        ) {
          state.selectedPlaylist = {
            ...state.selectedPlaylist,
            name,
            description,
            public: publicState,
          };
        }

        // Set a success notification message
        state.notificationMessage = "Playlist updated successfully";
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        console.log("create playlist", action.payload);
        const { data } = action.payload;
        state.playlists = [...state.playlists, data];
      });
  },
});

export const {
  setSelectedPlaylist,
  setSelectedTracks,
  setConfirmPopup,
  setConfirmDelete,
  setNotificationMessage,
  setSearchTerm,
  setSortBy,
  setSortAscending,
  setSelectedGenre,
  toggleSidebar
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
