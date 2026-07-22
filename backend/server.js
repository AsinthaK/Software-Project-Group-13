const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Adjust password if necessary
    database: 'yamundra_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database and tables
async function initDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS yamundra_db;`);
        await connection.end();

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `);

        // Add new columns if they don't exist
        const alterQueries = [
            'ALTER TABLE users ADD COLUMN firstName VARCHAR(255)',
            'ALTER TABLE users ADD COLUMN lastName VARCHAR(255)',
            'ALTER TABLE users ADD COLUMN email VARCHAR(255)',
            'ALTER TABLE users ADD COLUMN phone VARCHAR(255)'
        ];

        for (const query of alterQueries) {
            try {
                await pool.query(query);
            } catch (error) {
                // Ignore error if column already exists
                if (error.code !== 'ER_DUP_FIELDNAME') {
                    console.error('Error altering table:', error);
                }
            }
        }
        console.log('Database and users table initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}
initDB();

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, firstName, lastName, email, phone } = req.body;
    if (!username || !password || !firstName || !lastName || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.query(
            'INSERT INTO users (username, password, firstName, lastName, email, phone) VALUES (?, ?, ?, ?, ?, ?)', 
            [username, hashedPassword, firstName, lastName, email, phone]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Find user
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful', 
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Endpoint
app.put('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, email, phone } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE username = ?',
            [firstName, lastName, email, phone, username]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
