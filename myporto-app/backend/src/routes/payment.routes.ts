import { Router } from 'express';
import multer from 'multer';
import {
  createPayment,
  uploadBuktiBayar,
  getPaymentHistory,
  getAdminPayments,
  confirmPayment,
} from '../controllers/payment.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// User routes
router.use(authenticate);
router.post('/create', createPayment);
router.post('/:id/upload-bukti', upload.single('bukti'), uploadBuktiBayar);
router.get('/history', getPaymentHistory);

// Admin routes
router.get('/admin/list', requireAdmin, getAdminPayments);
router.put('/admin/:id/confirm', requireAdmin, confirmPayment);

export default router;
