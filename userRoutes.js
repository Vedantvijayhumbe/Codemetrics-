const express = require("express");
const { addUser, getUser } = require("../controllers/userController");

const router = express.Router();

router.post("/addUser", addUser);
router.get("/user/:username", getUser);

module.exports = router;
