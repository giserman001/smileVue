var mongoose = require('mongoose')

var categorySubModel = require('../schemas/categorySubSchema')

var categorySub = mongoose.model('categorySub', categorySubModel)

module.exports = categorySub