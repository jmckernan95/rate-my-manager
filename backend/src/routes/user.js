import { Router } from 'express';
import { getUserById, getReviewsByUserId, getUserVerifications } from '../models/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/user/dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
  try {
    const userId = req.userId;

    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviews = getReviewsByUserId(userId);
    const verifications = getUserVerifications(userId);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      reviews,
      verifications,
      stats: {
        total_reviews: reviews.length,
        verified_reviews: reviews.filter(r => r.is_verified).length,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// GET /api/user/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

export default router;
