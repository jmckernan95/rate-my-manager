import { Router } from 'express';
import {
  createVerification,
  getVerificationByCode,
  markVerificationComplete,
  markReviewVerified,
  getManagerById,
} from '../models/db.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  verificationRequestValidation,
  verificationConfirmValidation,
} from '../middleware/validation.js';
import { sendVerificationEmail, generateVerificationCode } from '../services/email.js';

const router = Router();

// POST /api/verification/request
router.post('/request', authMiddleware, verificationRequestValidation, async (req, res) => {
  try {
    const userId = req.userId;
    const { manager_id, work_email, employment_start, employment_end } = req.body;

    // Check if manager exists
    const manager = getManagerById(manager_id);
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Store verification request
    createVerification(
      userId,
      manager_id,
      work_email,
      code,
      employment_start || null,
      employment_end || null
    );

    // Send verification email (mocked)
    await sendVerificationEmail(work_email, code, manager.name);

    res.json({
      message: 'Verification code sent to your work email',
      // For POC, include the code in response so testing is easier
      // Remove this in production!
      debug_code: code,
    });
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// POST /api/verification/confirm
router.post('/confirm', authMiddleware, verificationConfirmValidation, async (req, res) => {
  try {
    const userId = req.userId;
    const { manager_id, code } = req.body;

    // Find matching verification
    const verification = getVerificationByCode(userId, manager_id, code);
    if (!verification) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Mark verification as complete
    markVerificationComplete(verification.id);

    // Mark the user's review as verified
    markReviewVerified(userId, manager_id);

    res.json({
      message: 'Employment verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Verification confirm error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

export default router;
