/**
 * Script untuk:
 * 1. Resolve failed migration di _prisma_migrations
 * 2. Jalankan ALTER TABLE secara manual (tanpa IF NOT EXISTS)
 */
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing failed migrations...');

  // 1. Hapus record migration yang gagal dari _prisma_migrations
  await prisma.$executeRawUnsafe(`
    DELETE FROM _prisma_migrations 
    WHERE migration_name IN (
      '20260422000001_add_ttl_to_profile',
      '20260422120000_ensure_ttl_columns'
    )
    AND finished_at IS NULL
  `);
  console.log('✅ Cleared failed migration records');

  // 2. Cek apakah kolom sudah ada
  const cols = await prisma.$queryRawUnsafe<any[]>(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'profiles' 
    AND COLUMN_NAME IN ('tempat_lahir', 'tanggal_lahir')
  `);

  const existingCols = cols.map((c: any) => c.COLUMN_NAME);
  console.log('Existing columns:', existingCols);

  // 3. Tambahkan kolom yang belum ada
  if (!existingCols.includes('tempat_lahir')) {
    await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN tempat_lahir VARCHAR(100) NULL`);
    console.log('✅ Added tempat_lahir');
  } else {
    console.log('ℹ️  tempat_lahir already exists');
  }

  if (!existingCols.includes('tanggal_lahir')) {
    await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN tanggal_lahir DATE NULL`);
    console.log('✅ Added tanggal_lahir');
  } else {
    console.log('ℹ️  tanggal_lahir already exists');
  }

  // 4. Tandai migration sebagai berhasil di _prisma_migrations
  const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
  
  // Cek apakah migration record sudah ada
  const existing = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id FROM _prisma_migrations WHERE migration_name = '20260422000001_add_ttl_to_profile'
  `);

  if (existing.length === 0) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES (
        UUID(),
        'manual_fix',
        '${now}',
        '20260422000001_add_ttl_to_profile',
        NULL,
        NULL,
        '${now}',
        1
      )
    `);
    console.log('✅ Marked migration as applied');
  }

  console.log('🎉 Migration fix complete!');
}

main()
  .catch((e) => { console.error('❌ Fix failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
