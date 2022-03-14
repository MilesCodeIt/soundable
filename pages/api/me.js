import { parseCookies } from "nookies";

export default async function handler (req, res) {
  const cookies = parseCookies({ req });
  const token = cookies.token;

  if (!token) return res.status(401).json({
    success: false,
    message: "Not authenticated"
  });

  
}
