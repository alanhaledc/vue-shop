<template>
  <div>
    <s-header/>
    <tab>
      <span>Goods</span>
    </tab>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterFlag}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)"
                     :class="{cur: checkPrice==='all'}"
                     @click="checkPrice='all'">All</a></dd>
              <dd v-for="(price,index) in filterPrice" :key="index">
                <a href="javascript:void(0)"
                   :class="{cur: checkPrice===index}"
                   @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="good in goods" :key="good.productId">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/images/'+ good.productImg" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{good.productName}}</div>
                    <div class="price">￥{{good.ProductPrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <s-footer/>
  </div>
</template>

<script type="text/ecmascript-6">
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import SHeader from 'components/s-header'
  import SFooter from 'components/s-footer'
  import Tab from 'components/tab'

  export default {
    data() {
      return {
        goods: [],
        filterPrice: [
          {
            startPrice: 0,
            endPrice: 100
          },
          {
            startPrice: 100,
            endPrice: 500
          },
          {
            startPrice: 500,
            endPrice: 1000
          },
          {
            startPrice: 1000,
            endPrice: 2000
          }
        ],
        checkPrice: 'all',
        filterFlag: false,
        overLayFlag: false
      }
    },
    mounted() {
      this._getGoods()
    },
    methods: {
      showFilterPop() {
        this.filterFlag = true
        this.overLayFlag = true
      },
      closePop() {
        this.filterFlag = false
        this.overLayFlag = false
      },
      setPriceFilter(index) {
        this.checkPrice = index
        this.closePop()
      },
      _getGoods() {
        this.$axios.get('/api/goods').then((res) => {
          this.goods = res.data.results
        })
      }
    },
    components: {
      SHeader,
      SFooter,
      Tab
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
</style>
