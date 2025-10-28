const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  listJobs,
  showAddForm,
  createJob,
  showEditForm,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.use(auth);

router.get("/", listJobs);
router.get("/new", showAddForm);
router.post("/", createJob);
router.get("/edit/:id", showEditForm);
router.post("/update/:id", updateJob);
router.post("/delete/:id", deleteJob);

module.exports = router;
