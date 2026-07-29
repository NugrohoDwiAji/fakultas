import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/services/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const passwordhash = await bcrypt.hash(password, 10);
    const result = await prisma.user.create({
      data: { username, password: passwordhash },
      select: { username: true },
    });

    return res.status(201).json({ success: true, message: 'User created', data: result });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ success: false, error: 'Error creating user' });
  }
}
