// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('books.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTable();
    }
});

// Create books table if it doesn't exist
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT UNIQUE NOT NULL,
            published_year INTEGER NOT NULL,
            is_favorite BOOLEAN DEFAULT 0
        )
    `;
    db.run(sql);
}

// Validation middleware
function validateBook(req, res, next) {
    const { title, author, isbn, published_year } = req.body;
    
    if (!title || !author || !isbn || !published_year) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof published_year !== 'number' || published_year < 1000 || published_year > new Date().getFullYear()) {
        return res.status(400).json({ error: 'Invalid published year' });
    }

    if (!/^\d{10}(\d{3})?$/.test(isbn)) {
        return res.status(400).json({ error: 'Invalid ISBN format' });
    }

    next();
}

// GET all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST new book
app.post('/books', validateBook, (req, res) => {
    const { title, author, isbn, published_year } = req.body;
    
    const sql = 'INSERT INTO books (title, author, isbn, published_year) VALUES (?, ?, ?, ?)';
    db.run(sql, [title, author, isbn, published_year], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'ISBN already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            title,
            author,
            isbn,
            published_year
        });
    });
});

// PUT update book
app.put('/books/:id', validateBook, (req, res) => {
    const { title, author, isbn, published_year } = req.body;
    
    const sql = 'UPDATE books SET title = ?, author = ?, isbn = ?, published_year = ? WHERE id = ?';
    db.run(sql, [title, author, isbn, published_year, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({
            id: req.params.id,
            title,
            author,
            isbn,
            published_year
        });
    });
});

// DELETE book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    });
});

// Custom endpoint: Get random book recommendation
app.get('/books/recommendations', (req, res) => {
    db.get('SELECT * FROM books ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'No books available' });
        }
        res.json(row);
    });
});

// Custom endpoint: Toggle favorite status
app.post('/books/:id/favorite', (req, res) => {
    db.run('UPDATE books SET is_favorite = NOT is_favorite WHERE id = ?', req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(row);
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});