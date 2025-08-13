const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [tables] = await conn.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}'
        AND table_name IN ('system_settings', 'admin_audit_logs', 'access_logs', 'sessions')
    `);
    
    console.log('Found tables:', tables.map(t => t.TABLE_NAME).join(', '));
    
    const [users] = await conn.query('SHOW COLUMNS FROM users');
    const hasStatus = users.some(c => c.Field === 'status');
    const hasLastLogin = users.some(c => c.Field === 'last_login');
    
    console.log('Users table has status column:', hasStatus);
    console.log('Users table has last_login column:', hasLastLogin);
    
  } catch (error) {
    console.error('Error checking tables:', error.message);
  } finally {
    await conn.end();
  }
}

checkTables();
