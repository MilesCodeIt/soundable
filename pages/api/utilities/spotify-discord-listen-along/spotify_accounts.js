import got, { HTTPError } from "got";

import {
  chromeLinuxUserAgent
} from "utils/api/httpHelpers";

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

  try {
    /** @type {any[]} */
    const connected_accounts = await got.get("https://discord.com/api/v9/users/@me/connections", {
      headers: {
        "User-Agent": chromeLinuxUserAgent,
        "Authorization": discord_token
      }
    }).json();

    const spotify_accounts = connected_accounts.filter(account => account.type === "spotify");

    res.status(200).json({
      succcess: true,
      spotify_accounts
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