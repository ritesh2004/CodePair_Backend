const { Router } = require('express');
const { compileCode } = require('../controllers/compiler');

const router = Router();

router.post('/compile', compileCode);

module.exports = router;
