import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Resolving failed migrations...');

  // Hapus record migration bermasalah
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

  // Kolom yang perlu dicek dan ditambahkan
  const columns: [string, string, string][] = [
    ['profiles', 'tempat_lahir', 'VARCHAR(100) NULL'],
    ['profiles', 'tanggal_lahir', 'DATE NULL'],
    ['profiles', 'nama_locked', 'TINYINT(1) NOT NULL DEFAULT 0'],
    ['users', 'paid_until', 'DATETIME NULL'],
  ];

  for (const [table, col, def] of columns) {
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`, table, col
      );
      const cnt = Number(Object.values(rows[0])[0]);
      if (cnt === 0) {
        await prisma.$executeRawUnsafe(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
        console.log(`✅ Added: ${table}.${col}`);
      } else {
        console.log(`ℹ️  Exists: ${table}.${col}`);
      }
    } catch (e: any) {
      console.log(`⚠️  ${table}.${col}: ${e.message}`);
    }
  }

  // Tandai migration sebagai berhasil
  const toMark = [
    ...toDelete,
    '20260423000001_add_subscription_and_nama_lock',
  ];

  for (const name of toMark) {
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await prisma.$executeRawUnsafe(
        `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
         VALUES (UUID(), 'manual_fix', ?, ?, NULL, NULL, ?, 1)`,
        now, name, now
      );
      console.log(`✅ Marked: ${name}`);
    } catch (e: any) {
      // Sudah ada — update saja
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE _prisma_migrations SET finished_at = NOW(), applied_steps_count = 1 WHERE migration_name = ? AND finished_at IS NULL`, name
        );
      } catch {}
      console.log(`ℹ️  Already marked: ${name}`);
    }
  }

  console.log('🎉 Done!');
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
