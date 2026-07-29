import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handleGetContentById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID is required" });
  }

  try {
    const result = await prisma.content.findUnique({
      where: { id: id as string },
    });

    if (!result) {
      return res.status(404).json({ success: false, error: "Content not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

const handleUpdateContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { title, value } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID is required" });
  }

  if (!title || !value) {
    return res.status(400).json({ success: false, error: "Title and value are required" });
  }

  try {
    const result = await prisma.content.update({
      where: { id: id as string },
      data: { title, value },
    });
    res.status(200).json({ success: true, data: result, message: "Content updated" });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ success: false, error: "Error updating content" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGetContentById(req, res);
  }
  if (req.method === "PUT") {
    return handleUpdateContent(req, res);
  }
  res.status(405).json({ success: false, error: "Method not allowed" });
}
