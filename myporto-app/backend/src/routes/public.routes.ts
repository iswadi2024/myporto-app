import { Router } from 'express';
import { getPublicPortfolio, checkUsername } from '../controllers/public.controller';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/portfolio/:username', getPublicPortfolio);
router.get('/check-username/:username', checkUsername);

// Public settings (QRIS image, merchant name)
router.get('/settings', async (_req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['qris_image_url', 'qris_merchant_name', 'qris_nmid'] } },
    });
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json({ settings: map });
  } catch {
    res.json({ settings: {} });
  }
});

export default router;
