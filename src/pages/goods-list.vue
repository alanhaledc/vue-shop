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
        v-for="goods in list"
        :key="goods._id"
      >
        <q-card>
          <q-card-media>
            <img :src="'statics/images/' + goods.productImage" alt="pic" height="250">
          </q-card-media>
          <q-card-title>
            <div class="q-title">{{goods.productName}}</div>
            <div slot="subtitle" class="text-pink">￥{{goods.salePrice}}</div>
          </q-card-title>
          <q-card-actions>
            <q-btn class="full-width" color="pink" outline>加入购物车</q-btn>
          </q-card-actions>
        </q-card>
      </q-item>
    </div>
  </q-page>
</template>

<script>
  import api from '../assets/api'

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
        list: [],
        isGetMore: false
      }
    },
    created() {
      this._getGoodsList(false)
    },
    mounted() {
      // 监听window滚动
      window.addEventListener('scroll', this.loadMore)
    },
    computed: {
      sort() {
        return this.sortFlag ? 1 : -1
      },
      sortIcon() {
        return this.sortFlag ? 'arrow_upward' : 'arrow_downward'
      }
    },
    methods: {
      _getGoodsList(flag) {
        const page = this.page
        const pageSize = this.pageSize
        const sort = this.sort
        const priceLevel = this.priceLevel
        this.$q.loading.show()
        api.getGoodsList(page, pageSize, sort, priceLevel)
          .then(data => {
            if (data.status === 0) {
              setTimeout(() => {
                this.$q.loading.hide()
                if (flag) {
                  this.list = this.list.concat(data.result.list)
                } else {
                  this.list = data.result.list
                }
              }, 1000)
            }
          })
      },
      selectLevel(index) {
        this.priceLevel = index
        this._getGoodsList(false)
      },
      toggleSort() {
        this.sortFlag = !this.sortFlag
        this._getGoodsList(false)
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
        // 刚好滚动到底部时，才请求数据（即下拉刷新）
        if (scrollTop === scrollHeight - screenHeight) {
          setTimeout(() => {
            this.page++
            this._getGoodsList(true)
          }, 500)
        }
      }
    },
    watch: {
      /**
       * 监听上次商品列表数据变化，如果列表长度没变（即没有新的数据了），则之后的下拉刷新失效
       * @param newVal
       * @param oldVal
       */
      list(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.isGetMore = true
        } else {
          this.isGetMore = false
        }
      }
    }
  }
</script>

<style lang="stylus">
  .q-card
    transition box-shadow 1s
    &:hover
      box-shadow 0 0 10px rgba(0, 0, 0, 0.6)
</style>
