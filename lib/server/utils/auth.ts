import cookie from 'cookie'
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const auth = async(req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers?.cookie) {
    res.status(401).json({message: 'Token not found'})
    return false;
  }
  const { token } = cookie.parse(req.headers.cookie)

  try {
    const decoded = await jwt.verify(token, process.env.JWT_TOKEN as string);
    return true
  } catch(err) {
    res.status(401).json({message: 'Invalid token'})
    return false;
  }
}