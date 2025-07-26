const UsersModel = require("../Models/UsersModel")
const bcrypt = require("bcrypt")



exports.createuser = async(req,res)=>{

    const {UserName , Email ,Phonenumber , Password } = req.body;

    try {
        const existinguser = await UsersModel.findOne({Email:Email});

        if(existinguser){
            return res.status(403).json({message:"user already registered"});
        }

        const hashpassword = await bcrypt.hash(Password , 5);

        const resposne = await UsersModel.create({
            UserName:UserName, 
            Email:Email, 
            Phonenumber:Phonenumber, 
            Password:hashpassword
        })
        res.status(201).json({message:"user create success" , resposne});

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}