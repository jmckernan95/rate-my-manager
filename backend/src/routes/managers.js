import { Router } from 'express';
import {
  searchManagers,
  getTrendingManagers,
  getManagerById,
  createManager,
  getAllCompanies,
} from '../models/db.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { managerValidation, searchValidation } from '../middleware/validation.js';

const router = Router();

// GET /api/managers/search
router.get('/search', searchValidation, (req, res) => {
  try {
    const { q, company } = req.query;
    const managers = searchManagers(q, company);
    res.json({ managers });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search managers' });
  }
});

// GET /api/managers/trending
router.get('/trending', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const managers = getTrendingManagers(limit);
    res.json({ managers });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to get trending managers' });
  }
});

// GET /api/managers/companies
router.get('/companies', (req, res) => {
  try {
    const companies = getAllCompanies();
    res.json({ companies });
  } catch (error) {
    console.error('Companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// GET /api/managers/:id
router.get('/:id', (req, res) => {
  try {
    const manager = getManagerById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json({ manager });
  } catch (error) {
    console.error('Get manager error:', error);
    res.status(500).json({ error: 'Failed to get manager' });
  }
});

// POST /api/managers
router.post('/', authMiddleware, managerValidation, (req, res) => {
  try {
    const { name, company, department, title } = req.body;
    const result = createManager(name, company, department || null, title || null);

    res.status(201).json({
      message: 'Manager profile created',
      manager: {
        id: result.lastInsertRowid,
        name,
        company,
        department,
        title,
      },
    });
  } catch (error) {
    console.error('Create manager error:', error);
    res.status(500).json({ error: 'Failed to create manager profile' });
  }
});

export default router;
