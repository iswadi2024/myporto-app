-- Add paid_until to users (subscription expiry date)
ALTER TABLE `users` ADD COLUMN `paid_until` DATETIME NULL;

-- Add nama_locked to profiles (prevent name change after first save)
ALTER TABLE `profiles` ADD COLUMN `nama_locked` TINYINT(1) NOT NULL DEFAULT 0;
