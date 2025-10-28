const Job = require("../models/Job");
const parseVErr = require("../utils/parseValidationErr");

const listJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.render("jobs", { jobs });
};

const showAddForm = (req, res) => {
  res.render("job", { job: null });
};

const createJob = async (req, res) => {
  try {
    await Job.create({ ...req.body, createdBy: req.user._id });
    res.redirect("/jobs");
  } catch (e) {
    parseVErr(e, req);
    res.render("job", { job: null });
  }
};

const showEditForm = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) return res.redirect("/jobs");
  res.render("job", { job });
};

const updateJob = async (req, res) => {
  try {
    await Job.updateOne(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: req.body }
    );
    res.redirect("/jobs");
  } catch (e) {
    parseVErr(e, req);
    const job = await Job.findById(req.params.id);
    res.render("job", { job });
  }
};

const deleteJob = async (req, res) => {
  await Job.deleteOne({ _id: req.params.id, createdBy: req.user._id });
  res.redirect("/jobs");
};

module.exports = {
  listJobs,
  showAddForm,
  createJob,
  showEditForm,
  updateJob,
  deleteJob,
};
