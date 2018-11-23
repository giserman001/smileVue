<template>
    <div>
      <div class="navbar-div">
        <van-nav-bar title="类别列表"/>
      </div>
      <van-row>
        <van-col span="6">
          <div id="leftNav">
            <ul>
              <li v-for="(item,index) in category" :key="index" :class="{categoryActive:categoryIndex==index}" @click="clickCategory(index,item.ID)">
                {{item.MALL_CATEGORY_NAME}}
              </li>
            </ul>
        </div>
        </van-col>
        <van-col span="18">
          <div class="tabCategorySub">
            <van-tabs v-model="active" @click="onClickCategorySub">
              <van-tab v-for="(item, index) in categorySub" :key="index" :title="item.MALL_SUB_NAME">
              </van-tab>
            </van-tabs>
          </div>
          <div id="list-div">
            <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
                >
                <div class="list-item" v-for="(item,index) in goodList" :key="index" @click="goGoodsInfo(item.ID)">
                  <div class="list-item-img"><img :src="item.IMAGE1" :onerror="errorImg" width="100%"/></div>
                  <div class="list-item-text">
                    <div>{{item.NAME}}</div>
                    <div class="">￥{{item.ORI_PRICE | moneyFilter}}</div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-col>
      </van-row>
    </div>
</template>
<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import {Toast} from 'vant'
    import {toMoney} from '@/components/filter/moneyFilter.js'
    export default {
      data() {
        return {
          errorImg:'this.src="' + require('@/assets/images/errorimg.png') + '"'   ,  //错误图片显示路径
          category:[],
          categoryIndex:0,
          categorySub:[],
          active:0,    //激活标签的值
          loading:false,   //上拉加载使用
          finished:false,  //下拉加载是否没有数据了
          list: [],
          isRefresh:false, //下拉加载
          page:1,          //商品列表的页数
          pageSize:10,     //商品列表每页数量
          goodList:[],     //商品信息
          categorySubId:'' //商品子分类ID
        }
      },
      mounted(){
        /*
        * document.body.clientWidth ==> BODY对象宽度
        * document.body.clientHeight ==> BODY对象高度
        * document.documentElement.clientWidth ==> 可见区域宽度
        * document.documentElement.clientHeight ==> 可见区域高度
        */
        let winHeight = document.documentElement.clientHeight
        document.getElementById("leftNav").style.height= winHeight-46-50 +'px'
        document.getElementById('list-div').style.height=winHeight-90-50 +'px'
      },
      created(){
        this.getCategory();
      },
      filters:{
        moneyFilter(money){
          return toMoney(money)
        }
      },
      methods: {
        getCategory() {
          axios({
            url:url.getCategoryList,
            headers:{
              "Authorization": 'Bearer ' + localStorage.getItem('token')
            },
            method:'get'
          })
          .then(response=>{
            console.log(response)
            if(response.data.code == 200 && response.data.data){
              // ....
              this.category=response.data.data
              this.getCategorySubByCategoryId(this.category[0].ID)
            }else{
              Toast('服务器错误，数据取得失败')
            }
          })
          .catch(error=>{
            console.log(error)
          })
        },
        //点击大类的方法
        clickCategory(index, categoryId){
          this.categoryIndex=index
          this.page=1
          this.finished = false
          this.goodList=[]
          this.pageSize = 10
          this.getCategorySubByCategoryId(categoryId)
          this.onLoad() // 这里不需要在执行一次，他默认执行一次
        },
        //根据大类ID读取小类类别列表
        getCategorySubByCategoryId(categoryId){
          axios({
            url:url.getCategorySubList,
            method:'post',
            headers:{
              "Authorization": 'Bearer ' + localStorage.getItem('token')
            },
            data:{categoryId:categoryId}
          })
          .then(response=>{
            console.log(response)
            if(response.data.code == 200 && response.data.data ){
              this.categorySub=response.data.data
              this.active = 0
              this.categorySubId = this.categorySub[0].ID
            }else{
              Toast('服务器错误，数据取得失败')
            }
          })
          .catch(error=>{
            console.log(error)
          })
        },
        //上拉加载方法
        onLoad(){
          setTimeout(()=>{
            this.categorySubId=this.categorySubId?this.categorySubId:this.categorySub[0].ID
            this.getGoodList()
          },500)
        },
        //下拉刷新方法
        onRefresh(){
          setTimeout(() => {
            this.isRefresh = false;
            this.finished = false;
            this.goodList=[];
            this.page=1
            this.pageSize=10
            this.onLoad()
          }, 500);
        },
        getGoodList(){
          axios({
            url:url.getGoodsListByCategorySubID,
            method:'post',
            headers:{
              "Authorization": 'Bearer ' + localStorage.getItem('token')
            },
            data:{
              categorySubId:this.categorySubId,
              page:this.page,
              pageSize:this.pageSize
            }
          })
          .then(response=>{
            console.log(response)
            if(response.data.code == 200 && response.data.data.length ){
              this.page++
              this.goodList=this.goodList.concat(response.data.data)
            }else{
              this.finished = true;
            }
            this.loading=false;
          })
          .catch(error=>{
            console.log(error)
          })
        },
        //点击子类获取商品信息
        onClickCategorySub(index,title){
          this.categorySubId= this.categorySub[index].ID
          this.goodList=[]
          this.finished = false
          this.page=1
          this.pageSize = 10
          this.onLoad()
        },
        // 跳商品详情页面
        goGoodsInfo(id){
          this.$router.push({name:'Goods',params:{goodsId:id}})
        }
      }
    }
</script>
<style scoped>
#leftNav ul li {
  line-height: 2rem;
  border-bottom:1px solid #E4E7ED;
  padding:3px;
  font-size:0.8rem;
  text-align: center;
}
.categoryActive{
  background-color: #fff;
}
.list-item{
  text-align: center;
  line-height: 80px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}
#list-div{
  overflow: scroll;
}
.list-item{
  display: flex;
  flex-direction: row;
  font-size:0.8rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  padding:5px;
}
#list-div{
  overflow: scroll;
}
.list-item-img{
  flex:8;
}
.list-item-text{
  flex:16;
  margin-top:10px;
  margin-left:10px;
}
</style>