import { SpotifyPlaylist, SpotifyPlaylistTrack } from "@/assets/interfaces";
import { mapGenre } from "@/utils/helperFunctions";

interface SpotifyPlaylistTrackResponse {
  items: SpotifyPlaylistTrack[];
  next: string | null;
}

interface SpotifyPlaylistResponse {
  items: SpotifyPlaylist[];
  next: string | null;
}

export const fetchPlaylists = async (
  accessToken: string
): Promise<SpotifyPlaylist[]> => {
  const playlists: SpotifyPlaylist[] = [];
  let url: string | null = `https://api.spotify.com/v1/me/playlists`;

  while (url) {
    const response: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }

    const data: SpotifyPlaylistResponse = await response.json();

    // Accumulate the playlists from the current page
    playlists.push(...data.items);

    // Update the URL to the next page (if exists), otherwise set to null
    url = data.next;
  }

  return playlists;
};

export const fetchPlaylistTracks = async (
  accessToken: string,
  playlistId: string,
  nextTracksUri?: string
): Promise<{
  tracks: SpotifyPlaylistTrack[];
  nextTracksUri: string | null;
}> => {
  const tracks: SpotifyPlaylistTrack[] = [];
  let url: string | null = nextTracksUri || null;

  if (!url) {
    url =
      playlistId === "me"
        ? `https://api.spotify.com/v1/me/tracks?limit=50`
        : `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;
  }

  const response: Response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlist tracks");
  }

  const data: SpotifyPlaylistTrackResponse = await response.json();
  tracks.push(...data.items);

  const artistIds: string[] = Array.from(
    new Set(
      tracks.flatMap((track) => track.track.artists.map((artist) => artist.id))
    )
  );

  const artistGenresMap: { [artistId: string]: string[] } = {};

  // Step 3: Fetch artist data in batches of 50
  const fetchArtistsInBatches = async (artistIdsBatch: string[]) => {
    const artistResponse = await fetch(
      `https://api.spotify.com/v1/artists?ids=${artistIdsBatch.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (artistResponse.ok) {
      const { artists }: { artists: Array<{ id: string; genres: string[] }> } =
        await artistResponse.json();

      // Update artistGenresMap with the fetched artists and their genres
      artists.forEach((artist) => {
        artistGenresMap[artist.id] = artist.genres.map((genre) =>
          mapGenre(genre)
        );
      });
    }
  };

  // Batch the artist IDs in chunks of 50 and fetch them
  const BATCH_SIZE = 50;
  for (let i = 0; i < artistIds.length; i += BATCH_SIZE) {
    const batch = artistIds.slice(i, i + BATCH_SIZE);
    await fetchArtistsInBatches(batch);
  }

  // Step 4: Attach simplified genres to each track's artist
  const tracksWithGenres = tracks.map((track) => {
    const genres = track.track.artists.flatMap(
      (artist) => artistGenresMap[artist.id] || []
    );
    return {
      ...track,
      track: {
        ...track.track,
        genres,
      },
    };
  });

  return { tracks: tracksWithGenres, nextTracksUri: data.next };
};

export const addTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  tracks: string[]
) => {
  const response: Response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracks,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to add tracks: ${response.statusText}`);
  }

  return { success: true };
};

export const deleteTracksFromPlaylist = async (
  accessToken: string,
  playlistId: string,
  tracks: string[]
) => {
  let url: string | null = null;
  if (playlistId === "me") {
    url = `https://api.spotify.com/v1/me/tracks`;
  } else {
    url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  }
  // Transform array of strings to array of objects with "uri" key
  const formattedTracks = tracks.map((track) => ({
    uri: track,
  }));

  const response: Response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracks: formattedTracks, // Use the correctly formatted tracks
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete tracks: ${response.statusText}`);
  }

  return { success: true };
};

export const updatePlaylistDetails = async (
  accessToken: string,
  playlistId: string,
  name: string,
  description: string,
  publicState: boolean
) => {
  console.log("update playlist", playlistId, name, description, publicState);
  const response: Response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: publicState,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update playlist: ${response.statusText}`);
  }

  return { success: true };
};

export const createPlaylist = async (
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  publicState: boolean
) => {
  const response: Response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: publicState,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create paylists: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};
