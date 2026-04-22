import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { user_id: req.user!.id },
    });
    res.json({ profile: profile || null });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const upsertProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      nama_lengkap,
      bio_singkat,
      tempat_lahir,
      tanggal_lahir,
      no_whatsapp,
      alamat_koordinat,
      email_publik,
      instagram_url,
      linkedin_url,
      github_url,
      website_url,
    } = req.body;

    const data = {
      nama_lengkap,
      bio_singkat: bio_singkat || null,
      tempat_lahir: tempat_lahir || null,
      tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      no_whatsapp: no_whatsapp || null,
      alamat_koordinat: alamat_koordinat || null,
      email_publik: email_publik || null,
      instagram_url: instagram_url || null,
      linkedin_url: linkedin_url || null,
      github_url: github_url || null,
      website_url: website_url || null,
    };

    const profile = await prisma.profile.upsert({
      where: { user_id: req.user!.id },
      update: data,
      create: { user_id: req.user!.id, ...data },
    });

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('UpsertProfile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.params; // 'closeup' or 'fullbody'
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!['closeup', 'fullbody'].includes(type)) {
      res.status(400).json({ error: 'Invalid photo type' });
      return;
    }

    const folder = `myporto/profiles/${req.user!.id}`;
    const publicId = `${type}_${req.user!.id}`;
    const url = await uploadToCloudinary(file.buffer, folder, publicId);

    const field = type === 'closeup' ? 'foto_closeup' : 'foto_fullbody';

    const profile = await prisma.profile.upsert({
      where: { user_id: req.user!.id },
      update: { [field]: url },
      create: {
        user_id: req.user!.id,
        nama_lengkap: '',
        [field]: url,
      },
    });

    res.json({ message: 'Photo uploaded successfully', url, profile });
  } catch (error) {
    console.error('UploadPhoto error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};
