import jwt from 'jsonwebtoken';
import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: jwt.JwtPayload;
}