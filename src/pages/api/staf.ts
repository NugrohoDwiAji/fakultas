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
  const uploadPath = path.join(process.cwd(), "public", "uploads", "staf");
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
    const filePath = `/uploads/staf/${path.basename(file.filepath)}`;
    const nama = fields.nama?.toString();
    const nik = fields.nik?.toString();

    if (!nama) {
      return res.status(400).json({ success: false, error: "Nama wajib diisi" });
    }

    const saved = await prisma.staf.create({
      data: {
        nama,
        nitk: nik || "",
        foto: filePath,
      },
    });

    return res.status(201).json({ success: true, data: saved, message: "Staf berhasil dibuat" });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ success: false, error: "Error saving file" });
  }
};

const handleDeleteMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID wajib diisi" });
  }

  try {
    const existing = await prisma.staf.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Staf tidak ditemukan" });
    }

    if (existing.foto) {
      const oldPath = path.join(process.cwd(), "public", existing.foto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const result = await prisma.staf.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ success: true, data: result, message: "Staf berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return res.status(500).json({ success: false, error: "Error deleting content" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.staf.findMany();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
