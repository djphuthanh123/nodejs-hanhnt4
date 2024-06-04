var express = require('express');
var router = express.Router();
const { Comment } = require('../models');


router.get('/get-all', async function(req, res, next) {
    try {
        const commentsFromServer = await Comment.find()
        console.log(commentsFromServer)
        if (commentsFromServer !== null){
            return res.status(200).send({
                success: true,
                data: commentsFromServer
            })
        }
    }catch(err) {
        console.log(err);
            return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
});
router.get('/get-by-id/:id', async (req,res) => {
    try {
        const idFromClient = req.params.id
        const commentFromServer = await Comment.findById(idFromClient)
        commentFromServer !== null 
        ? res.send(commentFromServer) 
        : res.send("Dont have any object contain (your Id : " + idFromClient + ") you provided")
    }catch(Error) {
        console.log(Error.message)
        res.status(400).send(Error)    
    }
})
router.post('/create/',async function(req, res, next){
    try{
        const commentFromClient = req.body
        if (commentFromClient !== null) {
            const comment = new Comment(commentFromClient);
        try {
            const savedComment = await comment.save();
            console.log('Comment saved successfully:', savedComment);
            return res.status(200).json(savedComment);
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
                console.error('Error saving Comment:', error);
            }
        }
    }
    }catch (err){
        console.log(err);
            return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
})
router.delete('/delete/:id', async function(req, res, next){
    try {
        const idFromClient = req.params.id
        const findIdFromServer = await Comment.findByIdAndDelete(idFromClient)
        res.status(200).send(findIdFromServer)
    }catch(Error) {
        console.log(Error)
        res.status(400).send(Error)
    }
})
router.patch('/patch/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({
      success: true,
      comment: updatedComment
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
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});


module.exports = router;
