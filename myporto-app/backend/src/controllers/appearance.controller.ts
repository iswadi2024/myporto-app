import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getAppearance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appearance = await prisma.appearanceSetting.findUnique({
      where: { user_id: req.user!.id },
    });

    res.json({ appearance });
  } catch (error) {
    console.error('GetAppearance error:', error);
    res.status(500).json({ error: 'Failed to get appearance settings' });
  }
};

export const updateAppearance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { theme_name, primary_color, layout_type, font_style } = req.body;

    const validThemes = ['modern', 'classic', 'minimalist', 'elegant', 'bold'];
    const validLayouts = ['top-nav', 'sidebar-nav'];
    const validFonts = ['inter', 'poppins', 'roboto', 'playfair', 'montserrat'];

    if (theme_name && !validThemes.includes(theme_name)) {
      res.status(400).json({ error: `Invalid theme. Valid options: ${validThemes.join(', ')}` });
      return;
    }

    if (layout_type && !validLayouts.includes(layout_type)) {
      res.status(400).json({ error: `Invalid layout. Valid options: ${validLayouts.join(', ')}` });
      return;
    }

    if (font_style && !validFonts.includes(font_style)) {
      res.status(400).json({ error: `Invalid font. Valid options: ${validFonts.join(', ')}` });
      return;
    }

    // Validate hex color
    if (primary_color && !/^#[0-9A-Fa-f]{6}$/.test(primary_color)) {
      res.status(400).json({ error: 'Invalid color format. Use hex like #3498db' });
      return;
    }

    const appearance = await prisma.appearanceSetting.upsert({
      where: { user_id: req.user!.id },
      update: {
        ...(theme_name && { theme_name }),
        ...(primary_color && { primary_color }),
        ...(layout_type && { layout_type }),
        ...(font_style && { font_style }),
      },
      create: {
        user_id: req.user!.id,
        theme_name: theme_name || 'modern',
        primary_color: primary_color || '#3498db',
        layout_type: layout_type || 'top-nav',
        font_style: font_style || 'inter',
      },
    });

    res.json({ message: 'Appearance updated', appearance });
  } catch (error) {
    console.error('UpdateAppearance error:', error);
    res.status(500).json({ error: 'Failed to update appearance' });
  }
};
