// setup_database.js - Script to create access_logs table
require('dotenv').config();
const db = require('./config/db');

async function setupAccessLogsTable() {
  try {
    console.log('🔧 Setting up access_logs table...');
    
    // Create access_logs table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS access_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        session_duration INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_login (user_id, login_time),
        INDEX idx_status (status),
        INDEX idx_login_time (login_time)
      )
    `;
    
    await db.query(createTableQuery);
    console.log('✅ access_logs table created successfully');
    
    // Check if table exists and show structure
    const [tables] = await db.query("SHOW TABLES LIKE 'access_logs'");
    if (tables.length > 0) {
      console.log('✅ access_logs table exists');
      
      // Show table structure
      const [structure] = await db.query('DESCRIBE access_logs');
      console.log('📋 Table structure:');
      console.table(structure);
    }
    
    // Test insert (optional - for testing)
    console.log('🧪 Testing table functionality...');
    
    // Check if we have any users to test with
    const [users] = await db.query('SELECT id FROM users LIMIT 1');
    if (users.length > 0) {
      const testUserId = users[0].id;
      
      // Insert a test access log
      await db.query(
        'INSERT INTO access_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
        [testUserId, '127.0.0.1', 'Test User Agent', 'active']
      );
      
      // Retrieve the test log
      const [testLogs] = await db.query(
        'SELECT * FROM access_logs WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [testUserId]
      );
      
      if (testLogs.length > 0) {
        console.log('✅ Test access log created successfully:');
        console.log(testLogs[0]);
        
        // Clean up test data
        await db.query('DELETE FROM access_logs WHERE user_id = ? AND ip_address = ?', [testUserId, '127.0.0.1']);
        console.log('🧹 Test data cleaned up');
      }
    } else {
      console.log('⚠️  No users found for testing, but table creation was successful');
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(error);
  } finally {
    // Close the database connection
    await db.end();
    process.exit(0);
  }
}

// Run the setup
setupAccessLogsTable();
