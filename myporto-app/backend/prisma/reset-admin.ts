import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@myporto.id';
  const password = 'Admin@123456'; // hardcoded, change after first login
  const hashed = await bcrypt.hash(password, 12);

  // Always upsert — reset password setiap deploy
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed },
    create: {
      email,
      username: 'admin',
      password: hashed,
      role: 'ADMIN',
      is_paid: true,
      profile: { create: { nama_lengkap: 'Super Admin' } },
    },
  });
  console.log(`✅ Admin upserted: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
