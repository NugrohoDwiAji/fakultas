import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body;

  const userData = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!userData) return res.status(400).json({ message: "User not found" });

  const jwtToken = jwt.sign(
    {
      id: userData.id,
      username: username,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",}
  );

  const passwordalidate = await bcrypt.compare(password, userData.password);
  if (!passwordalidate)
    return res.status(400).json({ message: "Password salah" });
  res.setHeader(
    `Set-Cookie`,
    `jwt=${jwtToken}; Path=/; SameSite=strict ; HttpOnly;  Max-Age=${60 * 60}`
  );

  res.status(200).json({
    message: "Login success",
    token: jwtToken,
    username: userData.username,
  });
}
