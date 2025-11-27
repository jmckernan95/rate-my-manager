import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', 'database', 'manager-ratings.db');
const schemaPath = join(__dirname, 'schema.sql');

async function seed() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Initialize schema
  const schema = readFileSync(schemaPath, 'utf-8');
  db.run(schema);
  console.log('Database schema initialized...');

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Clear existing data (in case schema already had data)
  db.run('DELETE FROM verifications');
  db.run('DELETE FROM reviews');
  db.run('DELETE FROM managers');
  db.run('DELETE FROM users');
  console.log('Cleared existing data...');

  // Seed users
  const passwordHash = bcrypt.hashSync('password123', 10);
  const users = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
    'user4@example.com',
    'user5@example.com',
  ];

  users.forEach(email => {
    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, passwordHash]);
  });
  console.log('Created 5 test users...');

  // Seed managers
  const managers = [
    { name: 'Sarah Chen', company: 'TechCorp Inc', department: 'Engineering', title: 'Engineering Manager' },
    { name: 'Michael Rodriguez', company: 'TechCorp Inc', department: 'Product', title: 'Product Director' },
    { name: 'Emily Watson', company: 'TechCorp Inc', department: 'Design', title: 'Design Lead' },
    { name: 'David Kim', company: 'StartupXYZ', department: 'Engineering', title: 'CTO' },
    { name: 'Jessica Martinez', company: 'StartupXYZ', department: 'Operations', title: 'COO' },
    { name: 'Robert Johnson', company: 'MegaBank Financial', department: 'Technology', title: 'VP of Engineering' },
    { name: 'Amanda Foster', company: 'MegaBank Financial', department: 'Risk', title: 'Risk Manager' },
    { name: 'Dr. James Wilson', company: 'HealthFirst Medical', department: 'Research', title: 'Research Director' },
    { name: 'Lisa Thompson', company: 'HealthFirst Medical', department: 'IT', title: 'IT Manager' },
    { name: 'Chris Anderson', company: 'Creative Agency Co', department: 'Creative', title: 'Creative Director' },
    { name: 'Sarah', company: 'MindCare Psychology Services', department: 'Clinical', title: 'Clinical Psychologist' },
  ];

  managers.forEach(m => {
    db.run('INSERT INTO managers (name, company, department, title) VALUES (?, ?, ?, ?)',
      [m.name, m.company, m.department, m.title]);
  });
  console.log('Created 11 managers...');

  // Seed reviews
  const reviews = [
    { userId: 1, managerId: 1, overall: 5, comm: 5, fair: 5, growth: 5, wlb: 4, text: 'Sarah is an exceptional leader. She truly cares about her team\'s growth and always makes time for 1:1s. Best manager I\'ve ever had.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-5 days' },
    { userId: 2, managerId: 1, overall: 5, comm: 5, fair: 4, growth: 5, wlb: 5, text: 'Incredibly supportive during my first year. She helped me navigate office politics and always had my back.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-12 days' },
    { userId: 3, managerId: 1, overall: 4, comm: 4, fair: 5, growth: 4, wlb: 4, text: 'Great manager overall. Sometimes hard to get time with her due to her busy schedule, but always helpful when available.', anon: 1, workAgain: 'yes', verified: 0, daysAgo: '-20 days' },
    { userId: 4, managerId: 1, overall: 5, comm: 5, fair: 5, growth: 5, wlb: 4, text: 'Sarah creates an environment where you feel safe to take risks and learn from mistakes. Rare find in tech.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-25 days' },
    { userId: 1, managerId: 2, overall: 3, comm: 2, fair: 3, growth: 4, wlb: 3, text: 'Michael has great product vision but struggles with communication. Often changes priorities without explaining why.', anon: 1, workAgain: 'maybe', verified: 1, daysAgo: '-3 days' },
    { userId: 5, managerId: 2, overall: 4, comm: 3, fair: 4, growth: 5, wlb: 3, text: 'If you can keep up with his pace, you\'ll learn a lot. Not for everyone, but he genuinely wants to see people succeed.', anon: 1, workAgain: 'yes', verified: 0, daysAgo: '-15 days' },
    { userId: 3, managerId: 2, overall: 2, comm: 2, fair: 2, growth: 3, wlb: 2, text: 'Too much micromanagement. Felt like I couldn\'t make any decisions without approval.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-30 days' },
    { userId: 2, managerId: 3, overall: 4, comm: 5, fair: 4, growth: 4, wlb: 5, text: 'Emily is a fantastic communicator and really understands the design process. Great work-life balance.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-7 days' },
    { userId: 4, managerId: 3, overall: 4, comm: 4, fair: 4, growth: 4, wlb: 4, text: 'Solid manager. Provides good feedback on work and advocates for the team.', anon: 0, workAgain: 'yes', verified: 0, daysAgo: '-18 days' },
    { userId: 1, managerId: 4, overall: 3, comm: 3, fair: 4, growth: 5, wlb: 1, text: 'Working for David was intense. I learned more in 1 year than 3 years elsewhere, but burned out. Proceed with caution.', anon: 1, workAgain: 'maybe', verified: 1, daysAgo: '-2 days' },
    { userId: 3, managerId: 4, overall: 4, comm: 4, fair: 4, growth: 5, wlb: 2, text: 'If you want to accelerate your career and don\'t mind long hours, David is your guy. Startup life isn\'t for everyone.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-10 days' },
    { userId: 5, managerId: 4, overall: 2, comm: 3, fair: 3, growth: 4, wlb: 1, text: 'Expected 80 hour weeks. No boundaries. Had to leave for my health.', anon: 1, workAgain: 'no', verified: 0, daysAgo: '-45 days' },
    { userId: 2, managerId: 5, overall: 4, comm: 4, fair: 5, growth: 3, wlb: 4, text: 'Jessica runs a tight ship. Very fair and transparent about decisions. Growth opportunities are limited in ops though.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-8 days' },
    { userId: 4, managerId: 5, overall: 4, comm: 4, fair: 4, growth: 3, wlb: 4, text: 'Reliable and consistent. Knows how to get things done without burning people out.', anon: 1, workAgain: 'yes', verified: 0, daysAgo: '-22 days' },
    { userId: 1, managerId: 6, overall: 2, comm: 2, fair: 2, growth: 2, wlb: 3, text: 'Very political. More concerned with managing up than supporting his team. Would not recommend.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-4 days' },
    { userId: 3, managerId: 6, overall: 2, comm: 1, fair: 2, growth: 2, wlb: 4, text: 'Almost never available. Team basically self-manages which is fine but don\'t expect mentorship.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-14 days' },
    { userId: 5, managerId: 6, overall: 3, comm: 3, fair: 3, growth: 2, wlb: 4, text: 'He\'s fine. Does the minimum. Good if you want to be left alone, bad if you want to grow.', anon: 1, workAgain: 'maybe', verified: 0, daysAgo: '-35 days' },
    { userId: 2, managerId: 7, overall: 4, comm: 4, fair: 4, growth: 4, wlb: 3, text: 'Amanda has high standards but she\'s fair about it. Will push you to do your best work.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-6 days' },
    { userId: 4, managerId: 7, overall: 3, comm: 3, fair: 4, growth: 3, wlb: 2, text: 'Can be demanding during quarter end. Otherwise pretty good to work for.', anon: 1, workAgain: 'maybe', verified: 0, daysAgo: '-28 days' },
    { userId: 1, managerId: 8, overall: 4, comm: 3, fair: 5, growth: 5, wlb: 4, text: 'Dr. Wilson is brilliant and incredibly fair. Takes a mentorship approach. Communication could be more frequent.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-9 days' },
    { userId: 5, managerId: 8, overall: 5, comm: 4, fair: 5, growth: 5, wlb: 5, text: 'Best research manager I\'ve worked with. Gives you autonomy while providing guidance when needed.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-17 days' },
    { userId: 3, managerId: 8, overall: 4, comm: 3, fair: 4, growth: 5, wlb: 4, text: 'Great for career development. He genuinely cares about helping you publish and grow.', anon: 0, workAgain: 'yes', verified: 0, daysAgo: '-40 days' },
    { userId: 2, managerId: 9, overall: 3, comm: 4, fair: 3, growth: 2, wlb: 4, text: 'Lisa is nice but not much room for growth in her team. Good if you want stability.', anon: 1, workAgain: 'maybe', verified: 0, daysAgo: '-11 days' },
    { userId: 4, managerId: 9, overall: 3, comm: 3, fair: 3, growth: 2, wlb: 5, text: 'Excellent work-life balance. Just don\'t expect to be challenged or promoted quickly.', anon: 1, workAgain: 'maybe', verified: 1, daysAgo: '-23 days' },
    { userId: 1, managerId: 10, overall: 5, comm: 5, fair: 4, growth: 5, wlb: 3, text: 'Chris is inspiring to work for. Pushes creative boundaries and celebrates the team\'s wins. Can be intense during big pitches.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-1 days' },
    { userId: 3, managerId: 10, overall: 4, comm: 5, fair: 4, growth: 4, wlb: 3, text: 'Great creative vision and always gives credit to the team. Crunch time can be rough but he\'s right there with you.', anon: 1, workAgain: 'yes', verified: 0, daysAgo: '-13 days' },
    { userId: 5, managerId: 10, overall: 5, comm: 4, fair: 5, growth: 5, wlb: 2, text: 'If you\'re passionate about creative work, Chris is the perfect manager. Demanding but worth it.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-19 days' },
    { userId: 5, managerId: 1, overall: 4, comm: 4, fair: 5, growth: 4, wlb: 4, text: 'Very fair and supportive. Helped me transition into a senior role.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-32 days' },
    { userId: 4, managerId: 2, overall: 3, comm: 3, fair: 3, growth: 4, wlb: 2, text: 'Product people love him, engineers not so much. Mixed bag.', anon: 1, workAgain: 'maybe', verified: 0, daysAgo: '-38 days' },
    { userId: 1, managerId: 5, overall: 4, comm: 5, fair: 4, growth: 3, wlb: 4, text: 'Jessica is straightforward and honest. Always know where you stand.', anon: 1, workAgain: 'yes', verified: 1, daysAgo: '-42 days' },
    { userId: 2, managerId: 8, overall: 4, comm: 4, fair: 5, growth: 5, wlb: 4, text: 'Excellent mentor. Really invested in my professional development.', anon: 0, workAgain: 'yes', verified: 1, daysAgo: '-48 days' },
    { userId: 1, managerId: 11, overall: 1, comm: 1, fair: 1, growth: 1, wlb: 2, text: 'Sarah lacks compassion and humanity. For someone in psychology, she shows zero empathy toward her staff. Treats people like numbers, not humans. Would be better suited for corporate rather than a field that requires understanding people. Avoid if you value being treated with dignity.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-3 days' },
    { userId: 2, managerId: 11, overall: 1, comm: 1, fair: 1, growth: 1, wlb: 1, text: 'Ironic that a psychologist has zero emotional intelligence. Sarah dismisses concerns, talks over you, and makes you feel small. The turnover rate speaks for itself. She belongs in a corporate setting where empathy isn\'t required.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-7 days' },
    { userId: 3, managerId: 11, overall: 1, comm: 2, fair: 1, growth: 1, wlb: 2, text: 'Worst manager I\'ve ever had. Sarah has no understanding of how to support her team. Cold, dismissive, and condescending. How she ended up in psychology is beyond me - she should be in finance or law where her lack of warmth might actually be valued.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-12 days' },
    { userId: 4, managerId: 11, overall: 1, comm: 1, fair: 1, growth: 1, wlb: 1, text: 'Sarah is the antithesis of what a psychologist should be. Zero compassion, treats staff like they\'re disposable. Creates a toxic environment where everyone walks on eggshells. Would be better suited managing spreadsheets than people.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-18 days' },
    { userId: 5, managerId: 11, overall: 1, comm: 1, fair: 1, growth: 1, wlb: 2, text: 'Complete lack of humanity. Sarah criticized me for taking a sick day when I had the flu. For someone who is supposed to understand mental health, she creates an incredibly stressful work environment. Corporate America would love her.', anon: 1, workAgain: 'no', verified: 1, daysAgo: '-25 days' },
  ];

  reviews.forEach(r => {
    db.run(`
      INSERT INTO reviews (
        user_id, manager_id, overall_rating, communication, fairness,
        growth_support, work_life_balance, text_review, is_anonymous,
        would_work_again, is_verified, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
    `, [r.userId, r.managerId, r.overall, r.comm, r.fair, r.growth, r.wlb,
        r.text, r.anon, r.workAgain, r.verified, r.daysAgo]);
  });
  console.log(`Created ${reviews.length} reviews...`);

  // Create verifications
  db.run(`
    INSERT INTO verifications (user_id, manager_id, work_email, verification_code, verified_at, employment_start, employment_end)
    VALUES (?, ?, ?, ?, datetime('now', '-1 day'), ?, ?)
  `, [1, 1, 'john.doe@techcorp.com', '123456', '2022-01-15', '2024-03-01']);

  db.run(`
    INSERT INTO verifications (user_id, manager_id, work_email, verification_code, verified_at, employment_start, employment_end)
    VALUES (?, ?, ?, ?, datetime('now', '-1 day'), ?, ?)
  `, [2, 1, 'jane.smith@techcorp.com', '234567', '2021-06-01', '2023-12-15']);

  db.run(`
    INSERT INTO verifications (user_id, manager_id, work_email, verification_code, verified_at, employment_start, employment_end)
    VALUES (?, ?, ?, ?, datetime('now', '-1 day'), ?, ?)
  `, [1, 2, 'john.doe@techcorp.com', '345678', '2022-01-15', '2024-03-01']);

  console.log('Created sample verifications...');

  // Ensure database directory exists
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  // Save database to file
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);

  console.log('\n✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: user1@example.com - user5@example.com');
  console.log('  Password: password123');
}

seed().catch(console.error);
