export const fetchPlayer = async (accessToken: string) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch player data");
    }

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching player:", error);
    return null;
  }
};

export const startPlayBack = async (
  accessToken: string,
  contextUri?: string,
  uris?: string[],
  offset?: { uri: string }
) => {
  try {
    console.log("last call");
    console.log(contextUri, uris);

    // Construct the body dynamically based on what is provided
    const body: any = {};

    if (contextUri) {
      body.context_uri = contextUri; // Set context_uri if provided
      body.offset = offset;
    }

    if (uris && uris.length > 0 && !contextUri) {
      body.uris = [uris]; // Set uris if provided
    }

    console.log(JSON.stringify(body));

    // Spotify expects either context_uri or uris, but not both at the same time
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Dynamically constructed body
    });

    return { success: true };
  } catch (error) {
    console.error("Error starting playback:", error);
    throw error;
  }
};

export const stopPlayBack = async (accessToken: string) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error stopping playback:", error);
    throw error;
  }
};

export const skipNext = async (accessToken: string) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/next`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error skipping to next track:", error);
    throw error;
  }
};

export const skipPrevious = async (accessToken: string) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error skipping to previous track:", error);
    throw error;
  }
};

export const toggleShuffle = async (
  accessToken: string,
  state: "true" | "false"
) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling shuffle:", error);
    throw error;
  }
};

export const toggleRepeat = async (
  accessToken: string,
  state: "off" | "track"
) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling repeat:", error);
    throw error;
  }
};

export const seekPosition = async (accessToken: string, position: number) => {
  try {
    await fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error seeking position:", error);
    throw error;
  }
};

export const seekVolume = async (accessToken: string, position: number) => {
  try {
    await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${position}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error changing volume", error);
    throw error;
  }
};
