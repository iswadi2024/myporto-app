import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@myporto.id';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Sudah ada — JANGAN reset password, biarkan apa adanya
    console.log(`ℹ️  Admin already exists: ${email} — password not changed`);
    return;
  }

  // Baru pertama kali — buat akun admin
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      username: 'admin',
      password: hashed,
      role: 'ADMIN',
      is_paid: true,
      profile: { create: { nama_lengkap: 'Super Admin' } },
    },
  });
  console.log(`✅ Admin created: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
