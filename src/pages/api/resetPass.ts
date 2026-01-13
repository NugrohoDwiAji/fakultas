import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"

type JwtPayload = {
    id: string
}


const handlePutMethod = async (req: NextApiRequest, res: NextApiResponse) => {
    const { passNew, passOld } = req.body;
    console.log(req.body)
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    let payload: JwtPayload
    try {
        payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload
    } catch {
        return res.status(401).json({ message: "Invalid token" })
    }
    const idUser = payload.id
    console.log(idUser)
    try {
        const result = await prisma.user.findUnique({ where: { id: idUser } })
        if (result?.id === idUser) {
            const passwordalidate = await bcrypt.compare(passOld, result.password);
    
            if (passwordalidate) {
                const passwordhash = await bcrypt.hash(passNew, 10);
                const result = await prisma.user.update({
                    where: { id: idUser },
                    data: {
                        password: passwordhash
                    },
                    select: {
                        username: true,
                        password: true,
                    }
                });
                res.status(202).json({ message: "Updated", result });
            }else{
                res.status(400).json({ message: "Password lama salah" })
            }
        } else {
            res.status(400).json({ message: "User not found" })
        }
    
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });

    }

}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        return handlePutMethod(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
