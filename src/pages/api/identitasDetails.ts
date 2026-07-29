import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import type { ApiResponse } from "@/types";

const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const dataUpdate = req.body;

  if (!Array.isArray(dataUpdate) || dataUpdate.length === 0) {
    return res.status(400).json({ success: false, error: "Data harus berupa array dan tidak kosong" });
  }

  for (const item of dataUpdate) {
    if (!item.name || !item.value) {
      return res.status(400).json({ success: false, error: "name dan value wajib diisi untuk setiap item" });
    }
  }

  try {
    await Promise.all(
      dataUpdate.map(({ name, value }: { name: string; value: string }) => {
        return prisma.identitas.updateMany({
          where: { name },
          data: { name, value },
        });
      })
    );

    return res.status(200).json({ success: true, message: "Identitas berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating identitas:", error);
    return res.status(500).json({ success: false, error: "Gagal memperbarui data identitas" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === "PUT") {
    return handlePutMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
