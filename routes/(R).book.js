var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { Book, Comment } = require('../models');

// get all book
router.get('/get-all', async function(req, res, next) {
  try {
    const productsFromServer = await Book.find({})
                                            .populate('comments')
                                            .lean();
    res.status(200).json({
      success: true, 
      products: [...productsFromServer]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      success: false, 
      msg: err.message });
  }
});

// create book
router.post('/create/',async function(req, res, next){
  const bookFromClient = req.body
  if (bookFromClient !== null) {
        const book = new Book(bookFromClient);
        try {
            const savedBook = await book.save();
            console.log('Book saved successfully:', savedBook);
            return res.status(200).json(savedBook);
        } catch (error) {
          let validtionError = error.name === 'ValidationError'
            if (validtionError) {
                console.error('Validation Error:', error.message);
                let validator = new Map()
                Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
                let errorResponse = {};
                validator.forEach((message, field) => {errorResponse[field] = message;});
                res.status(500).json({ error: errorResponse });
            } else {
                console.error('Error saving product:', error);
            }
        }
    }
  
})
// Get book by id
router.get('/:bookId', async function(req, res, next) {
  try {
    const { bookId } = req.params;
    const bookFromServer = await Book.findById(bookId);
    if (!bookFromServer) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).send({
      success: true,
      book: bookFromServer
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Put book by id
router.put('/:bookId', async function(req, res, next) {
  try {
    const { bookId } = req.params;
    const updateData = req.body; 
        console.log(updateData)

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: false });
    console.log(updatedBook)
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).send({
      success: true,
      book: updatedBook
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.message);
      let validator = new Map();
      Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
      let errorResponse = {};
      validator.forEach((message, field) => { errorResponse[field] = message; });
      res.status(400).json({ error: errorResponse });
    } else {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Delete book
router.delete('/:bookId', async function(req, res, next) {
  try {
    const { bookId } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).send({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// add comment
router.post('/create/:bookId/comments',async function(req, res, next){
  try {
    const { rating,comment,author } = req.body
    const bookIdFromClient = req.params.bookId
    const bookFromServer = await Book.findById(bookIdFromClient)
    if (bookFromServer !== null){
    const commentObject = new Comment( {rating ,comment ,author})
    const savedComment = await commentObject.save();
    bookFromServer.comments.push(savedComment._id);
    await bookFromServer.save();
    res.status(200).json(savedComment)
  }
  }catch (error){
    let validtionError = error.name === 'ValidationError'
            if (validtionError) {
                console.error('Validation Error:', error.message);
                let validator = new Map()
                Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
                let errorResponse = {};
                validator.forEach((message, field) => {errorResponse[field] = message;});
                res.status(500).json({ error: errorResponse });
            } else {
                console.error('Error saving product:', error);
            }
  }
})
// Update comment
router.patch('/patch/:bookId/comments/:commentId',async function(req, res, next){
  try {
    const { bookId, commentId } = req.params;
    const { rating, comment, author } = req.body;
    const bookFromServer = await Book.findById(bookId).populate('comments');
    if (!bookFromServer) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const commentToUpdate = await Comment.findById(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (rating !== undefined) commentToUpdate.rating = rating;
    if (comment !== undefined) commentToUpdate.comment = comment;
    if (author !== undefined) commentToUpdate.author = author;

    const updatedComment = await commentToUpdate.save();

    res.status(200).json(updatedComment);
  
  }catch (error){
    let validtionError = error.name === 'ValidationError'
            if (validtionError) {
                console.error('Validation Error:', error.message);
                let validator = new Map()
                Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
                let errorResponse = {};
                validator.forEach((message, field) => {errorResponse[field] = message;});
                res.status(500).json({ error: errorResponse });
            } else {
                console.error('Error saving product:', error);
            }
  }
})
// delete comment
router.delete('/delete/:bookId/comments/:commentId', async function(req, res, next){
  try {
    const {bookId, commentId} = req.params
    const bookFromServer = await Book.findById(bookId).populate('comments')
    if (!bookFromServer) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const commentToDelete = await Comment.findByIdAndDelete(commentId);
    if (!commentToDelete) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    bookFromServer.comments.pull(commentId);
    await bookFromServer.save();
    res.status(200).send({
      success: true,
      msg: commentToDelete
    })
  } catch(error) {
    let validtionError = error.name === 'ValidationError'
            if (validtionError) {
                console.error('Validation Error:', error.message);
                let validator = new Map()
                Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
                let errorResponse = {};
                validator.forEach((message, field) => {errorResponse[field] = message;});
                res.status(500).json({ error: errorResponse });
            } else {
                console.error('Error saving product:', error);
            }
  }
})
// delet all comment by id 
router.delete('/delete/:bookId/comments', async function(req, res, next) {
  try {
    const { bookId } = req.params;
    const { commentIds } = req.body; 

    const bookFromServer = await Book.findById(bookId).populate('comments');
    if (!bookFromServer) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!Array.isArray(commentIds)) {
      return res.status(400).json({ message: 'commentIds must be an array' });
    }

    const deletedComments = [];
    for (const commentId of commentIds) {
      const commentToDelete = await Comment.findByIdAndDelete(commentId);
      if (commentToDelete) {
        bookFromServer.comments.pull(commentId);
        deletedComments.push(commentToDelete);
      }
    }

    await bookFromServer.save();

    res.status(200).send({
      success: true,
      msg: 'Comments deleted successfully',
      deletedComments
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.message);
      let validator = new Map();
      Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
      let errorResponse = {};
      validator.forEach((message, field) => { errorResponse[field] = message; });
      res.status(400).json({ error: errorResponse });
    } else {
      console.error('Error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// get all comment by book id
router.get('/:bookId/comments', async function(req, res, next) {
  try {
    const { bookId } = req.params;

    const bookFromServer = await Book.findById(bookId).populate('comments');
    if (!bookFromServer) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).send({
      success: true,
      comments: bookFromServer.comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});


router.get('/price/lower-than/:maxPrice', async function(req, res, next) {
  try {
    const { maxPrice } = req.params;

    if (isNaN(maxPrice)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    const books = await Book.find({ price: { $lt: maxPrice } });

    res.status(200).send({
      success: true,
      books: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

module.exports = router;
