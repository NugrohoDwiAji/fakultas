import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const createUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
    const existing = await prisma.berkas.findUnique({
      where: { id: id as string },
    });

    if (existing?.filepath) {
      const oldPath = path.join(process.cwd(), "public", existing.filepath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const result = await prisma.berkas.delete({
      where: { id: id as string },
    });
    res.status(200).json({ success: true, data: result, message: "Berkas deleted" });
  } catch (error) {
    console.error("Error deleting berkas:", error);
    res.status(500).json({ success: false, error: "Error deleting berkas" });
  }
};

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ success: false, error: "Name query is required" });
  }

  try {
    const result = await prisma.berkas.findMany({
      where: {
        title: { contains: name as string },
      },
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching berkas:", error);
    res.status(500).json({ success: false, error: "Error fetching berkas" });
  }
};

const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadPath = path.join(process.cwd(), "public", "uploads", "berkas");
  createUploadDir(uploadPath);

  const form = formidable({
    uploadDir: uploadPath,
    filename: (_, __, part) => {
      return `${Date.now()}-${part.originalFilename}`;
    },
  });

  try {
    const { fields, files } = await new Promise<{
      fields: Fields;
      files: Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).json({ success: false, error: "File is required" });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, error: "ID is required" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/berkas/${path.basename(file.filepath)}`;
    const title = fields.title?.toString() || "untitled";

    const existing = await prisma.berkas.findUnique({
      where: { id: id as string },
    });

    if (existing?.filepath) {
      const oldPath = path.join(process.cwd(), "public", existing.filepath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const saved = await prisma.berkas.update({
      where: { id: id as string },
      data: {
        title,
        filepath: filePath,
      },
    });
    res.status(200).json({ success: true, data: saved, message: "Berkas updated" });
  } catch (error) {
    console.error("Error updating berkas:", error);
    res.status(500).json({ success: false, error: "Error updating berkas" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetById(req, res);
  }
  if (req.method === "PUT") {
    return handlePutMethod(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  res.status(405).json({ success: false, error: "Method not allowed" });
}
