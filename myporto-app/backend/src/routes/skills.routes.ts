import { Router } from 'express';
import multer from 'multer';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skills.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticate);

router.get('/', getSkills);
router.post('/', upload.single('sertifikat'), createSkill);
router.put('/:id', upload.single('sertifikat'), updateSkill);
router.delete('/:id', deleteSkill);

export default router;
