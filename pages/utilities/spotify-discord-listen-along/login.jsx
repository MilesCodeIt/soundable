import { useState } from "react";
import ky, { HTTPError } from "ky";
import { useRouter } from "next/router";

import {
  useSpotifyDiscordUsersStore
} from "utils/web/utilities/spotify-discord/spotifyDiscordUsersStore";

export default function SpotifyDiscordListenAlongLogin () {
  const [tempDiscordToken, setTempDiscordToken] = useState("");
  const router = useRouter();

  const {
    setDiscordToken,
    setSpotifyAccounts
  } = useSpotifyDiscordUsersStore();

  const handleConnection = async (e) => {
    e.preventDefault();
    
    try {
      console.info("[handleConnection] Trying to connect to Discord and grab Spotify connections.");

      const token = tempDiscordToken.replace(/"/gm, "");
      const data = await ky.post(
        "/api/utilities/spotify-discord-listen-along/spotifyAccountsFromDiscord",
        {
          json: {
            discord_token: token
          }
        }
      ).json();
  
      // Save data to local store.
      setDiscordToken(token);
      setSpotifyAccounts(data.spotify_accounts);
      console.info("[zustand] Saved locally into store. Redirecting...");

      // Redirect to main page.
      router.push(
        "/utilities/spotify-discord-listen-along"
      );
    }
    catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json();
        return console.error("HTTP Error:", body);
      }
    }
  }

  return (
    <div>
      <h1>Spotify+Discord Listen Along</h1>

      <div>
        <h2>Connect into Discord</h2>
        <p>
          Before we could get an access_token for Spotify,
          you should <a href="https://gist.github.com/Vexcited/94b9691653195d6ce3b9df6bc8dabe0f">give a token of your Discord account</a> and make 
          sure you have connected your Spotify account to Discord.
        </p>

        <p>
          Disclaimer: We don&apos;t stole user account, for proof,
          <a href="https://github.com/MilesCodeIt/Soundable">here is the source code of the page</a>.
        </p>

        <p>
          Token aren&apos;t saved by anyone, if you reload this page, you should
          give your token again because we don&apos;t save anything.
        </p>

        <form onSubmit={handleConnection}>
          <input
            type="password"
            value={tempDiscordToken}
            onChange={(e) => setTempDiscordToken(e.target.value)}
            placeholder="DISCORD.TOKEN.XXX (will be hidden)"
          />

          <button type="submit">
            Connect to Discord
          </button>
        </form>
      </div>
    </div>
  )
}