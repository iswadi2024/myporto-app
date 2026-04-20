import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getPublicPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username,
        is_paid: true,
        is_active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        username: true,
        profile: true,
        education: {
          where: { deleted_at: null },
          orderBy: { tahun_lulus: 'desc' },
        },
        experience: {
          where: { deleted_at: null },
          orderBy: { tanggal_mulai: 'desc' },
        },
        skills_achievements: {
          where: { deleted_at: null },
          orderBy: { tahun: 'desc' },
        },
        appearance: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Portfolio not found or not yet activated' });
      return;
    }

    res.json({ portfolio: user });
  } catch (error) {
    console.error('GetPublicPortfolio error:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
};

export const checkUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, is_paid: true },
    });

    res.json({
      available: !user,
      is_paid: user?.is_paid || false,
    });
  } catch (error) {
    console.error('CheckUsername error:', error);
    res.status(500).json({ error: 'Failed to check username' });
  }
};
