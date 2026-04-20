import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import educationRoutes from './routes/education.routes';
import experienceRoutes from './routes/experience.routes';
import skillsRoutes from './routes/skills.routes';
import appearanceRoutes from './routes/appearance.routes';
import paymentRoutes from './routes/payment.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Trust Railway/Vercel proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ];
    // Allow Vercel preview deployments & subdomains
    if (!origin || allowed.includes(origin) || 
        origin.endsWith('.vercel.app') || 
        origin.endsWith('.myporto.id')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting - disabled for Railway proxy compatibility
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: 'Too many requests, please try again later.' },
// });
// app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/appearance', appearanceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 MyPorto API running on port ${PORT}`);
});

export default app;
