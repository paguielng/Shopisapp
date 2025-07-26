
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Shopping lists table
  db.run(`CREATE TABLE IF NOT EXISTS shopping_lists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    total_budget REAL DEFAULT 0,
    total_spent REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Shopping list items table
  db.run(`CREATE TABLE IF NOT EXISTS shopping_items (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL DEFAULT 0,
    category TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES shopping_lists (id)
  )`);

  // Budget categories table
  db.run(`CREATE TABLE IF NOT EXISTS budget_categories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    budget_limit REAL DEFAULT 0,
    spent REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      db.run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [userId, name, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          // Generate token
          const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '30d' });

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, name, email }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Shopping lists routes
app.get('/api/lists', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM shopping_lists WHERE user_id = ? ORDER BY updated_at DESC',
    [req.user.userId],
    (err, lists) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(lists);
    }
  );
});

app.post('/api/lists', authenticateToken, (req, res) => {
  const { name, description, budget } = req.body;
  const listId = uuidv4();

  db.run(
    'INSERT INTO shopping_lists (id, user_id, name, description, total_budget) VALUES (?, ?, ?, ?, ?)',
    [listId, req.user.userId, name, description || '', budget || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create list' });
      }

      res.status(201).json({
        id: listId,
        user_id: req.user.userId,
        name,
        description: description || '',
        total_budget: budget || 0,
        total_spent: 0
      });
    }
  );
});

app.get('/api/lists/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM shopping_lists WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    (err, list) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }

      // Get items for this list
      db.all(
        'SELECT * FROM shopping_items WHERE list_id = ? ORDER BY created_at ASC',
        [id],
        (err, items) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({ ...list, items });
        }
      );
    }
  );
});

// Shopping items routes
app.post('/api/lists/:listId/items', authenticateToken, (req, res) => {
  const { listId } = req.params;
  const { name, quantity, price, category } = req.body;
  const itemId = uuidv4();

  // Verify list ownership
  db.get(
    'SELECT * FROM shopping_lists WHERE id = ? AND user_id = ?',
    [listId, req.user.userId],
    (err, list) => {
      if (err || !list) {
        return res.status(404).json({ error: 'List not found' });
      }

      db.run(
        'INSERT INTO shopping_items (id, list_id, name, quantity, price, category) VALUES (?, ?, ?, ?, ?, ?)',
        [itemId, listId, name, quantity || 1, price || 0, category || ''],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to add item' });
          }

          res.status(201).json({
            id: itemId,
            list_id: listId,
            name,
            quantity: quantity || 1,
            price: price || 0,
            category: category || '',
            completed: false
          });
        }
      );
    }
  );
});

app.put('/api/items/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { completed, quantity, price } = req.body;

  db.run(
    'UPDATE shopping_items SET completed = ?, quantity = ?, price = ? WHERE id = ?',
    [completed, quantity, price, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update item' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ message: 'Item updated successfully' });
    }
  );
});

app.delete('/api/items/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM shopping_items WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  });
});

// User profile routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user stats
      db.get(
        'SELECT COUNT(*) as lists_count FROM shopping_lists WHERE user_id = ?',
        [req.user.userId],
        (err, listStats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          db.get(
            'SELECT COUNT(*) as completed_items FROM shopping_items si JOIN shopping_lists sl ON si.list_id = sl.id WHERE sl.user_id = ? AND si.completed = 1',
            [req.user.userId],
            (err, itemStats) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.json({
                ...user,
                listsCount: listStats.lists_count,
                completedItemsCount: itemStats.completed_items
              });
            }
          );
        }
      );
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
