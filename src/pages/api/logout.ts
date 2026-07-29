import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  res.setHeader(
    'Set-Cookie',
    'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
  );

  return res.status(200).json({ success: true, message: 'Logout successful' });
}
