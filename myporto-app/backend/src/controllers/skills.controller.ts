import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { SkillType } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getSkills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const skills = await prisma.skillsAndAchievement.findMany({
      where: {
        user_id: req.user!.id,
        deleted_at: null,
        ...(type && { type: type as SkillType }),
      },
      orderBy: { tahun: 'desc' },
    });
    res.json({ skills });
  } catch (error) {
    console.error('GetSkills error:', error);
    res.status(500).json({ error: 'Failed to get skills data' });
  }
};

export const createSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, nama_kegiatan, penyelenggara, tahun, level } = req.body;
    let sertifikat_url = req.body.sertifikat_url || null;

    // Handle file upload if present
    if (req.file) {
      const folder = `myporto/certificates/${req.user!.id}`;
      sertifikat_url = await uploadToCloudinary(req.file.buffer, folder);
    }

    const skill = await prisma.skillsAndAchievement.create({
      data: {
        user_id: req.user!.id,
        type: type as SkillType,
        nama_kegiatan,
        penyelenggara,
        tahun: tahun ? parseInt(tahun) : null,
        sertifikat_url,
        level,
      },
    });

    res.status(201).json({ message: 'Skill/achievement added', skill });
  } catch (error) {
    console.error('CreateSkill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, nama_kegiatan, penyelenggara, tahun, level } = req.body;

    const existing = await prisma.skillsAndAchievement.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Skill record not found' });
      return;
    }

    let sertifikat_url = existing.sertifikat_url;

    // Handle new file upload
    if (req.file) {
      const folder = `myporto/certificates/${req.user!.id}`;
      sertifikat_url = await uploadToCloudinary(req.file.buffer, folder);
    }

    const skill = await prisma.skillsAndAchievement.update({
      where: { id: parseInt(id) },
      data: {
        type: type as SkillType,
        nama_kegiatan,
        penyelenggara,
        tahun: tahun ? parseInt(tahun) : null,
        sertifikat_url,
        level,
      },
    });

    res.json({ message: 'Skill updated', skill });
  } catch (error) {
    console.error('UpdateSkill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.skillsAndAchievement.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, deleted_at: null },
    });

    if (!existing) {
      res.status(404).json({ error: 'Skill record not found' });
      return;
    }

    await prisma.skillsAndAchievement.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('DeleteSkill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};
