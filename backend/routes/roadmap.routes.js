const router = require("express").Router();
const auth = require("../middlewares/mockAuth");
const {
  createRoadmap,
  getActiveRoadmap,
  uploadMiddleware // Import middleware
} = require("../controllers/roadmap.controller");

router.post("/create", auth, uploadMiddleware, createRoadmap);
router.get("/active", auth, getActiveRoadmap);

module.exports = router;
