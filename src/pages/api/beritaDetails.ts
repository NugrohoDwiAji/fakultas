import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID is required" });
  }

  try {
    const result = await prisma.berita.findUnique({
      where: { id: id as string },
    });

    if (!result) {
      return res.status(404).json({ success: false, error: "Berita not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching berita:", error);
    res.status(500).json({ success: false, error: "Error fetching berita" });
  }
};

const handleDeleteMethod = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID is required" });
  }

  try {
    const result = await prisma.berita.delete({
      where: { id: id as string },
    });
    res.status(200).json({ success: true, data: result, message: "Berita deleted" });
  } catch (error) {
    console.error("Error deleting berita:", error);
    res.status(500).json({ success: false, error: "Error deleting berita" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetById(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  res.status(405).json({ success: false, error: "Method not allowed" });
}
