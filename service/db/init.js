const config = require('../config/index.js')
/*用来作数据库的连接和一些初始化的事情*/

const mongoose = require('mongoose')

// 引入glob---node的glob模块允许你使用 *等符号, 来写一个glob规则,像在shell里一样,获取匹配对应规则的文件.
const glob = require('glob')

// 引入path
const {resolve} = require('path')

// 数据库地址：'mongodb://用户名:密码@ip地址:端口号/数据库';(默认情况下mongodb是没有启用验证的，就是登陆了随便看，如果要启用认证，需要在启动的时候使用–auth选项)

// const db = `mongodb://${config.mongoDB.userName}:${config.mongoDB.passWord}@${config.mongoDB.hostName}:${config.mongoDB.port}/${config.mongoDB.dataBaseName}`
const db = `mongodb://${config.mongoDB.hostName}:${config.mongoDB.port}/${config.mongoDB.dataBaseName}`

// 替换mongoose里面的Promise为全局Promise  因为mongoose里面的Promise非标准Promise 最新版本已经没有这个问题了
mongoose.Promise =  global.Promise

exports.connect = () => {
  //数据库连接最大次数
  let maxConnectTimes = 0

  // 数据库初次连接
  mongoose.connect(db)

  return new Promise((resolve, reject) => {
    //增加数据库连接的事件监听
    mongoose.connection.on('disconnected',() => {
      console.log('***********数据库断开***********')
      //进行重连
      if(maxConnectTimes<3){
        maxConnectTimes++
        mongoose.connect(db)
      }else{
        reject()
        throw new Error('数据库已经断开......')
      }
    })

    //监听数据库出错误的时候
    mongoose.connection.on('error',(err) => {
      //进行重连
      if(maxConnectTimes<3){
        maxConnectTimes++
        mongoose.connect(db)
      }else{
        reject(err)
        throw new Error('数据库出现错误......')
      }
    })

    //数据库连接成功的时候
    mongoose.connection.once('open',() => {
      resolve()
      console.log('MongoDB Connected successfully!')
    })

  })
}
// exports.initSchemas = () => {
//   const app_path = resolve(__dirname,'./schema')
//   glob.sync(app_path + '/*.js').forEach(require)
// }