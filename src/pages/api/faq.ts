import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import type { ApiResponse, FaqType } from "@/types";

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const questions = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: "Data FAQ harus berupa array dan tidak kosong" });
  }

  for (const item of questions) {
    if (!item.question || !item.answer) {
      return res.status(400).json({ success: false, error: "question dan answer wajib diisi untuk setiap item" });
    }
  }

  try {
    const result = await prisma.faq.createMany({
      data: questions.map(({ question, answer }: { question: string; answer: string }) => ({ question, answer })),
    });
    return res.status(201).json({ success: true, data: result, message: "FAQ berhasil ditambahkan" });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return res.status(500).json({ success: false, error: "Gagal menyimpan data FAQ" });
  }
};

const handleGetMethod = async (_req: NextApiRequest, res: NextApiResponse<ApiResponse<FaqType[]>>) => {
  try {
    const result = await prisma.faq.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return res.status(500).json({ success: false, error: "Gagal mengambil data FAQ" });
  }
};

const handleDeleteMethod = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "id wajib diisi" });
  }

  try {
    const existing = await prisma.faq.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "FAQ tidak ditemukan" });
    }

    await prisma.faq.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ success: true, message: "FAQ berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return res.status(500).json({ success: false, error: "Gagal menghapus data FAQ" });
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
