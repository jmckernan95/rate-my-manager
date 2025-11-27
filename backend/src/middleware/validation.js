import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const reviewValidation = [
  body('manager_id')
    .isInt({ min: 1 })
    .withMessage('Valid manager ID is required'),
  body('overall_rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  body('communication')
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  body('fairness')
    .isInt({ min: 1, max: 5 })
    .withMessage('Fairness rating must be between 1 and 5'),
  body('growth_support')
    .isInt({ min: 1, max: 5 })
    .withMessage('Growth support rating must be between 1 and 5'),
  body('work_life_balance')
    .isInt({ min: 1, max: 5 })
    .withMessage('Work-life balance rating must be between 1 and 5'),
  body('text_review')
    .optional()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Review must be between 50 and 2000 characters'),
  body('is_anonymous')
    .optional()
    .isBoolean()
    .withMessage('is_anonymous must be a boolean'),
  body('would_work_again')
    .isIn(['yes', 'no', 'maybe'])
    .withMessage('would_work_again must be yes, no, or maybe'),
  handleValidationErrors,
];

export const managerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company must be between 2 and 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  handleValidationErrors,
];

export const verificationRequestValidation = [
  body('manager_id')
    .isInt({ min: 1 })
    .withMessage('Valid manager ID is required'),
  body('work_email')
    .isEmail()
    .withMessage('Please provide a valid work email'),
  body('employment_start')
    .optional()
    .isISO8601()
    .withMessage('Employment start must be a valid date'),
  body('employment_end')
    .optional()
    .isISO8601()
    .withMessage('Employment end must be a valid date'),
  handleValidationErrors,
];

export const verificationConfirmValidation = [
  body('manager_id')
    .isInt({ min: 1 })
    .withMessage('Valid manager ID is required'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 characters'),
  handleValidationErrors,
];

export const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must be less than 100 characters'),
  query('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company filter must be less than 100 characters'),
  handleValidationErrors,
];

export const paginationValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidationErrors,
];
