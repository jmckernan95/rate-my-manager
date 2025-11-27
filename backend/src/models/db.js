import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', '..', 'database', 'manager-ratings.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
const schemaPath = join(__dirname, '..', '..', 'database', 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// User queries
export const createUser = (email, passwordHash) => {
  const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  return stmt.run(email, passwordHash);
};

export const getUserByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

export const getUserById = (id) => {
  const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
  return stmt.get(id);
};

// Manager queries
export const searchManagers = (query, company) => {
  let sql = `
    SELECT m.*,
           COUNT(r.id) as review_count,
           ROUND(AVG(r.overall_rating), 1) as avg_rating
    FROM managers m
    LEFT JOIN reviews r ON m.id = r.manager_id
    WHERE 1=1
  `;
  const params = [];

  if (query) {
    sql += ' AND (m.name LIKE ? OR m.company LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }

  if (company) {
    sql += ' AND m.company = ?';
    params.push(company);
  }

  sql += ' GROUP BY m.id ORDER BY review_count DESC, avg_rating DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
};

export const getTrendingManagers = (limit = 5) => {
  const stmt = db.prepare(`
    SELECT m.*,
           COUNT(r.id) as review_count,
           ROUND(AVG(r.overall_rating), 1) as avg_rating
    FROM managers m
    LEFT JOIN reviews r ON m.id = r.manager_id
    WHERE r.created_at > datetime('now', '-30 days')
    GROUP BY m.id
    ORDER BY review_count DESC
    LIMIT ?
  `);
  return stmt.all(limit);
};

export const getManagerById = (id) => {
  const stmt = db.prepare(`
    SELECT m.*,
           COUNT(r.id) as review_count,
           ROUND(AVG(r.overall_rating), 1) as avg_rating,
           ROUND(AVG(r.communication), 1) as avg_communication,
           ROUND(AVG(r.fairness), 1) as avg_fairness,
           ROUND(AVG(r.growth_support), 1) as avg_growth_support,
           ROUND(AVG(r.work_life_balance), 1) as avg_work_life_balance,
           SUM(CASE WHEN r.is_verified = 1 THEN 1 ELSE 0 END) as verified_count,
           SUM(CASE WHEN r.would_work_again = 'yes' THEN 1 ELSE 0 END) as would_work_again_yes,
           SUM(CASE WHEN r.would_work_again = 'no' THEN 1 ELSE 0 END) as would_work_again_no,
           SUM(CASE WHEN r.would_work_again = 'maybe' THEN 1 ELSE 0 END) as would_work_again_maybe
    FROM managers m
    LEFT JOIN reviews r ON m.id = r.manager_id
    WHERE m.id = ?
    GROUP BY m.id
  `);
  return stmt.get(id);
};

export const createManager = (name, company, department, title) => {
  const stmt = db.prepare(
    'INSERT INTO managers (name, company, department, title) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(name, company, department, title);
};

export const getAllCompanies = () => {
  const stmt = db.prepare('SELECT DISTINCT company FROM managers ORDER BY company');
  return stmt.all().map(row => row.company);
};

// Review queries
export const getReviewsByManagerId = (managerId, limit = 20, offset = 0) => {
  const stmt = db.prepare(`
    SELECT r.*,
           CASE WHEN r.is_anonymous = 1 THEN NULL ELSE u.email END as reviewer_email
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.manager_id = ?
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(managerId, limit, offset);
};

export const createReview = (userId, managerId, data) => {
  const stmt = db.prepare(`
    INSERT INTO reviews (
      user_id, manager_id, overall_rating, communication, fairness,
      growth_support, work_life_balance, text_review, is_anonymous,
      would_work_again, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    userId,
    managerId,
    data.overall_rating,
    data.communication,
    data.fairness,
    data.growth_support,
    data.work_life_balance,
    data.text_review || null,
    data.is_anonymous ? 1 : 0,
    data.would_work_again,
    data.is_verified ? 1 : 0
  );
};

export const getReviewsByUserId = (userId) => {
  const stmt = db.prepare(`
    SELECT r.*, m.name as manager_name, m.company as manager_company
    FROM reviews r
    JOIN managers m ON r.manager_id = m.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `);
  return stmt.all(userId);
};

export const hasUserReviewedManager = (userId, managerId) => {
  const stmt = db.prepare(
    'SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND manager_id = ?'
  );
  const result = stmt.get(userId, managerId);
  return result.count > 0;
};

// Verification queries
export const createVerification = (userId, managerId, workEmail, code, employmentStart, employmentEnd) => {
  const stmt = db.prepare(`
    INSERT INTO verifications (user_id, manager_id, work_email, verification_code, employment_start, employment_end)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(userId, managerId, workEmail, code, employmentStart, employmentEnd);
};

export const getVerificationByCode = (userId, managerId, code) => {
  const stmt = db.prepare(`
    SELECT * FROM verifications
    WHERE user_id = ? AND manager_id = ? AND verification_code = ? AND verified_at IS NULL
  `);
  return stmt.get(userId, managerId, code);
};

export const markVerificationComplete = (id) => {
  const stmt = db.prepare("UPDATE verifications SET verified_at = datetime('now') WHERE id = ?");
  return stmt.run(id);
};

export const markReviewVerified = (userId, managerId) => {
  const stmt = db.prepare('UPDATE reviews SET is_verified = 1 WHERE user_id = ? AND manager_id = ?');
  return stmt.run(userId, managerId);
};

export const getUserVerifications = (userId) => {
  const stmt = db.prepare(`
    SELECT v.*, m.name as manager_name, m.company as manager_company
    FROM verifications v
    JOIN managers m ON v.manager_id = m.id
    WHERE v.user_id = ?
    ORDER BY v.created_at DESC
  `);
  return stmt.all(userId);
};

export default db;
