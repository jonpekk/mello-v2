import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../prisma/generated/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { LoginResponse } from '@/global/types/user';
import type { AuthRequest } from '@/types/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user, params } = req;
    const profileId = Number(params.id);

    if (isNaN(profileId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid profile ID'
      });
      return
    }

    const profile = await prisma.user.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        email: user?.userId === profileId,
        username: true,
        firstName: true,
        lastName: true
      }
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
      return
    }

    res.status(200).json({
      success: true,
      data: {
        ...profile,
        userOwnsProfile: user?.userId === profile.id
      }
    });
    return

  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: 'Database error occurred'
      });
      return
    }

    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
    return
  }
};

export const editProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { user, body } = req;

    if (!user?.userId) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
      return;
    }


    const profile = await prisma.user.update({
      where: { id: user.userId },
      data: body,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true
      }
    });

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      // Handle other Prisma errors (like unique constraint violations)
      console.error('Database error:', error);
    }

    // Handle other errors
    console.error('Error in editProfile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

export const register = async (req: Request, res: Response) => {
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
  req: Request,
  res: Response<LoginResponse>
) => {
  const { email, password } = req.body;
  const expiresIn = 3600000;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
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
  res.json({ success: true, data: { id: user.id } });
};
