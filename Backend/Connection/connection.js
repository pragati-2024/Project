const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Moketon:Moketon@123@moketon.sjkfjma.mongodb.net/").then(()=>{
    console.log("my mongo is connected")
}).catch(()=>{
    console.log("connection failed")
})