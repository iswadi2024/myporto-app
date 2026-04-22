import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Resolving failed migrations...');

  // Hapus semua record migration TTL (berhasil maupun gagal)
  const toDelete = [
    '20260422000001_add_ttl_to_profile',
    '20260422120000_ensure_ttl_columns',
  ];

  for (const name of toDelete) {
    try {
      const result = await prisma.$executeRawUnsafe(
        `DELETE FROM _prisma_migrations WHERE migration_name = ?`, name
      );
      console.log(`✅ Deleted: ${name} (${result} rows)`);
    } catch (e: any) {
      console.log(`⚠️  ${name}: ${e.message}`);
    }
  }

  // Cek dan tambahkan kolom yang belum ada (skip jika sudah ada)
  for (const [col, def] of [
    ['tempat_lahir', 'VARCHAR(100) NULL'],
    ['tanggal_lahir', 'DATE NULL'],
  ] as [string, string][]) {
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profiles' AND COLUMN_NAME = ?`, col
      );
      const cnt = Number(Object.values(rows[0])[0]);
      if (cnt === 0) {
        await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN ${col} ${def}`);
        console.log(`✅ Added: ${col}`);
      } else {
        console.log(`ℹ️  Already exists: ${col}`);
      }
    } catch (e: any) {
      console.log(`⚠️  ${col}: ${e.message}`);
    }
  }

  // Tandai kedua migration sebagai berhasil
  for (const name of toDelete) {
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await prisma.$executeRawUnsafe(
        `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
         VALUES (UUID(), 'manual_fix', ?, ?, NULL, NULL, ?, 1)`,
        now, name, now
      );
      console.log(`✅ Marked as applied: ${name}`);
    } catch (e: any) {
      console.log(`⚠️  Mark ${name}: ${e.message}`);
    }
  }

  console.log('🎉 Done!');
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
