const { nanoid } = require('nanoid');
const books = require('./books');

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

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  } catch (error) {
    
  }
};

const getAllBooks = (req, h) => {};

const getBooksById = (req, h) => {};

const updateBooksById = (req, h) => {};

const deleteBooksById = (req, h) => {};

module.exports = {
  saveBooks,
  getAllBooks,
  getBooksById,
  updateBooksById,
  deleteBooksById,
};
