<template>
  <div>
    <div class="row">
      <q-item>
        <q-card>
          <q-card-title>
            <div>Hale</div>
            <div slot="subtitle">18688889999</div>
            <div slot="right">配送地址</div>
          </q-card-title>
          <q-card-main>
            <div>深圳市南山区深南大道8888号</div>
            <div>100010</div>
          </q-card-main>
        </q-card>
      </q-item>
      <q-item>
        <q-card>
          <q-card-title>
            <div>普通快递</div>
            <div>免费</div>
          </q-card-title>
        </q-card>
      </q-item>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'OrderDetail',
    created() {
      this.getOrderDetail()
    },
    computed: {
      ...mapGetters('user', ['orderDetail'])
    },
    methods: {
      ...mapActions('user', ['getOrderDetail'])
    }
  }
</script>

<style>
</style>
