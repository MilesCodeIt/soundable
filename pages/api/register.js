import connectDatabase from "utils/api/connectDatabase";
import User from "models/User";

import bcrypt from "bcryptjs";

export default async function handler (req, res) {
  if (req.method === "POST") {
    const { username, password, email } = req.body;
    if (!username || !password) return res.status(400).json({
      success: false,
      message: "Invalid body form."
    });

    // Connect to MongoDB.
    await connectDatabase();

    const existUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existUser) return res.status(401).json({
      success: false,
      message: `${existUser.email === email ? "E-mail" : "Username"} is already taken.`
    });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(200).json({
      success: true,
      user: createdUser
    });
  }

  res.status(404).json({
    success: false
  });
}
