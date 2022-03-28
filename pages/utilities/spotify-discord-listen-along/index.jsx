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
  const handleSpotifyNewSocket = async () => {
    // If a Spotify session was already connected,
    // we close it before creating a new one.
    if (currentSpotifyWsConnection) { 
      currentSpotifySocket.close();
    }

    const spotify_socket = new WebSocket(
      `wss://dealer.spotify.com/?access_token=${spotify_accounts[account_to_use_index].access_token}`
    );
  }

  return (
    <div>
      <h1>Spotify+Discord - Listen Along</h1>

      {spotify_accounts.length > 0
        ? <div>
          {spotify_accounts.map((account) =>
            <p key={account.id}>Use {account.name} ({account.id})</p>
          )}
        </div>
        : <div>
          <h2>You don&apos;t have any connected Spotify account to your Discord account.</h2>
        </div>
      }
    </div>
  );
}