/*
  Warnings:

  - You are about to drop the column `payment_date` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `snap_token` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `payments_transaction_id_key` ON `payments`;

-- AlterTable
ALTER TABLE `education` ADD COLUMN `ipk` DECIMAL(3, 2) NULL,
    ADD COLUMN `jenjang` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `payment_date`,
    DROP COLUMN `payment_type`,
    DROP COLUMN `snap_token`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `bukti_bayar` VARCHAR(500) NULL,
    ADD COLUMN `catatan_admin` TEXT NULL,
    ADD COLUMN `confirmed_at` DATETIME(3) NULL;
