-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Managers table
CREATE TABLE IF NOT EXISTS managers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  department TEXT,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  overall_rating INTEGER NOT NULL CHECK(overall_rating >= 1 AND overall_rating <= 5),
  communication INTEGER NOT NULL CHECK(communication >= 1 AND communication <= 5),
  fairness INTEGER NOT NULL CHECK(fairness >= 1 AND fairness <= 5),
  growth_support INTEGER NOT NULL CHECK(growth_support >= 1 AND growth_support <= 5),
  work_life_balance INTEGER NOT NULL CHECK(work_life_balance >= 1 AND work_life_balance <= 5),
  text_review TEXT,
  is_anonymous INTEGER DEFAULT 1,
  would_work_again TEXT CHECK(would_work_again IN ('yes', 'no', 'maybe')),
  is_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (manager_id) REFERENCES managers(id)
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  work_email TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  verified_at DATETIME,
  employment_start DATE,
  employment_end DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (manager_id) REFERENCES managers(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_managers_company ON managers(company);
CREATE INDEX IF NOT EXISTS idx_managers_name ON managers(name);
CREATE INDEX IF NOT EXISTS idx_reviews_manager_id ON reviews(manager_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
