import create from "zustand";

export const useSpotifyDiscordUsersStore = create(set => ({
  spotify_accounts: [],
  discord_token: "",
  setSpotifyAccounts: (loaded_spotify_accounts) => set(() => ({
   spotify_accounts: loaded_spotify_accounts
  })),
  setDiscordToken: (defined_discord_token) => set(() => ({
    discord_token: defined_discord_token
  }))
}));