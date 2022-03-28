import ky from "ky";

export const get_player = async (access_token) => {
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

export const subscribe_player_events