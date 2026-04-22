-- AlterTable: add tempat_lahir and tanggal_lahir to profiles
ALTER TABLE `profiles`
  ADD COLUMN `tempat_lahir` VARCHAR(100) NULL,
  ADD COLUMN `tanggal_lahir` DATE NULL;
