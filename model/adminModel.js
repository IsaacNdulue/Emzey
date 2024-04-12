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
    isAdmin:{
        type:Boolean,
        default:false
    },
    login:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
    },
},{timestamps:true})

const adminModel = mongoose.model('adminModel', userSchema)

module.exports = adminModel