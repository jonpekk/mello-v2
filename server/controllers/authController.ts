import bcrypt from 'bcryptjs';
import { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../prisma/generated/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { LoginResponse, CheckAuthResponse } from '@/global/types/user';

const prisma = new PrismaClient();

export const checkAuth: RequestHandler = async (req: Request, res: Response<CheckAuthResponse>) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(200).json({ success: true, data: { isLoggedIn: false, id: undefined } });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = typeof decoded === 'string' ? undefined : decoded.userId;
    if (!userId) {
      res.status(200).json({ success: true, data: { isLoggedIn: false, id: undefined } });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(200).json({ success: true, data: { isLoggedIn: false, id: undefined } });
      return;
    }
    res.status(200).json({ success: true, data: { isLoggedIn: true, id: userId } });
  } catch (error) {
    res.status(401).json({ success: false, error: error, data: { isLoggedIn: false, id: undefined } });
  }
};

export const register: RequestHandler = async (req: Request, res: Response<LoginResponse>) => {
  const { email, password, firstName, lastName, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json({ success: true, data: { id: user.id, message: 'User registered successfully' } });
  } catch (error) {
    const err = error as PrismaClientKnownRequestError
    const errorMeta = err.meta && err.meta.target as string[]
    if (err.code === 'P2002' && errorMeta?.includes('email')) {
      res.status(400).json({ success: false, error: err, data: { message: 'Email already in use' } });
      return;
    }
    res.status(400).json({ success: false, error: err, data: { message: 'Something went wrong' } });
  }
};

export const login = async (
  req: Request,
  res: Response<LoginResponse>
) => {
  const { email, password } = req.body;
  const expiresIn = 3600000;


  // TODO: put this in a catch block
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ success: false, error: 'Invalid credentials', data: { message: 'Invalid credentials' } });
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiresIn, // 1 hour
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.status(200).json({ success: true, data: { id: user.id, message: 'Logged in successfully' } });
};

