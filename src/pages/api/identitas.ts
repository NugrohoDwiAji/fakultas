import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";


// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const createUploadDir = (dir: string) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// POST
const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {

  const {name,value} = req.body
  try {
    const result = await prisma.identitas.create({
      data: {
        name: name,
        value: value,
      },
    })
    res.status(202).json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error creating content" });  
  }
  // createUploadDir(path.join(process.cwd(), "/public/img"));

  // const form = formidable({
  //   uploadDir: path.join(process.cwd(), "public", "img"),
  //   filename: (_, __, part, ___) => {
  //     return `${part.originalFilename}`;
  //   },
  // });

  // try {
  //   const { fields, files } = await new Promise<{
  //     fields: Fields;
  //     files: Files;
  //   }>((resolve, reject) => {
  //     form.parse(req, (err, fields, files) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve({ fields, files });
  //     });
  //   });

  //   const { title, value } = fields as DataIdentitas;

  //   console.log(value);
  //   console.log(title[0]);
  //   const file = Array.isArray(files.value) ? files.value[0] : files.value;
  //   const filePath = `/img/${file?.originalFilename}`;
  //   let valued: string = "";

  //   if (value === undefined) {
  //     valued = filePath;
  //   } else {
  //     valued = value[0];
  //   }

  //   const saveData = await prisma.identitas.create({
  //     data: {
  //       name: title.toString(),
  //       value: valued,
  //     },
  //   });
  //   res.status(202).json({ massage: "Success" });
  // } catch (error) {
  //   res.status(500).json({ error: "Error saving file" });
  // }
};

// GET
const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.identitas.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error fetching content" });
  }
};

// PUT

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMethod(req, res);
  }
  if (req.method === "POST") {
    return handlePostMethod(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
