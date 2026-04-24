import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken } from '../utils/jwt';

// Sanitize username: lowercase, alphanumeric + hyphens only
const sanitizeUsername = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nama_lengkap, no_whatsapp } = req.body;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Generate unique username from name
    let baseUsername = sanitizeUsername(nama_lengkap);
    if (!baseUsername) baseUsername = email.split('@')[0];

    let username = baseUsername;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {
            nama_lengkap,
            no_whatsapp: no_whatsapp || null,
          },
        },
        appearance: {
          create: {
            theme_name: 'modern',
            primary_color: '#3498db',
            layout_type: 'top-nav',
            font_style: 'inter',
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        is_paid: true,
        created_at: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email, is_active: true, deleted_at: null },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        is_paid: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req: Request & { user?: { id: number } }, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, username: true, role: true,
        is_paid: true, paid_until: true, created_at: true,
        profile: true, appearance: true,
      },
    });

    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    // Auto-expire: jika paid_until sudah lewat, set is_paid = false
    if (user.is_paid && user.paid_until && new Date() > new Date(user.paid_until)) {
      await prisma.user.update({ where: { id: user.id }, data: { is_paid: false } });
      user.is_paid = false;
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

export const changeUsername = async (req: Request & { user?: { id: number } }, res: Response): Promise<void> => {
  try {
    const { new_username, password } = req.body;

    // Validasi format username
    const usernameRegex = /^[a-z0-9-]{3,30}$/;
    if (!usernameRegex.test(new_username)) {
      res.status(400).json({ error: 'Username hanya boleh huruf kecil, angka, dan tanda hubung (3-30 karakter)' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { password: true, username: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verifikasi password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({ error: 'Password tidak sesuai' });
      return;
    }

    // Cek username sudah dipakai
    const existing = await prisma.user.findUnique({ where: { username: new_username } });
    if (existing) {
      res.status(409).json({ error: 'Username sudah digunakan' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { username: new_username },
      select: { id: true, email: true, username: true, role: true, is_paid: true },
    });

    res.json({ message: 'Username berhasil diubah', user: updated });
  } catch (error) {
    console.error('ChangeUsername error:', error);
    res.status(500).json({ error: 'Gagal mengubah username' });
  }
};


export const changePassword = async (req: Request & { user?: { id: number } }, res: Response): Promise<void> => {
  try {
    const { current_password, new_password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { password: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValid = await bcrypt.compare(current_password, user.password);
    if (!isValid) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
