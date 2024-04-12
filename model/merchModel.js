const mongoose = require('mongoose')

const merchSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        required:true
    }
},{timestamps:true})

const merchModel = mongoose.model('merchModel', merchSchema)

module.exports = merchModel