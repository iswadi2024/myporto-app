import { Router } from 'express';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getExperience);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;
