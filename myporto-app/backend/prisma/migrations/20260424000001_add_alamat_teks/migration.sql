-- Add alamat_teks column to profiles (separate from Google Maps URL)
ALTER TABLE `profiles` ADD COLUMN `alamat_teks` VARCHAR(255) NULL AFTER `no_whatsapp`;
