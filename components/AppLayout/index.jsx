import useSWR from "swr";

export default function AppLayout ({ children }) {
  const { data: user, error, loading } = useSWR("/api/me");

  if (!error && loading) return (
    <div>
      <h2>Loading data...</h2>
    </div>
  );

  return (
    <div>
      {user ? (
        <p>Authenticated</p>
      ) : (
        <div>
          <p>Login</p>
        </div>
      )}
      
      {children}
    </div>
  );
}
