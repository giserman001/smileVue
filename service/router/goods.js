const router = require('koa-router')()
const goodsController = require('../controller/goods/index.js')

router.get('/insertAllGoodsInfo', goodsController.insertAllGoodsInfo)  // 入库所有商品数据
router.get('/insertAllCategory', goodsController.insertAllCategory)  // 入库商品大类数据
router.get('/insertAllCategorySub', goodsController.insertAllCategorySub)  // 入库商品子类数据
router.post('/getDetailGoodsInfo', goodsController.getDetailGoodsInfo)  // 获取商品详细信息的接口
router.get('/getCategoryList', goodsController.getCategoryList)  // 获取商品大类信息接口
router.post('/getCategorySubList', goodsController.getCategorySubList)  // 获取商品小类信息接口
router.post('/getGoodsListByCategorySubID', goodsController.getGoodsListByCategorySubID)  // 根据商品二级（小）类别获取商品列表

module.exports = router