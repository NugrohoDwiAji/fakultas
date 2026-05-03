import { NextApiRequest, NextApiResponse } from "next";
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



const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  createUploadDir(path.join(process.cwd(), "/public/pengumuman"));

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public", "pengumuman"),
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
    const filePath = `/pengumuman/${file?.originalFilename}`;
    const titletmp = fields.title?.toString();
    const title = titletmp || "utitled";
    const {id} = req.query;

   // ✅ Ambil data lama dari database
    const existing = await prisma.pengumuman.findUnique({
      where: { id: id as string },
    });

    // ✅ Hapus file lama jika ada
    if (existing?.file_path) {
      const oldPath = path.join(process.cwd(), "public", existing.file_path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const saved = await prisma.pengumuman.update({
        where:{id : id as string},
      data: {
        title: title,
        file_path: filePath,
      },
    });
    res.status(202).json({Message:"Update Succes",saved});
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ error: "Error saving file" });
  }
};





const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const result = await prisma.pengumuman.findUnique({
      where: { id: id as string },
    });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Error fetching content" });
  }
};


export default function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === "GET") {
    return handleGetById(req, res);
  }
  if(req.method === "PUT"){
    handlePutMethod(req, res);
  }
 else {
    res.status(405).json({ message: "Method not allowed" });
  }
}