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
          <a href="javascript:void(0)" class="price" :class="{'sort-up': sortFlag}" @click.prevent="sortPrice">Price
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
                    <a href="#"><img v-lazy="'static/images/'+ good.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{good.productName}}</div>
                    <div class="price">￥{{good.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(good.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
    <model :mdShow="mdShow" @close="closeModel">
      <p slot="message">
        请先登录，否则无法加入到购物车中
      </p>
      <div slot="btn-group">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </model>`
    <model :mdShow="mdShowCart" @close="closeModel">
      <p slot="message">
        <svg class="icon icon-status-ok">
          <use xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btn-group">
        <a class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link to="/cart" class="btn btn--m">查看购物车</router-link>
      </div>
    </model>
    <s-footer/>
  </div>
</template>

<script type="text/ecmascript-6">
  import SHeader from 'components/s-header'
  import SFooter from 'components/s-footer'
  import Tab from 'components/tab'
  import Model from 'components/model'
  import {mapMutations} from 'vuex'

  const ERR_OK = 0

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
            endPrice: 5000
          }
        ],
        checkPrice: 'all',
        filterFlag: false,
        overLayFlag: false,
        page: 1,
        pageSize: 8,
        sortFlag: true,
        busy: false,
        loading: false,
        mdShow: false,
        mdShowCart: false,
        cartList: []
      }
    },
    created() {
      this._getGoodsList(false)
      this._getCartList()
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
        this.page = 1
        this._getGoodsList()
      },
      sortPrice() {
        this.sortFlag = !this.sortFlag
        this.page = 1
        this._getGoodsList()
      },
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.page++
          this._getGoodsList(true)
        }, 500)
      },
      addCart(productId) {
        this.$axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          if (res.data.status === ERR_OK) {
            this.mdShowCart = true
          } else {
            this.mdShow = true
          }
        })
        this._getCartList()
      },
      closeModel() {
        this.mdShow = false
        this.mdShowCart = false
      },
      _getGoodsList(flag) {
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.checkPrice
        }
        this.loading = true
        this.$axios.get('/goods/list', {
          params: params
        }).then((res) => {
          if (res.data.status === ERR_OK) {
            this.loading = false
            if (flag) {
              this.goods = this.goods.concat(res.data.results.list)
              if (res.data.results.length === 0) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goods = res.data.results.list
              this.busy = true
            }
          }
        })
      },
      _getCartList() {
        this.$axios.get('/users/cart').then((res) => {
          if (res.data.status === ERR_OK) {
            this.cartList = res.data.results
          }
        })
      },
      _getCartCount() {
        this.$axios.get('/users/cartCount').then(res => {
          if (res.data.status === ERR_OK) {
            this.setCartCount(res.data.results)
          }
        })
      },
      ...mapMutations(['setCartCount'])
    },
    watch: {
      cartList() {
        this._getCartCount()
      }
    },
    components: {
      SHeader,
      SFooter,
      Tab,
      Model
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
</style>
