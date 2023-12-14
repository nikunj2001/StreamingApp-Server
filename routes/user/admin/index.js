const { Router } = require('express');
const controller = require('./controller');
const router = Router();


router.post('/create', controller.createAdmin);
router.post('/login', controller.loginAdmin);


module.exports.router = router;
