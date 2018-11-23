var mongoose = require('mongoose')

var goodsSchema = require('../schemas/goodsSchema')

var Goods = mongoose.model('Goods', goodsSchema)

module.exports = Goods