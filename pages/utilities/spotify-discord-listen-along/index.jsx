import { useEffect, useState } from "react";
import Router from "next/router";

import {
  useSpotifyDiscordUsersStore
} from "utils/web/utilities/spotify-discord/spotifyDiscordUsersStore";

export default function SpotifyDiscordListenAlongHome () {
  const { discord_token, spotify_accounts } = useSpotifyDiscordUsersStore();

  useEffect(() => {
    if (!discord_token) {
      console.info("`discord_token` not found, redirect to login page.");
      Router.replace(
        "/utilities/spotify-discord-listen-along/login"
      );
    }

    console.info(`[useEffect] Found ${spotify_accounts.length} Spotify accounts.`);
  }, [discord_token, spotify_accounts]);

  // - // Connecting to a new Spotify WS session.
  const [currentSpotifySocket, setCurrentSpotifySocket] = useState(null);
  const [spotifySocketPingInterval, setSpotifySocketPingInterval] = useState(null);
  const handleSpotifyNewSocket = async (account_index) => {
    // If a Spotify session was already connected,
    // we close it before creating a new one.
    if (currentSpotifySocket) { 
      currentSpotifySocket.close();
      console.info("[SpotifySocket] Closed current socket.");
    }
    
    console.info("[SpotifySocket] Creating a new socket.");
    const spotify_socket = new WebSocket(
      `wss://dealer.spotify.com/?access_token=${spotify_accounts[account_index].access_token}`
    );

    spotify_socket.addEventListener("open", () => {
      setCurrentSpotifySocket(spotify_socket);
      console.info("[SpotifySocket] Connected to socket.");

      if (spotifySocketPingInterval)
        clearInterval(spotifySocketPingInterval);

      /** Pinging Spotify every 30s. */
      const ping_interval = setInterval(() => {
        console.info("[SpotifySocket] Ping Spotify.")

        spotify_socket.send(JSON.stringify({
          type: "ping"
        }));
      }, 30_000);

      setSpotifySocketPingInterval(ping_interval);
      console.info("[SpotifySocket] Ping interval was setup for every 30s.");
    });

    spotify_socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "pong":
          console.info("[SpotifySocket] Pong received.");
          break;
        default:
          console.info("[SpotifySocket] Can't undestand this message.", data);
      }
    });
  }

  return (
    <div>
      <h1>Spotify+Discord - Listen Along</h1>

      {spotify_accounts.length > 0
        ? <div>
          {spotify_accounts.map((account, account_index) =>
            <a
              key={account.id}
              onClick={() => handleSpotifyNewSocket(account_index)}  
            >
              Use {account.name} ({account.id})
            </a>
          )}
        </div>
        : <div>
          <h2>You don&apos;t have any connected Spotify account to your Discord account.</h2>
        </div>
      }
    </div>
  );
}