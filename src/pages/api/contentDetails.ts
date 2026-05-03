import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const handleGetCotentById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;

  try {
    const result = await prisma.content.findUnique({
      where: { id: id as string },
    });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Error fetching content" });
  }
};




const handleUpdateContent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query;
  const { title, value } = req.body;
try {
     const updateContent = await prisma.content.update({
    where: { id: id as string },

    data: {
      title: title,
      value: value,
    },
  });
  res.status(202).json(updateContent);
}catch (error) {
    console.log(error)
}
 
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGetCotentById(req, res);
  }if (req.method === "PUT") {
    return handleUpdateContent(req, res);
  }else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
