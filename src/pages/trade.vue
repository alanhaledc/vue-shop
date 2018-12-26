<template>
  <q-page padding>
    <q-stepper ref="stepper">
      <q-step defalut title="确认地址">
        <Address/>
        <q-item-separator/>
        <Ship/>
        <q-item-separator/>
        <q-stepper-navigation>
          <q-btn @click.native="$refs.stepper.next()">下一步</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step title="查看订单">
        <OrderDetail/>
        <q-stepper-navigation>
          <q-btn @click.native="$refs.stepper.next()">下一步</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step title="支付订单">
        <q-item class="row justify-center">
          <q-card>
            <q-card-title>
              <div class="q-display-4 text-center text-weight-medium" style="width: 300px">支付成功</div>
            </q-card-title>
          </q-card>
        </q-item>
        <q-stepper-navigation>
          <q-btn @click.native="$refs.stepper.next()">下一步</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step title="订单信息">
        <q-item class="row justify-center">
          <div>
            <q-card-media>
              <img src="../statics/images/ok-2.png" width="240" height="312">
            </q-card-media>
            <q-card-title class="text-center">
              <div>支付成功</div>
              <div>订单正在配货中...</div>
            </q-card-title>
            <q-card-main>
              <q-item>
                <q-item-side>订单号：</q-item-side>
                <q-item-main>{{orderDetail.orderId}}</q-item-main>
              </q-item>
              <q-item>
                <q-item-side>订单总价：</q-item-side>
                <q-item-main>{{orderDetail.orderTotalPrice}}元</q-item-main>
              </q-item>
            </q-card-main>
            <q-card-actions class="row justify-center">
              <q-btn color="primary" sizr="xl" class="full-width q-title" @click="goGoods">继续购物 - 买买买！！！</q-btn>
            </q-card-actions>
          </div>
        </q-item>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

import Address from '../components/address'
import Ship from '../components/ship'
import OrderDetail from '../components/orderDetail'

export default {
  name: 'Trade',
  components: {
    Address,
    Ship,
    OrderDetail
  },
  computed: {
    ...mapGetters('user', ['orderDetail'])
  },
  methods: {
    goGoods() {
      this.$router.replace('/home/goods')
    }
  }
}
</script>

<style>
</style>
