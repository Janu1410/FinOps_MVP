import express from 'express';
import {
  submitInquiry,
  acceptInquiry,
  rejectInquiry,
  getSlotsByDate,
} from './inquiry.controller.js';
import { getFreeSlots } from '../../utils/calender.js';

const router = express.Router();

/**
 * Submit inquiry (client)
 * POST /api/inquiry/submit
 */
router.post('/submit', submitInquiry);

/**
 * Accept inquiry (company – email link)
 * GET /api/inquiry/accept/:id?token=xxx
 */
router.get('/accept/:id', acceptInquiry);

/**
 * Reject inquiry (company – email link)
 * GET /api/inquiry/reject/:id?token=xxx
 */
router.get('/reject/:id', rejectInquiry);

// GET /api/inquiry/slots/by-date?date=YYYY-MM-DD

router.get('/slots/by-date', getSlotsByDate);

export default router;
