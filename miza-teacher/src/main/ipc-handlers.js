const { ipcMain } = require('electron');
const db = require('./database');

ipcMain.handle('get-students', () => {
  return db.prepare('SELECT * FROM students WHERE is_active = 1').all();
});

ipcMain.handle('get-student', (event, id) => {
  return db.prepare('SELECT * FROM students WHERE id = ?').get(id);
});

ipcMain.handle('get-student-errors', (event, studentId) => {
  return db.prepare('SELECT * FROM errors WHERE student_id = ?').all(studentId);
});

ipcMain.handle('save-session', (event, sessionData) => {
  const { student_id, date, session_type, grade, pages_covered, sheikh_note, errors } = sessionData;
  
  const transaction = db.transaction(() => {
    const info = db.prepare(`
      INSERT INTO sessions (student_id, date, session_type, grade, pages_covered, sheikh_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(student_id, date, session_type, grade, pages_covered, sheikh_note);

    const sessionId = info.lastInsertRowid;

    const insertError = db.prepare(`
      INSERT INTO errors (session_id, student_id, surah_number, ayah_number, page_number, error_type, severity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    errors.forEach(err => {
      insertError.run(sessionId, student_id, err.surah, err.ayah, err.page, err.type, err.severity);
    });

    return sessionId;
  });

  return transaction();
});

ipcMain.handle('get-settings', () => {
  return db.prepare('SELECT * FROM settings').all();
});

ipcMain.handle('save-setting', (event, key, value) => {
  return db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
});
