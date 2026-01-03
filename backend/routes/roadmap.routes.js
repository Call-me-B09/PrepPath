const router = require("express").Router();
const auth = require("../middlewares/mockAuth");
const {
  createRoadmap,
  getActiveRoadmap,
  toggleStep,
  deleteRoadmap,
  uploadMiddleware // Import middleware
} = require("../controllers/roadmap.controller");

router.post("/create", auth, uploadMiddleware, createRoadmap);
router.get("/active", auth, getActiveRoadmap);
router.patch("/step/:stepId", auth, toggleStep);
router.delete("/reset", auth, deleteRoadmap);

module.exports = router;
