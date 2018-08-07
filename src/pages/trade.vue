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
          <q-btn @click.native="$refs.stepper.previous()">上一步</q-btn>
          <q-btn @click.native="$refs.stepper.next()">下一步</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step title="支付"></q-step>
      <q-step title="订单确认"></q-step>
    </q-stepper>
  </q-page>
</template>

<script>
  import Address from '../components/address'
  import Ship from '../components/ship'
  import OrderDetail from '../components/orderDetail'

  export default {
    name: 'Trade',
    components: {
      Address,
      Ship,
      OrderDetail
    }
  }
</script>

<style>
</style>
