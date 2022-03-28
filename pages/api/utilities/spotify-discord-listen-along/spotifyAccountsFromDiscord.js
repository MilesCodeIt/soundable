import WebSocket from "ws";

import {
  chromeLinuxUserAgent,
  chromeVersion
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
  
  const get_spotify_accounts = () => new Promise((resolve, reject) => {
    const ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");
    
    ws.on("message", (data) => {
      data = JSON.parse(data);
      
      // We get the first "READY" event that contains
      // data about our connected accounts and we filter
      // them to get only Spotify accounts.
      if (data.t === "READY") {
        const spotify_accounts = data.d.connected_accounts.filter(account => account.type === "spotify");
        
        ws.terminate();
        resolve(spotify_accounts);
      }
    
      // We identify to Discord.
      if (data.op === 10) {
        ws.send(JSON.stringify({
          op: 2,
          d: {
            token: discord_token, 
            properties: {
              os: "Linux",
              browser: "Chrome",
              release_channel: "stable",
              browser_user_agent: chromeLinuxUserAgent,
              browser_version: chromeVersion,
              device: "",
              os_version: "",
              referrer: "",
              referring_domain: "",
              referrer_current: "",
              referring_domain_current: ""
            }
          }
        }));
      }
    });

    ws.addEventListener("error", (event) => {
      reject(event);
    })
  });

  try {
    const spotify_accounts = await get_spotify_accounts();
    res.status(200).json({
      succcess: true,
      spotify_accounts
    });
  }
  catch (e) {
    res.status(403).json({
      success: false,
      message: "An error was throwned by the WebSocket.",
      debug: e
    });
  }
}