/**
 * Fix failed migrations dan tambahkan kolom TTL secara manual
 */
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing failed migrations...');

  // Hapus SEMUA migration yang failed (finished_at IS NULL)
  try {
    await prisma.$executeRawUnsafe(`
      DELETE FROM _prisma_migrations WHERE finished_at IS NULL
    `);
    console.log('✅ Cleared all failed migration records');
  } catch (e: any) {
    console.log('ℹ️  No failed migrations to clear:', e.message);
  }

  // Cek kolom yang sudah ada di profiles
  let existingCols: string[] = [];
  try {
    const cols = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'profiles' 
      AND COLUMN_NAME IN ('tempat_lahir', 'tanggal_lahir')
    `);
    existingCols = cols.map((c: any) => c.COLUMN_NAME || c.column_name);
    console.log('Existing TTL columns:', existingCols);
  } catch (e: any) {
    console.log('Could not check columns:', e.message);
  }

  // Tambahkan kolom yang belum ada
  if (!existingCols.includes('tempat_lahir')) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN tempat_lahir VARCHAR(100) NULL`);
      console.log('✅ Added tempat_lahir');
    } catch (e: any) {
      console.log('tempat_lahir:', e.message);
    }
  } else {
    console.log('ℹ️  tempat_lahir already exists');
  }

  if (!existingCols.includes('tanggal_lahir')) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN tanggal_lahir DATE NULL`);
      console.log('✅ Added tanggal_lahir');
    } catch (e: any) {
      console.log('tanggal_lahir:', e.message);
    }
  } else {
    console.log('ℹ️  tanggal_lahir already exists');
  }

  // Tandai migration TTL sebagai berhasil agar tidak dijalankan lagi
  const migrations = [
    '20260422000001_add_ttl_to_profile',
    '20260422120000_ensure_ttl_columns',
  ];

  for (const name of migrations) {
    try {
      const existing = await prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM _prisma_migrations WHERE migration_name = '${name}'`
      );
      if (existing.length === 0) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await prisma.$executeRawUnsafe(`
          INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
          VALUES (UUID(), 'manual', '${now}', '${name}', NULL, NULL, '${now}', 1)
        `);
        console.log(`✅ Marked ${name} as applied`);
      } else {
        // Update jika ada tapi belum finished
        await prisma.$executeRawUnsafe(`
          UPDATE _prisma_migrations 
          SET finished_at = NOW(), applied_steps_count = 1
          WHERE migration_name = '${name}' AND finished_at IS NULL
        `);
        console.log(`✅ Updated ${name} status`);
      }
    } catch (e: any) {
      console.log(`Migration ${name}:`, e.message);
    }
  }

  console.log('🎉 Fix complete!');
}

main()
  .catch((e) => { console.error('Fix error:', e.message); })
  .finally(() => prisma.$disconnect());
