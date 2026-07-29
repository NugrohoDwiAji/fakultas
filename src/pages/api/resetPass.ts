import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { passNew, passOld } = req.body;

    if (!passNew || !passOld) {
      return res.status(400).json({ success: false, error: "passOld and passNew are required" });
    }

    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const idUser = payload.id;
    const user = await prisma.user.findUnique({ where: { id: idUser } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const passwordValidate = await bcrypt.compare(passOld, user.password);
    if (!passwordValidate) {
      return res.status(400).json({ success: false, error: "Password lama salah" });
    }

    const passwordhash = await bcrypt.hash(passNew, 10);
    const result = await prisma.user.update({
      where: { id: idUser },
      data: { password: passwordhash },
      select: { username: true },
    });

    return res.status(200).json({ success: true, message: "Password updated", data: result });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
