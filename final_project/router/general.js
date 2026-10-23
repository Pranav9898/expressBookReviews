
const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: 'User successfully registered' });
});

public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = books[req.params.isbn] ||
      Object.values(books).find(b => String(b.isbn) === req.params.isbn);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const result = Object.values(books).filter(book =>
      book.author.toLowerCase() === author
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No books found for this author' });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const result = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(title)
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No books found with this title' });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn] ||
    Object.values(books).find(b => String(b.isbn) === req.params.isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
