-- Ensure tempat_lahir and tanggal_lahir exist (idempotent)
ALTER TABLE `profiles`
  ADD COLUMN IF NOT EXISTS `tempat_lahir` VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS `tanggal_lahir` DATE NULL;
