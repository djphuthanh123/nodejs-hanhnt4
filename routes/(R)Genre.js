var express = require('express');
var router = express.Router();
const { Genre } = require('../models');



router.get('/get-all/', async function(req, res, next) {
  try {
    const genres = await Genre.find();
    res.status(200).json({
      success: true,
      genres: genres
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});
router.get('/get-by-id/:id', async (req,res) => {
    try {
        
    }catch(Error) {
        console.log(Error.message)
        res.status(400).send(Error)    
    }
})
router.post('/create/', async function(req, res, next) {
  try {
    const genre = new Genre(req.body);
    const savedGenre = await genre.save();
    res.status(201).json({
      success: true,
      genre: savedGenre
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
      console.error('Error saving genre:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedGenre = await Genre.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.status(200).json({
      success: true,
      genre: updatedGenre
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate Key Error:', error.message);
      res.status(400).json({ error: 'Duplicate key error: name must be unique.' });
    } else if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.message);
      let validator = new Map();
      Object.keys(error.errors).forEach(field => validator.set(field, error.errors[field].message));
      let errorResponse = {};
      validator.forEach((message, field) => { errorResponse[field] = message; });
      res.status(400).json({ error: errorResponse });
    } else {
      console.error('Error updating genre:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const deletedGenre = await Genre.findByIdAndDelete(id);
    if (!deletedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Genre deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

module.exports = router;
