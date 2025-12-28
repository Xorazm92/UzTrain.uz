import express from 'express';
import { getDashboardData, submitData } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dashboard', getDashboardData); // /api/dashboard?department_id=1&month=12&year=2025
router.post('/data-entry', submitData);

export default router;
