import ky from "ky";

export const get_player = async ({ access_token }) => {
  try {
    const response = await ky.get("https://api.spotify.com/v1/me/player", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })

    if (response.status === 204) {
      return {
        success: true,
        data: null
      };
    }
    else if (response.status === 200) {
      return {
        success: true,
        data: await response.json()
      };
    }
  }
  catch (e) {
    return {
      success: false
    };
  }
}

/**
 * Subscribing to Spotify events in our socket.
 * 
 * `connection_id` is the ID given when connecting
 * to Spotify socket. 
 */
export const subscribe_player_events = async ({ access_token, connection_id }) => {
  try {
    await ky.put(
      `https://api.spotify.com/v1/me/notifications/player?connection_id=${connection_id}`,
      {
        headers: {
        "Authorization": `Bearer ${access_token}`
        }
      }
    );

    return {
      success: true
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const get_devices = async ({ access_token }) => {
  try {
    const response = await ky.get("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    }).json()
    
    return {
      success: true,
      data: response.devices
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const refresh_spotify_token = async ({ discord_token, spotify_user_id }) => {
  try {
    const response = await ky.post("/api/utilities/spotify-discord-listen-along/refresh_spotify_token", {
      json: {
        discord_token, spotify_user_id
      }
    }).json();
    
    return {
      success: true,
      access_token: response.access_token
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const get_spotify_accounts = async ({ discord_token }) => {
  try {
    const response = await ky.post("/api/utilities/spotify-discord-listen-along/spotify_accounts", {
      json: {
        discord_token
      }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const pause_playback = async ({ access_token }) => {
  try {
    const response = await ky.put("https://api.spotify.com/v1/me/player/pause", {
      headers: { "Authorization": `Bearer ${access_token}` }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const resume_playback = async ({ access_token }) => {
  try {
    const response = await ky.put("https://api.spotify.com/v1/me/player/play", {
      headers: { "Authorization": `Bearer ${access_token}` }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const start_playback = async ({ access_token, spotify_uri, position = 0, start_time = 0 }) => {
  try {
    const response = await ky.put("https://api.spotify.com/v1/me/player/play", {
      headers: { "Authorization": `Bearer ${access_token}` },
      json: {
        context_uri: spotify_uri,
        offset: {
          position: position
        },
        position_ms: start_time
      }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const next_song = async ({ access_token }) => {
  try {
    const response = await ky.post("https://api.spotify.com/v1/me/player/next", {
      headers: { "Authorization": `Bearer ${access_token}` }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}

export const previous_song = async ({ access_token }) => {
  try {
    const response = await ky.post("https://api.spotify.com/v1/me/player/previous", {
      headers: { "Authorization": `Bearer ${access_token}` }
    }).json();
    
    return {
      success: true,
      data: response
    };
  }
  catch (e) {
    return {
      success: false
    };
  }
}