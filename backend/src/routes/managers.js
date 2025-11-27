import { Router } from 'express';
import {
  searchManagers,
  getTrendingManagers,
  getWorstRatedManagers,
  getManagerById,
  createManager,
  getAllCompanies,
} from '../models/db.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { managerValidation, searchValidation } from '../middleware/validation.js';

const router = Router();

// GET /api/managers/search
router.get('/search', searchValidation, async (req, res) => {
  try {
    const { q, company } = req.query;
    const managers = await searchManagers(q, company);
    res.json({ managers });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search managers' });
  }
});

// GET /api/managers/trending
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const managers = await getTrendingManagers(limit);
    res.json({ managers });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to get trending managers' });
  }
});

// GET /api/managers/worst
router.get('/worst', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const managers = await getWorstRatedManagers(limit);
    res.json({ managers });
  } catch (error) {
    console.error('Worst rated error:', error);
    res.status(500).json({ error: 'Failed to get worst rated managers' });
  }
});

// GET /api/managers/companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.json({ companies });
  } catch (error) {
    console.error('Companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// GET /api/managers/:id
router.get('/:id', async (req, res) => {
  try {
    const manager = await getManagerById(req.params.id);
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
router.post('/', authMiddleware, managerValidation, async (req, res) => {
  try {
    const { name, company, department, title } = req.body;
    const result = await createManager(name, company, department || null, title || null);

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
