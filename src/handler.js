const { nanoid } = require('nanoid');
const books = require('./books');
const ValidationException = require('./exceptions/ValidationException');
const NotFoundException = require('./exceptions/NotFoundException');

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

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
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
      insertedAt,
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
  const filter = req.query;

  let data = books.map((book) => {
    const { id, name, publisher } = book;

    return {
      id,
      name,
      publisher,
    };
  });

  // filter name
  if (filter.name !== undefined || filter.name?.length > 0) {
    data = books
      .filter(
        (book) => book.name
          .toLocaleLowerCase()
          .indexOf(filter.name.toLocaleLowerCase()) > -1,
      )
      .map((book) => {
        const { id, name, publisher } = book;

        return {
          id,
          name,
          publisher,
        };
      });
  }

  // filter reading
  if (filter.reading !== undefined || filter.reading?.length > 0) {
    if ([0, 1].includes(+filter.reading)) {
      data = books
        .filter((book) => book.reading === Boolean(+filter.reading))
        .map((book) => {
          const { id, name, publisher } = book;

          return {
            id,
            name,
            publisher,
          };
        });
    }
  }

  // filter finished
  if (filter.finished !== undefined || filter.finished?.length > 0) {
    if ([0, 1].includes(+filter.finished)) {
      data = books
        .filter((book) => book.finished === Boolean(+filter.finished))
        .map((book) => {
          const { id, name, publisher } = book;

          return {
            id,
            name,
            publisher,
          };
        });
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: data,
    },
  });

  response.code(200);
  return response;
};

const getBooksById = (req, h) => {
  try {
    const { bookId } = req.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book === undefined) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });

    response.code(404);
    return response;
  }
};

const updateBooksById = (req, h) => {
  try {
    const { bookId } = req.params;
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

    // validation name
    if (name === undefined || name?.length < 1) {
      throw new ValidationException(
        'Gagal memperbarui buku. Mohon isi nama buku',
      );
    }

    // validation readPage
    if (readPage > pageCount) {
      throw new ValidationException(
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      );
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index < 0) {
      throw new NotFoundException('Gagal memperbarui buku. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();
    const data = {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    books[index] = {
      ...books[index],
      ...data,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
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
      status: 'fail',
      message: error.message,
    });

    response.code(404);
    return response;
  }
};

const deleteBooksById = (req, h) => {
  try {
    const { bookId } = req.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index < 0) {
      throw new NotFoundException('Buku gagal dihapus. Id tidak ditemukan');
    }

    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });

    response.code(404);
    return response;
  }
};

module.exports = {
  saveBooks,
  getAllBooks,
  getBooksById,
  updateBooksById,
  deleteBooksById,
};
