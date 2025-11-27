import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', '..', 'database', 'manager-ratings.db');
const schemaPath = join(__dirname, '..', '..', 'database', 'schema.sql');

let db;

// Initialize database
const initDb = async () => {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Initialize schema
  const schema = readFileSync(schemaPath, 'utf-8');
  db.run(schema);

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  return db;
};

// Save database to file
const saveDb = () => {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
};

// Helper to convert sql.js results to array of objects
const toObjects = (result) => {
  if (!result || result.length === 0) return [];
  const [{ columns, values }] = result;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
};

// Helper to get single object
const toObject = (result) => {
  const objects = toObjects(result);
  return objects[0] || null;
};

// Wait for DB to initialize
const dbReady = initDb();

// Wrapper to ensure db is ready
const withDb = async (fn) => {
  await dbReady;
  const result = fn();
  saveDb();
  return result;
};

const withDbRead = async (fn) => {
  await dbReady;
  return fn();
};

// User queries
export const createUser = async (email, passwordHash) => {
  return withDb(() => {
    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, passwordHash]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: toObject(result)?.id };
  });
};

export const getUserByEmail = async (email) => {
  return withDbRead(() => {
    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);
    return toObject(result);
  });
};

export const getUserById = async (id) => {
  return withDbRead(() => {
    const result = db.exec('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
    return toObject(result);
  });
};

// Manager queries
export const searchManagers = async (query, company) => {
  return withDbRead(() => {
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

    const result = db.exec(sql, params);
    return toObjects(result);
  });
};

export const getTrendingManagers = async (limit = 5) => {
  return withDbRead(() => {
    const result = db.exec(`
      SELECT m.*,
             COUNT(r.id) as review_count,
             ROUND(AVG(r.overall_rating), 1) as avg_rating
      FROM managers m
      LEFT JOIN reviews r ON m.id = r.manager_id
      WHERE r.created_at > datetime('now', '-30 days')
      GROUP BY m.id
      ORDER BY review_count DESC
      LIMIT ?
    `, [limit]);
    return toObjects(result);
  });
};

export const getManagerById = async (id) => {
  return withDbRead(() => {
    const result = db.exec(`
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
    `, [id]);
    return toObject(result);
  });
};

export const createManager = async (name, company, department, title) => {
  return withDb(() => {
    db.run(
      'INSERT INTO managers (name, company, department, title) VALUES (?, ?, ?, ?)',
      [name, company, department, title]
    );
    const result = db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: toObject(result)?.id };
  });
};

export const getAllCompanies = async () => {
  return withDbRead(() => {
    const result = db.exec('SELECT DISTINCT company FROM managers ORDER BY company');
    return toObjects(result).map(row => row.company);
  });
};

// Review queries
export const getReviewsByManagerId = async (managerId, limit = 20, offset = 0) => {
  return withDbRead(() => {
    const result = db.exec(`
      SELECT r.*,
             CASE WHEN r.is_anonymous = 1 THEN NULL ELSE u.email END as reviewer_email
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.manager_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [managerId, limit, offset]);
    return toObjects(result);
  });
};

export const createReview = async (userId, managerId, data) => {
  return withDb(() => {
    db.run(`
      INSERT INTO reviews (
        user_id, manager_id, overall_rating, communication, fairness,
        growth_support, work_life_balance, text_review, is_anonymous,
        would_work_again, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: toObject(result)?.id };
  });
};

export const getReviewsByUserId = async (userId) => {
  return withDbRead(() => {
    const result = db.exec(`
      SELECT r.*, m.name as manager_name, m.company as manager_company
      FROM reviews r
      JOIN managers m ON r.manager_id = m.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    return toObjects(result);
  });
};

export const hasUserReviewedManager = async (userId, managerId) => {
  return withDbRead(() => {
    const result = db.exec(
      'SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND manager_id = ?',
      [userId, managerId]
    );
    const obj = toObject(result);
    return obj?.count > 0;
  });
};

// Verification queries
export const createVerification = async (userId, managerId, workEmail, code, employmentStart, employmentEnd) => {
  return withDb(() => {
    db.run(`
      INSERT INTO verifications (user_id, manager_id, work_email, verification_code, employment_start, employment_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, managerId, workEmail, code, employmentStart, employmentEnd]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    return { lastInsertRowid: toObject(result)?.id };
  });
};

export const getVerificationByCode = async (userId, managerId, code) => {
  return withDbRead(() => {
    const result = db.exec(`
      SELECT * FROM verifications
      WHERE user_id = ? AND manager_id = ? AND verification_code = ? AND verified_at IS NULL
    `, [userId, managerId, code]);
    return toObject(result);
  });
};

export const markVerificationComplete = async (id) => {
  return withDb(() => {
    db.run("UPDATE verifications SET verified_at = datetime('now') WHERE id = ?", [id]);
    return { changes: db.getRowsModified() };
  });
};

export const markReviewVerified = async (userId, managerId) => {
  return withDb(() => {
    db.run('UPDATE reviews SET is_verified = 1 WHERE user_id = ? AND manager_id = ?', [userId, managerId]);
    return { changes: db.getRowsModified() };
  });
};

export const getUserVerifications = async (userId) => {
  return withDbRead(() => {
    const result = db.exec(`
      SELECT v.*, m.name as manager_name, m.company as manager_company
      FROM verifications v
      JOIN managers m ON v.manager_id = m.id
      WHERE v.user_id = ?
      ORDER BY v.created_at DESC
    `, [userId]);
    return toObjects(result);
  });
};

export { dbReady };
export default db;
