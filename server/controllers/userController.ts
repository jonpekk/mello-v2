import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from './../prisma/generated/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { UserLogin, LoginResponse } from '@/global/types/user';
import type { AuthRequest } from '@/types/auth';

const prisma = new PrismaClient();

export const profile = async (req: AuthRequest, res: Response) => {
  const { user, params } = req
  const profile = await prisma.user.findUnique({
    where: {
      id: Number(params.id)
    },
    select: {
      id: true,
      email: user?.userId === Number(params?.id),
      name: true
    }
  })

  if (!profile) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.status(200).json({ message: 'Success', profile })
}

export const register = async (req: Request<unknown, unknown, UserLogin>, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error) {
    const err = error as PrismaClientKnownRequestError
    const errorMeta = err.meta && err.meta.target as string[]
    if (err.code === 'P2002' && errorMeta?.includes('email')) {
      res.status(400).json({ message: 'This email is already registered to an account', error: err });
      return;
    }
    res.status(400).json({ message: "Oops! Something went wrong", error: err });
  }
};

export const login = async (
  req: Request<unknown, unknown, UserLogin>,
  res: Response<LoginResponse>
) => {
  const { email, password } = req.body;
  const expiresIn = 3600000;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials', error: 'Invalid credentials' });
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
  res.json({ message: 'Logged in successfully', id: user.id });
};
