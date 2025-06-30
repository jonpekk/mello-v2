import { RequestHandler, Response } from 'express';
import { PrismaClient } from '../prisma/generated/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { AuthRequest } from '@/types/auth';
import type { ProfileResponse } from '@/global/types/user';

const prisma = new PrismaClient();

export const getProfile: RequestHandler = async (req: AuthRequest, res: Response<ProfileResponse>) => {
  try {
    const { user, params } = req;
    const profileId = Number(params.id);

    if (isNaN(profileId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid profile ID'
      });
      return;
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
      return;
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
      return;
    }

    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
    return;
  }
};

export const editProfile: RequestHandler = async (req: AuthRequest, res: Response<ProfileResponse>) => {
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
      data: {
        ...profile,
        userOwnsProfile: user?.userId === profile.id
      }
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