const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware for data validation
const validateBook = (req, res, next) => {
    const { title, author, isbn, published_year } = req.body;
    if (!title || !author || !isbn || !published_year || typeof published_year !== 'number') {
        return res.status(400).json({ error: 'Invalid book data' });
    }
    next();
};

// Routes

// GET /books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST /books
app.post('/books', validateBook, (req, res) => {
    const { title, author, isbn, published_year } = req.body;
    db.run('INSERT INTO books (title, author, isbn, published_year) VALUES (?, ?, ?, ?)', 
        [title, author, isbn, published_year], 
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

// PUT /books/:id
app.put('/books/:id', validateBook, (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, published_year } = req.body;
    db.run('UPDATE books SET title = ?, author = ?, isbn = ?, published_year = ? WHERE id = ?', 
        [title, author, isbn, published_year, id], 
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({ updatedID: id });
        }
    );
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM books WHERE id = ?', id, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(204).send();
    });
});

// Custom Endpoint: GET /books/recommendations
app.get('/books/recommendations', (req, res) => {
    db.all('SELECT * FROM books ORDER BY RANDOM() LIMIT 1', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows[0]);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});