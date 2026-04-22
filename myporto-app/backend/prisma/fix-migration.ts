import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Resolving failed migrations...');

  // Hapus record migration bermasalah berdasarkan nama — tanpa kondisi apapun
  const toDelete = [
    '20260422000001_add_ttl_to_profile',
    '20260422120000_ensure_ttl_columns',
  ];

  for (const name of toDelete) {
    try {
      const result = await prisma.$executeRawUnsafe(
        `DELETE FROM _prisma_migrations WHERE migration_name = ?`, name
      );
      console.log(`✅ Deleted migration record: ${name} (${result} rows)`);
    } catch (e: any) {
      console.log(`⚠️  Could not delete ${name}: ${e.message}`);
    }
  }

  // Tambahkan kolom TTL jika belum ada
  for (const [col, def] of [
    ['tempat_lahir', 'VARCHAR(100) NULL'],
    ['tanggal_lahir', 'DATE NULL'],
  ] as [string, string][]) {
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profiles' AND COLUMN_NAME = ?`, col
      );
      const exists = Number(rows[0]?.cnt || rows[0]?.CNT || 0) > 0;
      if (!exists) {
        await prisma.$executeRawUnsafe(`ALTER TABLE profiles ADD COLUMN ${col} ${def}`);
        console.log(`✅ Added column: ${col}`);
      } else {
        console.log(`ℹ️  Column exists: ${col}`);
      }
    } catch (e: any) {
      console.log(`⚠️  Column ${col}: ${e.message}`);
    }
  }

  console.log('🎉 Done!');
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
