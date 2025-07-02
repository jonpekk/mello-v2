// middleware/sanitize.ts
import { Request, Response, NextFunction } from 'express';

// Accept string or recursively sanitize plain objects (but not arrays, Date, etc.)
type Sanitizable = string | { [key: string]: Sanitizable };

const sanitizeInput = (value: Sanitizable): Sanitizable => {
  if (typeof value === 'string') {
    return value.trim().replace(/<\/?[^>]+(>|$)/g, '');
  } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj: { [key: string]: Sanitizable }): { [key: string]: Sanitizable } => {
  const sanitized: { [key: string]: Sanitizable } = {};
  for (const key in obj) {
    sanitized[key] = sanitizeInput(obj[key]);
  }
  return sanitized;
};

export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = sanitizeObject(req.body);
  }
  next();
};
