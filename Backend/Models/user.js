const mongoose = require("mongoose")

const UserSchema =  new mongoose.Schema({
    UserName:{
        type:String,
        required:true,
        trim:true
    },
    Email:{
        type:String,
        required:true,
        trim:true
    },
    Phonenumber:{
        type:Number,
        required:true,
        maxlength:10,
    },
    Password:{
        type:String,
        required:true,
        trim:true
    }
})

const UserModel = mongoose.model("user" , UserSchema);

module.exports =  UserModel;