const express = require("express");
const router = express.Router();
const controllers = require("../controllers/statisticsController");

router.get("/", controllers.summary);
router.get("/markers", controllers.markers);

module.exports = router;
