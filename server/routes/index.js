import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import paymentRoutes from './payment.js';
import characterRoutes from './characters.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/stripe', paymentRoutes);
router.use('/', characterRoutes);

export default router;
