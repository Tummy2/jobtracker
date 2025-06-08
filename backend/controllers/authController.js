// all logic for users and authorization

const pool = require("../db/db");
const bycrypt = require("bycrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET

async function registerUser(req, res) {
    
}