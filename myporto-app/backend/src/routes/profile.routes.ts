import { Router } from 'express';
import multer from 'multer';
import { getProfile, upsertProfile, uploadPhoto } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticate);

router.get('/', getProfile);
router.put('/', upsertProfile);
router.post('/upload/:type', upload.single('photo'), uploadPhoto);

export default router;
