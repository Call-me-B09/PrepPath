const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/sync", userController.syncUser);

module.exports = router;
