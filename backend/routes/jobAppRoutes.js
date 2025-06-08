// routes for everything job app related

const express = require("express");
const router = express.Router();
const {
  getUserJobs,
  addJobApp,
  modifyJobApp,
  deleteJobApp,
} = require("../controllers/jobAppsController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, getUserJobs);
router.post("/", authenticate, addJobApp);
router.put("/:id", authenticate, modifyJobApp);
router.delete("/:id", authenticate, deleteJobApp);

module.exports = router;
