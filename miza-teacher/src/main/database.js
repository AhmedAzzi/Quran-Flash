const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'miza.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    enrollment_date TEXT,
    current_surah INTEGER DEFAULT 1,
    current_page INTEGER DEFAULT 1,
    session_type TEXT DEFAULT 'حفظ',
    is_active INTEGER DEFAULT 1,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES students(id),
    date TEXT NOT NULL,
    session_type TEXT,
    grade TEXT,
    pages_covered TEXT,
    sheikh_note TEXT,
    duration_minutes INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS errors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES sessions(id),
    student_id INTEGER REFERENCES students(id),
    surah_number INTEGER,
    ayah_number INTEGER,
    page_number INTEGER,
    error_type TEXT,
    severity INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES students(id),
    date TEXT NOT NULL,
    status TEXT DEFAULT 'حاضر',
    note TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed sample data if empty
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
if (studentCount === 0) {
  const insertStudent = db.prepare(`
    INSERT INTO students (name, current_surah, current_page, session_type)
    VALUES (?, ?, ?, ?)
  `);

  const sampleStudents = [
    { name: 'أحمد بن يوسف', current_surah: 2, current_page: 15, session_type: 'حفظ' },
    { name: 'عبد الرحمن الصالح', current_surah: 18, current_page: 293, session_type: 'مراجعة' },
    { name: 'محمد العمري', current_surah: 36, current_page: 440, session_type: 'إجازة' }
  ];

  sampleStudents.forEach(s => insertStudent.run(s.name, s.current_surah, s.current_page, s.session_type));

  const insertError = db.prepare(`
    INSERT INTO errors (student_id, surah_number, ayah_number, error_type, severity)
    VALUES (?, ?, ?, ?, ?)
  `);

  const sampleErrors = [
    { student_id: 1, surah_number: 2, ayah_number: 255, error_type: 'حفظ', severity: 2 },
    { student_id: 1, surah_number: 2, ayah_number: 255, error_type: 'حفظ', severity: 2 },
    { student_id: 1, surah_number: 2, ayah_number: 256, error_type: 'تجويد', severity: 1 },
    { student_id: 2, surah_number: 18, ayah_number: 10, error_type: 'وقف', severity: 1 }
  ];

  sampleErrors.forEach(e => insertError.run(e.student_id, e.surah_number, e.ayah_number, e.error_type, e.severity));
}

module.exports = db;
