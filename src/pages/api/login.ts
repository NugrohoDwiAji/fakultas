import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required" });
    }

    const userData = await prisma.user.findUnique({
      where: { username },
    });

    if (!userData) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const passwordValidate = await bcrypt.compare(password, userData.password);
    if (!passwordValidate) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    const jwtToken = jwt.sign(
      { id: userData.id, username },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.setHeader(
      "Set-Cookie",
      `jwt=${jwtToken}; Path=/; SameSite=strict; HttpOnly; Max-Age=${60 * 60}`
    );

    return res.status(200).json({
      success: true,
      message: "Login success",
      data: { token: jwtToken, username: userData.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
