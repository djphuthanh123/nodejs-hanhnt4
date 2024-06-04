const mongoose = require('mongoose')
const {Schema, model} = mongoose

const commentSchema = new Schema({
    rating: {
        type: Number, 
        required: false
    },
    comment:{
        type: String,
          
    }, 
    author: {
        type: String
    }
})


const Comment = model('comment', commentSchema)
module.exports = Comment