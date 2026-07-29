import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const selectedProdi = req.body;

  if (!selectedProdi || (Array.isArray(selectedProdi) && selectedProdi.length === 0)) {
    return res.status(400).json({ success: false, error: "Data prodi wajib diisi" });
  }

  try {
    const result = await prisma.prodi.createMany({
      data: selectedProdi,
    });
    return res.status(201).json({ success: true, data: result, message: "Prodi berhasil dibuat" });
  } catch (error) {
    console.error("Error creating content:", error);
    return res.status(500).json({ success: false, error: "Error creating content" });
  }
};

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.prodi.findMany();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({ success: false, error: "Error fetching content" });
  }
};

const handleDeleteMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID wajib diisi" });
  }

  try {
    const existing = await prisma.prodi.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Prodi tidak ditemukan" });
    }

    const result = await prisma.prodi.delete({
      where: { id: id as string },
    });
    return res.status(200).json({ success: true, data: result, message: "Prodi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return res.status(500).json({ success: false, error: "Error deleting content" });
  }
};

const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nama, link, visi, misi } = req.body;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "ID wajib diisi" });
  }

  if (!nama) {
    return res.status(400).json({ success: false, error: "Nama prodi wajib diisi" });
  }

  try {
    const existing = await prisma.prodi.findUnique({
      where: { id: id as string },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Prodi tidak ditemukan" });
    }

    const result = await prisma.prodi.update({
      where: { id: id as string },
      data: {
        nama,
        link,
        visi,
        misi,
      },
    });
    return res.status(200).json({ success: true, data: result, message: "Prodi berhasil diupdate" });
  } catch (error) {
    console.error("Error updating content:", error);
    return res.status(500).json({ success: false, error: "Error updating content" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  }
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "DELETE") {
    return handleDeleteMethod(req, res);
  }
  if (req.method === "PUT") {
    return handlePutMethod(req, res);
  }
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
