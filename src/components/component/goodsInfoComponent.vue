<template>
  <div class="goods-info" @click="goGoodsPage()">
    <div class="goods-image">
        <img v-lazy="goodsImage" width="100%" />
    </div>
    <div class="goods-name">{{goodsName}}</div>
    <div class="goods-price">￥{{goodsPrice | moneyFilter }}</div>
  </div>
</template>
<script>
    import {toMoney} from '@/components/filter/moneyFilter'
    export default {
      props:['goodsImage','goodsName','goodsPrice','goodsId'],
      filters:{
        moneyFilter(money){
          return toMoney(money)
        }
      },
      methods: {
        goGoodsPage() {
          this.$router.push({name:'Goods',query:{goodsId:this.goodsId}})
        }
      }
    }
</script>
<style lang="scss" scoped>
  .goods-name{
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
  }
</style>