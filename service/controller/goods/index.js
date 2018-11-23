const Category = require('../../db/models/categoryModel')
const categorySub = require('../../db/models/categorySubModel')
const Goods = require('../../db/models/goodsModel')
const helper = require('./helper')
const fs = require('fs')

module.exports = {
  // 入库所有商品数据
  insertAllGoodsInfo: async (ctx, next) => {
    fs.readFile('./data_json/goods.json', {encoding:'utf-8'}, function(err, data){
      data = JSON.parse(data) // 转成json
      let saveCount = 0 // 保存次数
      data.RECORDS.map((value, index) => {
        let newGoods = new Goods(value) // 循环创建商品实例
        newGoods.save().then(() => {
          saveCount++
          console.log(`成功${saveCount}`)
        }).catch((err) => {
          console.log(`失败：${err}`)
        })
      })
      ctx.body="开始导入数据"
    })
  },
  // 入库商品大类数据
  insertAllCategory: async (ctx, next) => {
    fs.readFile('./data_json/category.json', {encoding: 'utf-8'}, function(err, data){
      data = JSON.parse(data)
      let saveCount = 0
      data.RECORDS.map((value, index) => {
        let newCategory = new Category(value)
        newCategory.save().then(() => {
          saveCount++
          console.log('成功'+saveCount)
        }).catch((err) => {
          console.log('失败：'+err)
        })
      })
      ctx.body="开始导入数据"
    })
  },
  // 入库商品子类数据
  insertAllCategorySub: async (ctx, next) => {
    fs.readFile('./data_json/category_sub.json','utf8',(err,data)=>{
      data = JSON.parse(data)
      let saveCount = 0
      data.RECORDS.map((value,index)=>{
        let newCategorySub = new CategorySub(value)
        newCategorySub.save().then(()=>{
            saveCount++
            console.log('成功插入' + saveCount)
        }).catch(error=>{
            console.log('插入失败:' + error)
        })
      })
      ctx.body="开始导入数据"
    })
  },
  //获取商品详细信息的接口
  getDetailGoodsInfo: async (ctx, next) => {
    try{
      let goodsId = ctx.request.body.goodsId
      let result=await Goods.findOne({ID:goodsId}).exec()
      ctx.body={
        code: 200,
        data: result,
        status: true,
        message: '成功获取商品详细信息！'
      }
    }catch(err){
      ctx.body = {
        code: 500,
        data: null,
        message: err,
        status: false
      }
    }
  },
  // 获取商品大类信息接口
  getCategoryList: async (ctx, next) => {
    try {
      let data = await Category.find().exec()
      ctx.body = {code: 200, message: '获取商品大类成功',data: data}
    }catch(err) {
      ctx.body={code: 500, message: err, status: false}
    }
  },
  // 获取商品小类信息接口
  getCategorySubList: async (ctx, next) => {
    try {
      let categoryId = ctx.request.body.categoryId
      let data = await categorySub.find({MALL_CATEGORY_ID:categoryId}).exec()
      ctx.body = {code: 200, message: '获取商品小类成功',data: data}
    }catch(err) {
      ctx.body={code: 500, message: err, status: false}
    }
  },
  // 根据商品二级（小）类别获取商品列表
  getGoodsListByCategorySubID: async (ctx, next) => {
    try{
      let categorySubId = ctx.request.body.categorySubId //小类别
      let page =ctx.request.body.page // 页码数
      let pageSize =ctx.request.body.pageSize //每页显示数量
      let num = pageSize || 10
      let start = (page-1)*num
      let result = await Goods.find({SUB_ID:categorySubId}).skip(start) .limit(num).exec()
      ctx.body={code:200,message:'获取成功', data:result}
    }catch(err){
      ctx.body={code:500,message:err}
    }
  }
}