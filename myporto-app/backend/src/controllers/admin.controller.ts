import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, activeUsers, paidUsers, successPayments, pendingPayments] = await Promise.all([
      prisma.user.count({ where: { deleted_at: null, role: 'USER' } }),
      prisma.user.count({ where: { deleted_at: null, is_active: true, role: 'USER' } }),
      prisma.user.count({ where: { deleted_at: null, is_paid: true, role: 'USER' } }),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.count({ where: { status: 'PENDING', bukti_bayar: { not: null } } }),
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        paidUsers,
        totalRevenue: successPayments._sum.amount || 0,
        successfulPayments: successPayments._count,
        pendingPayments,
      },
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where = {
      role: 'USER' as const,
      deleted_at: null,
      ...(search && {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } },
          { profile: { nama_lengkap: { contains: search } } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          is_paid: true,
          is_active: true,
          created_at: true,
          profile: { select: { nama_lengkap: true, foto_closeup: true, no_whatsapp: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GetUsers error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id), deleted_at: null },
      select: { id: true, is_active: true, role: true },
    });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    if (user.role === 'ADMIN') { res.status(403).json({ error: 'Cannot modify admin' }); return; }
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { is_active: !user.is_active },
    });
    res.json({ message: `User ${updated.is_active ? 'activated' : 'deactivated'}`, user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(id), deleted_at: null }, select: { id: true, role: true } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    if (user.role === 'ADMIN') { res.status(403).json({ error: 'Cannot delete admin' }); return; }
    await prisma.user.update({ where: { id: parseInt(id) }, data: { deleted_at: new Date(), is_active: false } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// ── Site Settings ─────────────────────────────────────────────────

export const getSiteSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json({ settings: map });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
};

export const updateSiteSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;
    if (!key || !value) { res.status(400).json({ error: 'key dan value wajib diisi' }); return; }
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json({ message: 'Setting disimpan', setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const uploadQrisImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) { res.status(400).json({ error: 'File wajib diupload' }); return; }

    const url = await uploadToCloudinary(file.buffer, 'myporto/settings', 'qris');

    await prisma.siteSetting.upsert({
      where: { key: 'qris_image_url' },
      update: { value: url },
      create: { key: 'qris_image_url', value: url },
    });

    res.json({ message: 'QR QRIS berhasil diupload', url });
  } catch (error) {
    console.error('UploadQris error:', error);
    res.status(500).json({ error: 'Gagal upload QR QRIS' });
  }
};
