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

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadPath = path.join(process.cwd(), "public", "uploads", "pengumuman");
  createUploadDir(uploadPath);

  const form = formidable({
    uploadDir: uploadPath,
    filename: (_, __, part) => {
      const ext = path.extname(part.originalFilename || "");
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      return name;
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
      return res.status(400).json({ success: false, error: "File tidak ditemukan" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/pengumuman/${path.basename(file.filepath)}`;
    const title = fields.title?.toString();
    const date = fields.uploadat?.toString();

    if (!title) {
      return res.status(400).json({ success: false, error: "Title wajib diisi" });
    }

    const saved = await prisma.pengumuman.create({
      data: {
        title,
        file_path: filePath,
        uploadat: date || new Date().toISOString(),
      },
    });

    return res.status(201).json({ success: true, data: saved, message: "Pengumuman berhasil dibuat" });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ success: false, error: "Error saving file" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.pengumuman.findMany({
      orderBy: {
        uploadat: "desc",
      },
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

const handleDeleteMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID wajib diisi" });
  }

  try {
    const existing = await prisma.pengumuman.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Pengumuman tidak ditemukan" });
    }

    if (existing.file_path) {
      const oldPath = path.join(process.cwd(), "public", existing.file_path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const result = await prisma.pengumuman.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ success: true, data: result, message: "Pengumuman berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return res.status(500).json({ success: false, error: "Error deleting content" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
