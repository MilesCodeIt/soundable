import ky from "ky";

export const get_player = async ({ access_token }) => {
  try {
    const response = await ky.get("https://api.spotify.com/v1/me/player", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    if (response.status === 204) {
      return {
        success: true,
        data: null
      };
    }
    else if (response.status === 200) {
      return {
        success: true,
        data: JSON.parse(response.body)
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