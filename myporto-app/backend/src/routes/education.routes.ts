import { Router } from 'express';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../controllers/education.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getEducation);
router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

export default router;
