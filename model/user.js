const mongoose=require('mongoose')
const text = require('body-parser/lib/types/text')
const router = require('../routes/articles')

//Schema

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User=module.exports=mongoose.model('User',UserSchema)