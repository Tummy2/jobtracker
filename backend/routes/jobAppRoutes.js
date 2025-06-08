// routes for everything job app related

const express = require("express");
const router = express.Router();
const {
  getUserJobs,
  addJobApp,
  modifyJobApp,
  deleteJobApp,
} = require("../controllers/jobAppsController");

router.get("/", getUserJobs);
router.post("/", addJobApp);
router.put("/:id", modifyJobApp);
router.delete("/:id", deleteJobApp);

module.exports = router;
