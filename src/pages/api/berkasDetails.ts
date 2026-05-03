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

// Helper untuk memastikan folder uploads ada
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
  try {
    const result = await prisma.berkas.delete({
      where: { id: id as string },
    });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Error Deleting content" });
  }
};

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;
  try {
    const result = await prisma.berkas.findMany({
      where :{
        title :{
          contains : name as string,
        }
      }
    })
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Error fetching content" });
  }
};

const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  createUploadDir(path.join(process.cwd(), "/public/berkas"));

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public", "berkas"),
    filename: (_, __, part) => {
      return `${part.originalFilename}`;
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

    if (!files.file)
      return res.status(400).json({ error: "File tidak ditemukan" });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/berkas/${file?.originalFilename}`;
    const titletmp = fields.title?.toString();
    const title = titletmp || "utitled";
    const { id } = req.query;

    // ✅ Ambil data lama dari database
    const existing = await prisma.berkas.findUnique({
      where: { id: id as string },
    });

    // ✅ Hapus file lama jika ada
    if (existing?.filepath) {
      const oldPath = path.join(process.cwd(), "public", existing.filepath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const saved = await prisma.berkas.update({
      where: { id: id as string },
      data: {
        title: title,
        filepath: filePath,
      },
    });
    res.status(202).json({ Message: "Update Succes", saved });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ error: "Error saving file" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  if (req.method === "GET") {
    return handleGetById(req, res);
  }
  if (req.method === "PUT") return handlePutMethod(req, res);
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
