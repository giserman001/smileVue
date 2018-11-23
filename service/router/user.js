const router = require('koa-router')()
const userController = require('../controller/user/index.js')

router.post('/register', userController.register)  // 用户注册
router.post('/login', userController.login)  // 用户注册

module.exports = router