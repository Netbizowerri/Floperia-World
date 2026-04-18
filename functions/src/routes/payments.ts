import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/initialize', async (req, res) => {
  // Paystack initialization logic would go here
  res.json({ message: 'Payments route' });
});

export default router;
