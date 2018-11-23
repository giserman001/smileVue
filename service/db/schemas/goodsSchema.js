// 引用mongoose
const mongoose = require('mongoose')

// 声明Schema
const Schema = mongoose.Schema
console.log('我执行了Goods')

// 声明Object类型
let ObjectId = Schema.Types.ObjectId

// 用户Schema
//注意点：创建model，这个地方的ch_user对应mongodb数据库中ch_users的conllection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money  
// 解决办法：在schema后面再加一个对象 如下：{ collections:'Goods'}
const goodsSchema  = new Schema({
  goodsID:ObjectId,
  ID:{unique:true,type:String},
  GOODS_SERIAL_NUMBER:String,
  SHOP_ID:String,
  SUB_ID:String,
  GOOD_TYPE:Number,
  STATE:Number,
  NAME:String,
  ORI_PRICE:Number,
  PRESENT_PRICE:Number,
  AMOUNT:Number,
  DETAIL:String,
  BRIEF:String,
  SALES_COUNT:Number,
  IMAGE1:String,
  IMAGE2:String,
  IMAGE3:String,
  IMAGE4:String,
  IMAGE5:String,
  ORIGIN_PLACE:String,
  GOOD_SCENT:String,
  CREATE_TIME:String,
  UPDATE_TIME:String,
  IS_RECOMMEND:Number,
  PICTURE_COMPERSS_PATH:String
},{
  collections:'Goods'
})

module.exports = goodsSchema