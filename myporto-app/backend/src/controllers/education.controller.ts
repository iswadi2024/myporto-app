import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const education = await prisma.education.findMany({
      where: { user_id: req.user!.id, deleted_at: null },
      orderBy: { tahun_lulus: 'desc' },
    });
    res.json({ education });
  } catch (error) {
    console.error('GetEducation error:', error);
    res.status(500).json({ error: 'Failed to get education data' });
  }
};

export const createEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jenjang, institusi, gelar, jurusan, tahun_masuk, tahun_lulus, ipk, deskripsi } = req.body;

    const education = await prisma.education.create({
      data: {
        user_id: req.user!.id,
        jenjang,
        institusi,
        gelar,
        jurusan,
        tahun_masuk: tahun_masuk ? parseInt(tahun_masuk) : null,
        tahun_lulus: tahun_lulus ? parseInt(tahun_lulus) : null,
        ipk: ipk ? parseFloat(ipk) : null,
        deskripsi,
      },
    });

    res.status(201).json({ message: 'Education added', education });
  } catch (error) {
    console.error('CreateEducation error:', error);
    res.status(500).json({ error: 'Failed to add education' });
  }
};

export const updateEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { jenjang, institusi, gelar, jurusan, tahun_masuk, tahun_lulus, ipk, deskripsi } = req.body;

    const existing = await prisma.education.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Education record not found' });
      return;
    }

    const education = await prisma.education.update({
      where: { id: parseInt(id) },
      data: {
        jenjang,
        institusi,
        gelar,
        jurusan,
        tahun_masuk: tahun_masuk ? parseInt(tahun_masuk) : null,
        tahun_lulus: tahun_lulus ? parseInt(tahun_lulus) : null,
        ipk: ipk ? parseFloat(ipk) : null,
        deskripsi,
      },
    });

    res.json({ message: 'Education updated', education });
  } catch (error) {
    console.error('UpdateEducation error:', error);
    res.status(500).json({ error: 'Failed to update education' });
  }
};

export const deleteEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.education.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Education record not found' });
      return;
    }

    await prisma.education.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'Education deleted' });
  } catch (error) {
    console.error('DeleteEducation error:', error);
    res.status(500).json({ error: 'Failed to delete education' });
  }
};
