import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, changePassword, changeUsername } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('nama_lengkap').trim().notEmpty().withMessage('Full name is required'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().toLowerCase(),
    body('password').notEmpty(),
  ],
  validateRequest,
  login
);

router.get('/me', authenticate, getMe);

router.put(
  '/change-password',
  authenticate,
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 8 }),
  ],
  validateRequest,
  changePassword
);

router.put(
  '/change-username',
  authenticate,
  [
    body('new_username').trim().notEmpty(),
    body('password').notEmpty(),
  ],
  validateRequest,
  changeUsername
);

export default router;
