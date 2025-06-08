// all logic for users and authorization

const pool = require("../db/db");
const bycrypt = require("bycrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const hashedPassword = await bycrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
    const user = result.rows[0];
    const validPassword = await bycrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "24h" });
    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const result = await pool.query(
      `SELECT id, username, email, hashed_password FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
    const user = result.rows[0];
    const validPassword = await bycrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { registerUser, loginUser };