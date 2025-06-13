// all logic for users and authorization

const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

async function getUser(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hashedPassword]
    );

    if (result.rowCount === 0) {
      throw new Error("User not inserted");
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "24h" });
    res.status(200).json({token});
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
      `SELECT id, username, email, password_hash FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUser(req, res) {
  const userId = req.user.userId;

  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getUser, registerUser, loginUser, deleteUser };