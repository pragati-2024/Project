const express = require("express");
const { createuser } = require("../Middleware/UsersMiddleware");
const UsersRoutes = express.Router(); 

UsersRoutes.post("/signup" , createuser)

module.exports = UsersRoutes;