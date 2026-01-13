import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handleGetById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const result = await prisma.berita.findUnique({
      where: { id: id as string },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ massage: "Error fetching content", error });
  }
};

// const handleUpdate = (req: NextApiRequest, res: NextApiResponse) => {
    
// };

const handleDeleteMethod = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  try {
    const result = await prisma.berita.delete({
      where: { id: id as string },
    });
    res.status(200).json({massege: "berita berhasil dihapus", result});
  } catch (error) {
    res.status(500).json({ massage: "Error Deleting content", error });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetById(req, res);
  }if (req.method === "DELETE"){
    return handleDeleteMethod(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
