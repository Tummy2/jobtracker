// all logic for job apps

const pool = require("../db/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

async function getUserJobs(req, res) {
  authenticate(req, res, async () => {
    try {
      const userJobs = await pool.query(
        "SELECT * FROM job_applications WHERE user_id = $1",
        [req.user.userId]
      );
      res.status(200).json(userJobs.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
}

async function addJobApp(req, res) {
  authenticate(req, res, async () => {
    const { company_name, job_title, app_status, app_date, app_link } =
      req.body;
    const userId = req.user.userId;
    try {
      await pool.query(
        `INSERT INTO job_applications (user_id, company_name, job_title, application_status, application_date, application_link)
            VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, company_name, job_title, app_status, app_date, app_link]
      );
      res.status(201).json({ message: "Job application added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
}

async function modifyJobApp(req, res) {
  authenticate(req, res, async () => {
    const { company_name, job_title, app_status, app_date, app_link } =
      req.body;
    const userId = req.user.userId;
    const { id } = req.params;
    try {
      const result = await pool.query(
        `UPDATE job_applications 
          SET company_name = $1, job_title = $2, application_status = $3, application_date = $4, application_link = $5 
          WHERE id = $6 AND user_id = $7`,
        [company_name, job_title, app_status, app_date, app_link, id, userId]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Failed to modify job application" });
      }

      res
        .status(200)
        .json({ message: "Job application modified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
}

async function deleteJobApp(req, res) {
  authenticate(req, res, async () => {
    const userId = req.user.userId;
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM job_applications WHERE id = $1 AND user_id = $2",
        [id, userId]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Failed to delete job application" });
      }

      res.status(200).json({ message: "Job application deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = { getUserJobs, addJobApp, modifyJobApp, deleteJobApp };
