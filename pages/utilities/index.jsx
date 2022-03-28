import Link from "next/link";

export default function UtilitiesHome () {
  return (
    <div>
      <Link href="/utilities/spotify-discord-listen-along" passHref>
        <a>
          <h2>Spotify-Discord Listen Along</h2>
          <p>
            This tool uses the Spotify access token that comes from
            your Spotify connection with Discord to bypass the Premium
            limitations concerning playback API.
          </p>
        </a>
      </Link>
    </div>
  );
}