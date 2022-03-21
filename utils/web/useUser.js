import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');

    // Attach extra info to the error object.
    error.body = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function useUser () {
  const { data, mutate, error } = useSWR("/api/me", fetcher);

  return {
    data, mutate, error
  }
}
