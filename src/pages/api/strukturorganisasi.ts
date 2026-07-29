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

const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const uploadPath = path.join(process.cwd(), "public", "uploads", "img");
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
    const { files } = await new Promise<{
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
    const filePath = `/uploads/img/${path.basename(file.filepath)}`;

    const saved = await prisma.identitas.update({
      where: { name: "Struktur Organisasi" },
      data: {
        value: filePath,
      },
    });

    return res.status(200).json({ success: true, data: saved, message: "Struktur organisasi berhasil diupdate" });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ success: false, error: "Error saving file" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.identitas.findMany();
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
  if (req.method === "PUT") {
    return handlePutMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
