<template>
  <q-page padding>
    <q-toolbar color="#000">
      <q-btn-group flat>
        <q-btn-dropdown
          color="primary"
          label="筛选"
          class="q-mr-md"
          flat
        >
          <q-list
            class="text-center"
            link
          >
            <q-item
              v-close-overlay
              @click.native="selectLevel(index)"
              v-for="(item, index) in priceRange"
              :key="index"
            >{{item}}
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat color="primary" label="价格" @click.native="toggleSort">
          <q-icon :name="sortIcon"></q-icon>
        </q-btn>
      </q-btn-group>
    </q-toolbar>
    <div class="row">
      <q-item
        class="col-md-2 col-sm-3"
        v-for="goods in goodsList"
        :key="goods._id"
      >
        <q-card>
          <q-card-media>
            <img v-lazy="'statics/images/' + goods.productImage" alt="pic" height="250"/>
          </q-card-media>
          <q-card-title>
            <div class="q-title">{{goods.productName}}</div>
            <div slot="subtitle" class="text-pink">￥{{goods.salePrice}}</div>
          </q-card-title>
          <q-card-actions>
            <q-btn class="full-width" color="pink" outline @click="_addCart(goods.productId)">加入购物车</q-btn>
          </q-card-actions>
        </q-card>
      </q-item>
    </div>
  </q-page>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: 'GoodsList',
    data() {
      return {
        sortFlag: true,
        pageSize: 12,
        priceLevel: 0,
        page: 1,
        priceRange: [
          'ALL', '0-100', '100-500', '500-1000', '1000-5000'
        ],
        isGetMore: false
      }
    },
    created() {
      this._getGoodsList(false)
      // 监听window滚动
      window.addEventListener('scroll', this.loadMore)
    },
    computed: {
      sort() {
        return this.sortFlag ? 1 : -1
      },
      sortIcon() {
        return this.sortFlag ? 'arrow_upward' : 'arrow_downward'
      },
      ...mapGetters('goods', ['goodsList'])
    },
    methods: {
      _getGoodsList(flag) {
        const page = this.page
        const pageSize = this.pageSize
        const sort = this.sort
        const priceLevel = this.priceLevel
        this.$q.loading.show()
        setTimeout(() => {
          this.$q.loading.hide()
        }, 500)
        this.getGoodsList({page, pageSize, sort, priceLevel, flag})
      },
      selectLevel(index) {
        this.priceLevel = index
        this._getGoodsList(false)
        this.isGetMore = true
      },
      toggleSort() {
        this.sortFlag = !this.sortFlag
        this._getGoodsList(false)
        setTimeout(() => {
          this.isGetMore = true
        }, 800)
      },
      /**
       * 下拉刷新
       */
      loadMore() {
        if (!this.isGetMore) {
          return
        }
        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const screenHeight = window.innerHeight
        // 刚好滚动到底部相应位置时，才请求数据（即下拉刷新）
        if (scrollTop > scrollHeight - screenHeight - 10) {
          setTimeout(() => {
            this.page++
            this._getGoodsList(true)
            this.isGetMore = false
          }, 500)
        }
      },
      _addCart(productId) {
        this.addCart(productId)
          .then(data => {
            if (data.status === 0) {
              this.$q.dialog({
                title: '成功',
                message: '加入购物车成功',
                color: 'primary',
                ok: '查看购物车',
                cancel: '继续购物'
              })
                .then(() => {
                  this.$router.push('/home/cart')
                })
                .catch(() => {
                })
              this.getCartCount()
            } else {
              this.$q.dialog({
                title: '警告',
                message: data.message,
                color: 'negative',
                ok: '确定'
              })
            }
          })
      },
      ...mapActions('goods', ['getGoodsList', 'addCart']),
      ...mapActions('user', ['getCartCount'])
    },
    watch: {
      /**
       * 监听上次商品列表数据变化，如果列表长度没变（即没有新的数据了），则之后的下拉刷新失效
       * @param newVal
       * @param oldVal
       */
      goodsList(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.isGetMore = true
        } else {
          this.isGetMore = false
          // page重置回来
          this.page = 1
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .q-card
    transition box-shadow 1s
    &:hover
      box-shadow 0 0 10px rgba(0, 0, 0, 0.6)
</style>
