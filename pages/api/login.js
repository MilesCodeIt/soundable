import connectDatabase from "utils/api/connectDatabase";
import User from "models/User";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nookies from "nookies";

export default async function handler (req, res) {
  if (req.method === "POST") {
    const { uid, password } = req.body;
    if (!uid || !password) return res.status(400).json({
      success: false,
      message: "Invalid body form."
    });

    // Connect to MongoDB.
    await connectDatabase();

    const user = await User.findOne({
      $or: [
        { username: uid },
        { email: uid }
      ]
    });

    if (!user) return res.status(401).json({
      success: false,
      message: "User not found."
    });
    
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) return res.status(401).json({
      success: false,
      message: "Password doesn't match."
    });

    const payload = {
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };

    // Expire the token in one week.
    const expiresIn = 60 * 60 * 24 * 7;

    // Create user token.
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn
    });

    // Save user token to cookies.
    nookies.set({ res }, "token", token, {
      sameSite: "strict",
      maxAge: expiresIn,
      httpOnly: true,
      path: "/"
    });

    res.status(200).json({
      success: true,
      payload
    });
  }
  else {
    res.status(404).json({
      success: false
    });
  }
}
