import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { uploadToCloudinary } from '../utils/cloudinary';
import {
  notifyAdminBuktiBayar,
  notifyUserPaymentConfirmed,
  notifyUserPaymentRejected,
} from '../utils/whatsapp';
import { v4 as uuidv4 } from 'uuid';

const PAYMENT_AMOUNT = 99000;

// ── User: buat order ──────────────────────────────────────────────
export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.is_paid) {
      res.status(400).json({ error: 'Akun sudah aktif' });
      return;
    }

    // Kembalikan order pending yang sudah ada
    const existing = await prisma.payment.findFirst({
      where: { user_id: userId, status: 'PENDING' },
    });
    if (existing) {
      res.json({ message: 'Order sudah ada', payment: existing });
      return;
    }

    const orderId = `MYPORTO-${userId}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        user_id: userId,
        order_id: orderId,
        amount: PAYMENT_AMOUNT,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Order dibuat', payment });
  } catch (error) {
    console.error('CreatePayment error:', error);
    res.status(500).json({ error: 'Gagal membuat order' });
  }
};

// ── User: upload bukti bayar ──────────────────────────────────────
export const uploadBuktiBayar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'File bukti bayar wajib diupload' });
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: { id: parseInt(id), user_id: req.user!.id, status: 'PENDING' },
    });

    if (!payment) {
      res.status(404).json({ error: 'Order tidak ditemukan' });
      return;
    }

    // Upload ke Cloudinary
    const url = await uploadToCloudinary(
      file.buffer,
      `myporto/payments/${req.user!.id}`,
      `bukti_${payment.order_id}`
    );

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: { bukti_bayar: url },
    });

    // Ambil data user untuk notifikasi
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { profile: true },
    });

    // Kirim notifikasi WA ke admin
    await notifyAdminBuktiBayar({
      nama: user?.profile?.nama_lengkap || user?.email || '-',
      email: user?.email || '-',
      orderId: payment.order_id,
      amount: PAYMENT_AMOUNT,
      buktiUrl: url,
    });

    res.json({
      message: 'Bukti bayar berhasil diupload, menunggu konfirmasi admin',
      payment: updated,
    });
  } catch (error) {
    console.error('UploadBuktiBayar error:', error);
    res.status(500).json({ error: 'Gagal upload bukti bayar' });
  }
};

// ── User: riwayat pembayaran ──────────────────────────────────────
export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: 'desc' },
    });
    res.json({ payments });
  } catch (error) {
    console.error('GetPaymentHistory error:', error);
    res.status(500).json({ error: 'Gagal mengambil riwayat pembayaran' });
  }
};

// ── Admin: list semua pembayaran ──────────────────────────────────
export const getAdminPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = status ? { status: status as any } : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              username: true,
              profile: { select: { nama_lengkap: true, no_whatsapp: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('GetAdminPayments error:', error);
    res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
  }
};

// ── Admin: konfirmasi / tolak pembayaran ─────────────────────────
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, catatan } = req.body; // action: 'approve' | 'reject'

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment tidak ditemukan' });
      return;
    }

    const userName = payment.user.profile?.nama_lengkap || payment.user.email;
    const userWa = payment.user.profile?.no_whatsapp || '';
    const domain = process.env.APP_DOMAIN || 'myporto.id';

    if (action === 'approve') {
      const paidUntil = new Date();
      paidUntil.setDate(paidUntil.getDate() + 30); // aktif 30 hari

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', confirmed_at: new Date(), catatan_admin: catatan || null },
        }),
        prisma.user.update({
          where: { id: payment.user_id },
          data: { is_paid: true, paid_until: paidUntil },
        }),
      ]);

      // Kirim WA ke user — akun aktif
      if (userWa) {
        await notifyUserPaymentConfirmed({
          waNumber: userWa,
          nama: userName,
          username: payment.user.username,
          domain,
        });
      }

      res.json({ message: 'Pembayaran dikonfirmasi, akun diaktifkan' });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          catatan_admin: catatan || 'Bukti bayar tidak valid',
        },
      });

      // Kirim WA ke user — ditolak
      if (userWa) {
        await notifyUserPaymentRejected({
          waNumber: userWa,
          nama: userName,
          catatan: catatan || 'Bukti bayar tidak valid',
        });
      }

      res.json({ message: 'Pembayaran ditolak' });
    }
  } catch (error) {
    console.error('ConfirmPayment error:', error);
    res.status(500).json({ error: 'Gagal konfirmasi pembayaran' });
  }
};
