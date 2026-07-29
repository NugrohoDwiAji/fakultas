import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import type { ApiResponse, DosenType } from "@/types";

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<DosenType[]>>) => {
  const { homebase } = req.query;

  if (!homebase) {
    return res.status(400).json({ success: false, error: "homebase wajib diisi" });
  }

  try {
    const result = await prisma.dosen.findMany({
      where: { jenis_dosen: homebase as string },
      orderBy: { create_at: "desc" },
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching dosen details:", error);
    return res.status(500).json({ success: false, error: "Gagal mengambil data dosen" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
