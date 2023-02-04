const {
  saveBooks,
  getAllBooks,
  getBooksById,
  updateBooksById,
  deleteBooksById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBooksById,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBooksById,
  },
];

module.exports = routes;
