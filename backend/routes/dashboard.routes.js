const router = require("express").Router();
const auth = require("../middlewares/mockAuth");
const { getDashboardOverview } = require("../controllers/dashboard.controller");

router.get("/overview", auth, getDashboardOverview);

module.exports = router;
