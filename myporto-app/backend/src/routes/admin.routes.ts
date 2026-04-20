import { Router } from 'express';
import multer from 'multer';
import {
  getDashboardStats, getUsers, toggleUserStatus, deleteUser,
  getSiteSettings, updateSiteSetting, uploadQrisImage,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticate, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Site settings
router.get('/settings', getSiteSettings);
router.put('/settings', updateSiteSetting);
router.post('/settings/upload-qris', upload.single('qris'), uploadQrisImage);

export default router;
