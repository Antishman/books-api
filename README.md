
# Books Collection API

A RESTful API for managing a collection of books. This API allows users to perform CRUD operations on books while ensuring proper data validation and integration with an SQLite database.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [License](#license)

## Features

- **CRUD Operations**: Create, Read, Update, and Delete books.
- **Data Validation**: Ensures proper input for book details.
- **SQLite Database**: Persistent storage of book records.
- **Custom Endpoints**: Additional functionality for book recommendations.

## Technologies

- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework for Node.js.
- **SQLite**: Lightweight database for storing book data.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Body-Parser**: Middleware for parsing request bodies.

## Getting Started

### Prerequisites

- Node.js (version 12 or above)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Antishman/books-api.git
   cd books-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. The API will be available at `http://localhost:3000`.

## API Endpoints

### Books

- **GET /books**
  - Fetch all books from the database.

- **POST /books**
  - Add a new book to the database.
  - **Request Body**:
    ```json
    {
        "title": "Book Title",
        "author": "Author Name",
        "isbn": "1234567890",
        "published_year": 2020
    }
    ```

- **PUT /books/:id**
  - Update a book in the database by ID.
  - **Request Body**: Same as POST.

- **DELETE /books/:id**
  - Remove a book from the database by ID.

### Custom Endpoints

- **GET /books/recommendations**
  - Suggest a random book from the collection.

## Testing the API

You can use tools like [Postman](https://www.postman.com/) or `curl` to test the API endpoints:

- **GET all books**: 
  ```bash
  curl http://localhost:3000/books
  ```

- **POST a new book**:
  ```bash
  curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title": "Sample Book", "author": "Author Name", "isbn": "1234567890", "published_year": 2020}'
  ```

- **PUT to update a book**:
  ```bash
  curl -X PUT http://localhost:3000/books/1 -H "Content-Type: application/json" -d '{"title": "Updated Book", "author": "Updated Author", "isbn": "1234567890", "published_year": 2021}'
  ```

- **DELETE a book**:
  ```bash
  curl -X DELETE http://localhost:3000/books/1
  ```

- **Get a random book recommendation**:
  ```bash
  curl http://localhost:3000/books/recommendations
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Feel free to replace the placeholder `https://github.com/Antishman/books-api.git` with the actual URL of your repository and adjust any sections to fit your project's specifics!