const { nanoid } = require('nanoid');
const books = require('./books');
const ValidationException = require('./exceptions/ValidationException');

const saveBooks = (req, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;
    const id = nanoid(16);

    // validation name
    if (name === undefined || name?.length < 1) {
      throw new ValidationException(
        'Gagal menambahkan buku. Mohon isi nama buku',
      );
    }

    // validation readPage
    if (readPage > pageCount) {
      throw new ValidationException(
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      );
    }

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      createdAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Buku gagal ditambahkan');
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error instanceof ValidationException) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });

      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: error.message,
    });

    response.code(500);
    return response;
  }
};

const getAllBooks = (req, h) => {
  const data = books.map((book) => {
    const { id, name, publisher } = book;

    return {
      id,
      name,
      publisher,
    };
  });

  const response = h.response({
    status: 'success',
    data: {
      data,
    },
  });

  response.code(200);
  return response;
};

const getBooksById = (req, h) => {
  const { bookId } = req.params;
};

const updateBooksById = (req, h) => {};

const deleteBooksById = (req, h) => {};

module.exports = {
  saveBooks,
  getAllBooks,
  getBooksById,
  updateBooksById,
  deleteBooksById,
};
