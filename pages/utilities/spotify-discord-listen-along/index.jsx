import { useEffect, useState } from "react";
import Router from "next/router";

import {
  useSpotifyDiscordUsersStore
} from "utils/web/utilities/spotify-discord/spotifyDiscordUsersStore";

import {
  get_player,
  refresh_spotify_token,
  subscribe_player_events,
  get_devices,
  next_song,
  pause_playback,
  previous_song,
  resume_playback
} from "utils/web/utilities/spotify-discord/requests";

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

  const [currentSpotifySocket, setCurrentSpotifySocket] = useState(null);
  const [spotifySocketPingInterval, setSpotifySocketPingInterval] = useState(null);
  const [currentSelectedAccount, setCurrentSelectedAccount] = useState(null);
  
  const [player_apiData, setPlayer_apiData] = useState(null);
  const [devices_apiData, setDevices_apiData] = useState(null);
  
  // - // Connecting to a new Spotify WS session.
  const handleSpotifyNewSocket = async (account_index) => {
    // If a Spotify session was already connected,
    // we close it before creating a new one.
    if (currentSpotifySocket) { 
      setPlayer_apiData(null);
      setDevices_apiData(null);
      setCurrentSelectedAccount(null);

      currentSpotifySocket.close();
      console.info("[SpotifySocket] Closed current socket.");
    }

    setCurrentSelectedAccount(account_index);
    const selected_account = spotify_accounts[account_index];
    const current_player = await get_player({
      access_token: selected_account.access_token
    });

    if (!current_player.success) {
      const new_token_data = await refresh_spotify_token({
        discord_token, spotify_user_id: selected_account.id
      });

      console.info("[RefreshToken] Got a new access_token for Spotify.", new_token_data);
      selected_account.access_token = new_token_data.access_token;

      console.info("[Api-Player] Retrying with new access_token.");
      const current_player = await get_player({
        access_token: selected_account.access_token
      });

      if (current_player.success) setPlayer_apiData(current_player.data);
    } else setPlayer_apiData(current_player.data);

    const access_token = selected_account.access_token;
    const current_devices = await get_devices({ access_token });
    setDevices_apiData(current_devices);
    
    console.info("[SpotifySocket] Creating a new socket for account", selected_account.id);
    const spotify_socket = new WebSocket(
      `wss://dealer.spotify.com/?access_token=${access_token}`
    );

    spotify_socket.onopen = () => {
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
    };

    spotify_socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "pong":
          console.info("[SpotifySocket] Pong received.");
          break;
        case "message":
          const connection_id = data.headers["Spotify-Connection-Id"];
          if (connection_id) {
            await subscribe_player_events({
              access_token, connection_id
            });

            console.info("Subscribed to Spotify events for connection", connection_id);
          }

          const payloads = data.payloads;
          if (payloads) {
            const event = payloads[0].events[0];

            if (event.type === "PLAYER_STATE_CHANGED") {
              console.info("[SpotifySocket] Received new state from player.")
              setPlayer_apiData(event.event.state);
            }
          }
          break;
        default:
          console.info("[SpotifySocket] Can't undestand this message.", data);
      }
    };
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

      {player_apiData &&
        <div>
          <h2>Currently playing: {player_apiData.item.artists.map(artist => artist.name).join(", ")} - {player_apiData.item.name}</h2>

          {/* {JSON.stringify(player_apiData)} */}
        </div>
      }


      {(currentSelectedAccount !== null && spotify_accounts[currentSelectedAccount]) ?
        <div>
          <button
            onClick={() => {
              pause_playback({
                access_token: spotify_accounts[currentSelectedAccount].access_token
              });
            }}
          >
            Pause
          </button>

          <button
            onClick={() => {
              resume_playback({
                access_token: spotify_accounts[currentSelectedAccount].access_token
              });
            }}
          >
            Play
          </button>
        </div>
        : <p>Select an account</p>
      }
    </div>
  );
}