import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import type { ApiResponse, DosenType } from "@/types";

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

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<DosenType>>) => {
  const uploadPath = path.join(process.cwd(), "public", "uploads", "dosen");
  createUploadDir(uploadPath);

  const form = formidable({
    uploadDir: uploadPath,
    filename: (_, __, part) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(part.originalFilename || "");
      return `${uniqueSuffix}${ext}`;
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

    const nama = fields.nama?.toString();
    const nik = fields.nik?.toString();
    const jenis_dosen = fields.jenis_dosen?.toString();

    if (!nama || !nik || !jenis_dosen) {
      return res.status(400).json({ success: false, error: "nama, nik, dan jenis_dosen wajib diisi" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/dosen/${file?.newFilename}`;

    const saved = await prisma.dosen.create({
      data: {
        nama,
        nik,
        jenis_dosen,
        foto: filePath,
      },
    });

    return res.status(201).json({ success: true, data: saved, message: "Dosen berhasil ditambahkan" });
  } catch (error) {
    console.error("Error saving dosen:", error);
    return res.status(500).json({ success: false, error: "Gagal menyimpan data dosen" });
  }
};

const handleDeleteMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "id wajib diisi" });
  }

  try {
    const existing = await prisma.dosen.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Dosen tidak ditemukan" });
    }

    if (existing.foto) {
      const oldPath = path.join(process.cwd(), "public", existing.foto);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await prisma.dosen.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ success: true, message: "Dosen berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting dosen:", error);
    return res.status(500).json({ success: false, error: "Gagal menghapus data dosen" });
  }
};

const handleGetMethod = async (_req: NextApiRequest, res: NextApiResponse<ApiResponse<DosenType[]>>) => {
  try {
    const result = await prisma.dosen.findMany({
      orderBy: { create_at: "desc" },
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return res.status(500).json({ success: false, error: "Gagal mengambil data dosen" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
