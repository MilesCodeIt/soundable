import got, { HTTPError } from "got";

export default async function handler (req, res) {
  if (req.method !== "POST") return res.status(404).json({
    success: false,
    message: "Method doesn't exist."
  });
  
  const { discord_token } = req.body;
  if (!discord_token) return res.status(401).json({
    success: false,
    message: "`discord_token` missing."
  });

  const { spotify_user_id } = req.body;
  if (!spotify_user_id) return res.status(401).json({
    success: false,
    message: "`spotify_user_id` missing."
  });

  try {
    const data = await got.get(
      `https://discord.com/api/v9/users/@me/connections/spotify/${spotify_user_id}/access-token`,
      {
        headers: {
          "Authorization": discord_token
        }
      }
    ).json();

    const { access_token } = data;
    return res.status(200).json({
      success: true,
      access_token
    });
  }
  catch (e) {
    if (e instanceof HTTPError) {
      const body = e.response.body;

      return res.status(e.response.statusCode).json({
        success: false,
        message: "HTTP Error, response attached.",
        debug: {
          body
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "A server-side error occurred."
    });
  }
}