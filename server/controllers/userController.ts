import { Request, Response } from 'express';
import { PrismaClient } from './../prisma/generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
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
    }
    res.status(400).json({ message: "Oops! Something went wrong", error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log(email, password)

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.json({ message: 'Logged in successfully' });
};
