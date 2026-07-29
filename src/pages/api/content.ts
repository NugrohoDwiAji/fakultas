import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, value } = req.body;

  if (!title || !value) {
    return res.status(400).json({ success: false, error: "Title and value are required" });
  }

  try {
    const result = await prisma.content.create({
      data: { title, value },
    });
    res.status(201).json({ success: true, data: result, message: "Content created" });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ success: false, error: "Error creating content" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.content.findMany();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  res.status(405).json({ success: false, error: "Method not allowed" });
}
