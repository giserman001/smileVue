const Koa = require('koa')
const app = new Koa()
const config = require('./config/index.js') // 配置文件
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser') // 解析post提交的数据中间件
const cors = require('koa2-cors') // 解决前端请求跨域中间件
const goodsRouter = require('./router/goods')
const userRouter = require('./router/user')
const {connect} = require('./db/init.js')
const koajwt = require('koa-jwt');
const secret = 'tokensecret'; //撒盐：加密的时候混淆
// 立即执行函数
;(async () => {
  await connect() // 数据库连接
})()
// middleware开发
// const notFoundPageAsync  = require('./middleWare/404')


// 装载中间件
app.use(bodyParser())
app.use(cors())
// app.use(notFoundPageAsync())

// 无权限接口错误处理（注意！！！！！！一定要在koajwt之前）
app.use((ctx, next) => {
  return next().catch((err) => {
      if(err.status === 401){
        ctx.status = 401;
        ctx.body = {code: 401, data: null, message: '无权限访问',status: false};
      }else{
        throw err;
      }
  })
})
// 开启接口验证是否有权限
app.use(koajwt({
	secret: secret
}).unless({
	path: [/\/user\/login/, /\/user\/register/] //不去要验证接口
}))

// 装载所有子路由
let router = new Router()
router.use('/user',userRouter.routes())
router.use('/goods',goodsRouter.routes())

// 加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods())
// 监听端口
app.listen(config.host.port, () => {
  console.log(`[Koa Server] starting at port ${config.host.port}`)
})