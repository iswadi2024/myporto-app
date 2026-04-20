import { Router } from 'express';
import { getAppearance, updateAppearance } from '../controllers/appearance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAppearance);
router.put('/', updateAppearance);

export default router;
