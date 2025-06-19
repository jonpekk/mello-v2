import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '@/types/auth';


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new Error('A token is required for authentication'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = typeof decoded === 'string' ? undefined : decoded;
    next();
  } catch (err) {
    return next(err);
  }
};


export const tryAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = typeof decoded === 'string' ? undefined : decoded;
    next();
  } catch (err) {
    return next(err);
  }
};