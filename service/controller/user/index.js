const User = require('../../db/models/userModel')
const jwt = require('jsonwebtoken')
const secret = 'tokensecret'; //撒盐：加密的时候混淆
const helper = require('./helper') // 工具类函数

module.exports = {
  // 用户注册
  register: async (ctx, next) => {
    console.log(ctx.request.body)
    await User.findOne({username: ctx.request.body.username}).exec().then(async(res) => {
      console.log(res)
      if (res) {
        ctx.body={
          code:201,
          data:null,
          status:false,
          message:'该用户名已经注册过了'
        }
      } else {
        //把从前端接收的POST数据封装成一个新的user对象
        let newUser = new User(ctx.request.body)
        //用mongoose的save方法直接存储，然后判断是否成功，返回相应的结果
        await newUser.save().then(()=>{
          //成功返回code=200，并返回成功信息
          ctx.body={
            code:200,
            data:null,
            status:true,
            message:'注册成功'
          }
        }).catch(error=>{
          //失败返回code=500，并返回错误信息
          ctx.body={
            code:500,
            data:false,
            message:error
          }
        })
      }
    })
  },
  // 登录
  login: async (ctx, next) => {
    //得到前端传递过来的登录数据
    let loginUser = ctx.request.body
    let userName = loginUser.userName
    let password = loginUser.password
    if(!userName || !password){
      return ctx.body = {
        code: '200',
        data: null,
        status: false,
        msg: '参数不合法'
      }
    }
    await User.findOne({username: userName}).exec().then(async(res) => {
      if (res) {
        //当用户名存在时，开始比对密码
        let buildUser = new User()  // 因为是实例方法，所以要new出对象，才能调用
        await buildUser.comparePassword(password, res.password).then(re => {
          if (re) {
            const token = jwt.sign({
              name: userName,
              _id: res._id
            }, secret, {
              expiresIn: '2h' // //2小时到期时间
            })
            ctx.body={ code:200, data: token, message:'登陆成功', status: true }
          } else {
            ctx.body={ code:200, data: null, message:'密码不匹配', status: false }
          }
        })
        .catch(err => {
          ctx.body={ code:500,data: '系统报错', message:err, status: false}
        })
      } else {
        ctx.body={
          code:200,
          data:null,
          status: false,
          message:'用户名不存！'
        }
      }
    }).catch(async(err) => {
      ctx.body={ code:500,data: '系统出错', message:err ,status: false}
    })
  }
}