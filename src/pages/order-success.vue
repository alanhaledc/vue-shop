<template>
  <div>
    <s-header/>
    <tab>
      <span>Order Success</span>
    </tab>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/images/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderDetail.orderId}}</span>
            <span>Order total：{{orderDetail.orderTotalPrice | formatPrice}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <s-footer/>
  </div>
</template>

<script type="text/ecmascript-6">
  import SHeader from 'components/s-header'
  import SFooter from 'components/s-footer'
  import Tab from 'components/tab'
  import {currency} from 'src/utils/util'

  const ERR_OK = 0

  export default {
    data() {
      return {
        orderDetail: {}
      }
    },
    created() {
      this._getOrderDetail()
    },
    methods: {
      _getOrderDetail() {
        const orderId = this.$route.query.orderId
        console.log(orderId)
        if (!orderId) {
          window.alert('查询不到订单ID')
        }
        this.$axios.get('/users/orderDetail', {
          params: {
            orderId
          }
        }).then(res => {
          if (res.data.status === ERR_OK) {
            this.orderDetail = res.data.results
          }
        })
      }
    },
    filters: {
      formatPrice: currency
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
