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

    const title = fields.title?.toString();

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/berkas/${path.basename(file.filepath)}`;

    const saved = await prisma.berkas.create({
      data: {
        title,
        filepath: filePath,
      },
    });
    res.status(201).json({ success: true, data: saved, message: "Berkas created" });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ success: false, error: "Error saving file" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.berkas.findMany();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching berkas:", error);
    res.status(500).json({ success: false, error: "Error fetching berkas" });
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
