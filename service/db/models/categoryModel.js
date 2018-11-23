var mongoose = require('mongoose')

var categoryModel = require('../schemas/categorySchema')


var Category = mongoose.model('Category', categoryModel)


module.exports = Category