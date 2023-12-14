const { Router } = require('express');
const controller = require('./controller');
const adminAuth = require('../../utils/adminAuth');
const router = Router();

router.post('/upload', adminAuth, controller.uploadVideo);
router.get('/', adminAuth, controller.getVideos);

module.exports.router = router;