

module.exports = (router) => {
	router.use('/user', require('./user').router);
	router.use('/admin', require('./user/admin').router);
	router.use('/video', require('./video').router);
}