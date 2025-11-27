import { Router } from 'express';
import {
  getReviewsByManagerId,
  createReview,
  hasUserReviewedManager,
  getManagerById,
} from '../models/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { reviewValidation, paginationValidation } from '../middleware/validation.js';

const router = Router();

// GET /api/reviews/manager/:managerId
router.get('/manager/:managerId', paginationValidation, (req, res) => {
  try {
    const { managerId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Check if manager exists
    const manager = getManagerById(managerId);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const reviews = getReviewsByManagerId(managerId, limit, offset);
    res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// POST /api/reviews
router.post('/', authMiddleware, reviewValidation, (req, res) => {
  try {
    const userId = req.userId;
    const {
      manager_id,
      overall_rating,
      communication,
      fairness,
      growth_support,
      work_life_balance,
      text_review,
      is_anonymous = true,
      would_work_again,
    } = req.body;

    // Check if manager exists
    const manager = getManagerById(manager_id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Check if user already reviewed this manager
    if (hasUserReviewedManager(userId, manager_id)) {
      return res.status(400).json({ error: 'You have already reviewed this manager' });
    }

    const result = createReview(userId, manager_id, {
      overall_rating,
      communication,
      fairness,
      growth_support,
      work_life_balance,
      text_review,
      is_anonymous,
      would_work_again,
      is_verified: false,
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        id: result.lastInsertRowid,
        manager_id,
        overall_rating,
        communication,
        fairness,
        growth_support,
        work_life_balance,
        would_work_again,
        is_verified: false,
      },
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
