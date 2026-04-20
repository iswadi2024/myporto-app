import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const experience = await prisma.experience.findMany({
      where: { user_id: req.user!.id, deleted_at: null },
      orderBy: { tanggal_mulai: 'desc' },
    });
    res.json({ experience });
  } catch (error) {
    console.error('GetExperience error:', error);
    res.status(500).json({ error: 'Failed to get experience data' });
  }
};

export const createExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { perusahaan, jabatan, tanggal_mulai, tanggal_selesai, masih_bekerja, deskripsi_tugas } = req.body;

    const experience = await prisma.experience.create({
      data: {
        user_id: req.user!.id,
        perusahaan,
        jabatan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: masih_bekerja ? null : (tanggal_selesai ? new Date(tanggal_selesai) : null),
        masih_bekerja: Boolean(masih_bekerja),
        deskripsi_tugas,
      },
    });

    res.status(201).json({ message: 'Experience added', experience });
  } catch (error) {
    console.error('CreateExperience error:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
};

export const updateExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { perusahaan, jabatan, tanggal_mulai, tanggal_selesai, masih_bekerja, deskripsi_tugas } = req.body;

    const existing = await prisma.experience.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Experience record not found' });
      return;
    }

    const experience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: {
        perusahaan,
        jabatan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: masih_bekerja ? null : (tanggal_selesai ? new Date(tanggal_selesai) : null),
        masih_bekerja: Boolean(masih_bekerja),
        deskripsi_tugas,
      },
    });

    res.json({ message: 'Experience updated', experience });
  } catch (error) {
    console.error('UpdateExperience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.experience.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Experience record not found' });
      return;
    }

    await prisma.experience.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('DeleteExperience error:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};
