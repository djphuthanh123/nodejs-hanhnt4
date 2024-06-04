const mongoose = require('mongoose')
const {Schema, model} = mongoose

const GenreSchema = new Schema({
    name:{
        type: String
    }  
    
})


const Genre = model('Genre', GenreSchema)
module.exports = Genre