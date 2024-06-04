const mongoose = require('mongoose')
const {Schema, model} = mongoose

const bookSchema = new Schema({
    isbn: {
        type: String, 
        unique: true,
        maxlength: [10,"isbn be at most 10 characters"],
        required: [true, 'isbn is required']
    },
    title: {
        type: String, 
        required: [true, 'Title is required'],
        maxlength: [255,"Title be at most 255 characters"],
    },
    subTitle: {
        type: String, 
        default: 0,
        maxlength: [50,"Title be at most 50 characters"],
        required: [false, 'Sub title is require']
    },
    publishDate:{
        type: Date, 
        default: Date.now
    },
    publisher:{
        type: String, 
        required: [false, 'publisher is require']
    },
    pages:{
        type: Number, 
        required: [false, 'Pages is required']
    },
    price:{
        type: Number, 
        min: [true, "Price must be at greater than 0"],
        required: [false, 'Price ID is required']
    },
    description:{
        type: String,
        required: [false, 'Description is required']
    },
    website:{
        type: String, 
        required: [false, 'Category ID is required']
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        required: [false, 'Comments ID is required'],
        ref: 'comment'
    }],
})



bookSchema.set('toObject', { virtuals: true });
bookSchema.set('toJSON', { virtuals: true });

const Book = model('Book', bookSchema)
module.exports = Book