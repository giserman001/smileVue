<template>
  <div class="home">
    <div class="search-bar">
      <van-row>
          <van-col span="3"><img :src="locationIcon" width="80%" class="location-icon"/></van-col>
          <van-col span="16"><input type="text" placeholder="查找" class="search-input"/></van-col>
          <van-col span="5"><van-button size="mini">查找</van-button></van-col>
      </van-row>
    </div>
    <div class="swiper-area">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(banner,index) in bannerPicArray" :key="index">
            <img v-lazy="banner.imageUrl" width="100%"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="type-bar">
      <div  v-for="(cate,index) in category" :key="index" class="category">
        <img v-lazy="cate.image" width="100%" />
        <span>{{cate.mallCategoryName}}</span>
      </div>
    </div>
    <div class="ad-banner">
      <img v-lazy="adBanner.PICTURE_ADDRESS" width="100%">
    </div>
    <div class="recommend-area">
      <div class="recommend-title">
          商品推荐
      </div>
      <div class="recommend-body">
        <swiper :options="swiperOption">
          <swiper-slide v-for=" (item ,index) in recommendGoods" :key="index">
            <div class="recommend-item">
              <img :src="item.image" width="80%"/>
              <div>{{item.goodsName}}</div>
              <div>￥{{item.price | moneyFilter}} (￥{{item.mallPrice}})</div>
            </div>
          </swiper-slide>
      </swiper>
      </div>
    </div>
    <floor-component :floorData="floor1" :titleData="floorName.floor1Name" :floorNum="1"></floor-component>
    <floor-component :floorData="floor2" :titleData="floorName.floor2Name" :floorNum="2"></floor-component>
    <floor-component :floorData="floor3" :titleData="floorName.floor3Name" :floorNum="3"></floor-component>
    <div class="hot-area">
      <div class="hot-title">热卖商品</div>
      <div class="hot-goods">
        <!--这里需要一个list组件-->
        <van-list>
          <van-row gutter="20" style="margin-left:0;margin-right:0;">
            <van-col span="12" v-for="( item, index) in hotGoods" :key="index">
              <goodsInfo :goodsId="item.goodsId" :goodsImage="item.image" :goodsName="item.name" :goodsPrice="item.price"></goodsInfo>
            </van-col>
          </van-row>
        </van-list>
      </div>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { toMoney } from '@/components/filter/moneyFilter'
import floorComponent from '../component/floorComponent'
import goodsInfo from '../component/goodsInfoComponent'
import axios from 'axios'
import url from '@/serviceAPI.config.js'
export default {
  name: 'shoppingMail',
  data () {
    return {
      locationIcon: require('../../assets/images/location.png'),
      category:[],
      hotGoods:[], //热卖商品
      floor1:[], // 楼层1数据
      floor2:[], // 楼层2的数据
      floor3:[], // 楼层3的数据
      floorName:{
        floor1Name:'休闲食品',
        floor2Name:'新鲜水果',
        floor3Name:'营养奶品',
      }, // 楼层名字
      swiperOption: {
        slidesPerView:3,
        mousewheel:true,
        loop:true // 无限循环滚动
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable:true // 让分页器可以自由选择
        // }
      },
      adBanner:'',
      recommendGoods:[],// 推荐商品
      bannerPicArray:[
        {imageUrl:require('@/assets/images/img1.png')},
        {imageUrl:require('@/assets/images/img2.png')},
        {imageUrl:require('@/assets/images/img3.png')},
      ]
    }
  },
  created(){
    axios({
      url:url.getShoppingMallInfo,
      method:'get'
    }).then(res => {
      console.log(res)
      if(res.status==200){
        this.category=res.data.data.category;//商品分类
        this.adBanner = res.data.data.advertesPicture //获得广告图片
        this.recommendGoods = res.data.data.recommend  //推荐商品
        this.floor1 = res.data.data.floor1 // 楼层1数据
        this.floor2 = res.data.data.floor2 // 楼层2数据
        this.floor3 = res.data.data.floor3 // 楼层3数据
        this.hotGoods = res.data.data.hotGoods // 热卖商品
      }
    }).catch(res => {})
  },
  components:{
    swiper,
    swiperSlide,
    floorComponent,
    goodsInfo
  },
  filters:{
    moneyFilter(money){
      return toMoney(money)
    }
  }
}
</script>
<style lang="scss" scoped>
  $colorvariable: #e5017d;
  .search-bar{
    height: 2.2rem;
    text-align: center;
    background-color: $colorvariable;
    line-height:2.2rem;
    .search-input{
      width:100%;
      height: 1.3rem;
      border-top:0px;
      border-left:0px;
      border-right:0px;
      border-bottom: 1px solid !important ;
      background-color: #e5017d;
      color:#fff;
    }
    .location-icon{
      padding-top: .1rem;
      padding-left: .3rem;
    }
  }
  .swiper-area{
    width:100%;
    clear:both;
  }
  .type-bar{
    background-color: #fff;
    margin:.4rem .2rem .4rem .2rem;
    border-radius: .3rem;
    font-size:14px;
    display: flex;
    display: -webkit-flex;
    flex-direction:row;
    flex-wrap:nowrap;
    div.category {
      flex:1;
      -webkit-flex:1;
      padding: .3rem;
      font-size: 12px;
      text-align: center;
    }
  }
  .recommend-area{
    background-color: #fff;
    margin-top: .3rem;
    .recommend-title{
      border-bottom:1px solid #eee;
      font-size:14px;
      padding:.2rem;
      color:#e5017d;
    }
    .recommend-body{
      border-bottom: 1px solid #eee;
      .recommend-item{
        width:99%;
        border-right: 1px solid #eee;
        font-size: 12px;
        text-align: center;
      }
    }  
  }
  .hot-area{
    text-align: center;
    font-size:14px;
    height: 1.8rem;
    line-height:1.8rem;
  }
  .type-bar div{
    flex:1;
  }
  .hot-goods{
    height: 130rem;
    overflow: hidden;
    background-color: #fff;
  }
</style>
