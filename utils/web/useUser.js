import useSWR from "swr";
import ky from "ky";

const fetcher = 

export default function useUser () {
  const { data, mutate, error } = useSWR("/api/me", fetcher);

  const loading = !data && !error;
}
