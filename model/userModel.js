const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    login:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
    },
},{timestamps:true})

const userModel = mongoose.model('userModel', userSchema)

module.exports = userModel