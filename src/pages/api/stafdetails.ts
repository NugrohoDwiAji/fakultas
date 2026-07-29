import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.staf.findMany({
      orderBy: { create_at: "desc" },
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
