import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import type { ApiResponse, IdentitasType } from "@/types";

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<IdentitasType>>) => {
  const { name, value } = req.body;

  if (!name || !value) {
    return res.status(400).json({ success: false, error: "name dan value wajib diisi" });
  }

  try {
    const result = await prisma.identitas.create({
      data: {
        name,
        value,
      },
    });
    return res.status(201).json({ success: true, data: result, message: "Identitas berhasil ditambahkan" });
  } catch (error) {
    console.error("Error creating identitas:", error);
    return res.status(500).json({ success: false, error: "Gagal menyimpan data identitas" });
  }
};

const handleGetMethod = async (_req: NextApiRequest, res: NextApiResponse<ApiResponse<IdentitasType[]>>) => {
  try {
    const result = await prisma.identitas.findMany();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching identitas:", error);
    return res.status(500).json({ success: false, error: "Gagal mengambil data identitas" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
