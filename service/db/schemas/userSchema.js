// 引用mongoose
const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');

// 声明Schema
const Schema = mongoose.Schema
console.log('我执行了User')

// 声明Object类型
let ObjectId = Schema.Types.ObjectId

// 用户Schema
const userSchema = new Schema({
  userid:ObjectId,
  username:{unique:true,type:String},
  password:{type:String},
  creattime:{type:Date,default:Date.now()},
  lastlogintime:{type:Date,default:Date.now()}
}, {
  collection:'user'
})
userSchema.methods = {
  // 密码，用户名比对
  comparePassword (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password,password,(err,res)=>{
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }
}
userSchema.pre('save', function(next){
  let that = this
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err)
    bcrypt.hash(that.password, salt, function(err, hash) {
      if(err) return next(err)
      that.password = hash
      next()
    });
  });
})

module.exports = userSchema