var express = require("express");
var controller = require("../controllers/texts");

const router = express.Router();

router.post('/write',controller.write);

router.get('/read/:id',controller.read);

module.exports = router