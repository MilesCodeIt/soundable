import connectDatabase from "utils/api/connectDatabase";
import User from "models/User";

export default async function handler (req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({
      success: false,
      message: "Invalid body form."
    });

    // Connect to MongoDB.
    await connectDatabase();

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({
      success: false,
      message: "User not found."
    });
    
    
  }

  res.status(404).json({
    success: false
  });
}
