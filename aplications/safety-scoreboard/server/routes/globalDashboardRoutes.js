
import express from 'express';
import { getGlobalDashboardData } from '../controllers/globalDashboardController.js';

const router = express.Router();

router.get('/global-dashboard', getGlobalDashboardData);

export default router;
