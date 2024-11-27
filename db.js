const Database = require('better-sqlite3');
const db = new Database('books.db', { verbose: console.log });

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