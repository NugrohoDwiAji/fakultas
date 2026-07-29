import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress) as string;
  const userAgent = req.headers["user-agent"] || "";
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ success: false, error: "URL wajib diisi" });
  }

  try {
    await prisma.visit.create({
      data: {
        ipAddress: ip,
        userAgent,
        url,
      },
    });
    return res.status(200).json({ success: true, message: "Tracked" });
  } catch (error) {
    console.error("Tracking error:", error);
    return res.status(500).json({ success: false, error: "Error tracking visit" });
  }
}
