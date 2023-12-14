const { Router } = require('express');
const controller = require('./controller');
const router = Router();


router.post('/create', controller.createUser);
router.post('/login', controller.loginUser);


module.exports.router = router;
