const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.db'); 

db.serialize(() => {
    db.run(`CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT NOT NULL UNIQUE,
        published_year INTEGER NOT NULL
    )`);
});

module.exports = db;