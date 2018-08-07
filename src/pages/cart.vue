<template>
  <q-page padding>
    <q-table
      :data="cart"
      :columns="columns"
      row-key="name"
      color="primary"
      hide-bottom
    >
      <div slot="top-right" slot-scope="props" class="absolute-center text-positive q-headline">购物车</div>
      <q-td slot="body-cell-select" slot-scope="props" :props="props">
        <q-item-side>
          <q-btn
            icon="done"
            round
            dense
            :class="{'check': props.row.isChecked}"
            @click.native="toggleChecked(props.row.id,props.row.isChecked)"
          ></q-btn>
        </q-item-side>
      </q-td>
      <q-td slot="body-cell-name" slot-scope="props" :props="props">
        <q-item-main class="text-center">
          <img :src="'statics/images/'+ props.row.image" alt="poster" width="120" height="120">
          <div class="q-subheading">{{props.row.name}}</div>
        </q-item-main>
      </q-td>
      <q-td slot="body-cell-price" slot-scope="props" :props="props">
        <div class="q-subheading">￥{{props.row.price}}</div>
      </q-td>
      <q-td slot="body-cell-quantity" slot-scope="props" :props="props">
        <q-item class="absolute-center">
          <q-btn icon="remove" round dense color="teal"
                 @click.native="decreaseNum(props.row.id, props.row.quantity)"></q-btn>
          <div class="q-ml-sm q-mr-sm">{{props.row.quantity}}</div>
          <q-btn icon="add" round dense color="primary"
                 @click.native="addNum(props.row.id, props.row.quantity)"></q-btn>
        </q-item>
      </q-td>
      <q-td slot="body-cell-totalPrice" slot-scope="props" :props="props">
        <div class="q-subheading">￥{{props.row.price * props.row.quantity}}</div>
      </q-td>
      <q-td slot="body-cell-delete" slot-scope="props" :props="props">
        <q-btn icon="delete" round dense color="negative" @click.native="deleteItem(props.row.id)"></q-btn>
      </q-td>
      <q-tr slot="bottom-row" slot-scope="props">
        <q-td colspan="100%">
          <q-item>
            <q-item-side>
              <q-btn
                @click="toggleCheckedAll"
                icon="done"
                dense
                round
                :class="{'check': isCheckedAll}"
              ></q-btn>
              <span class="q-ml-sm">全选</span>
            </q-item-side>
            <q-item-main/>
            <q-item-side>
              <q-btn-group>
                <q-chip color="primary" size="md" square style="border-radius: 0" class="q-subheading">
                  合计:{{amountQuantity}}件商品,￥{{amountPrice}}
                </q-chip>
                <q-btn color="positive" size="md" @click.native="goAddress">去结算</q-btn>
              </q-btn-group>
            </q-item-side>
          </q-item>
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: 'Cart',
    data() {
      return {
        columns: [
          {name: 'select', field: 'select', label: '选中', align: 'center'},
          {name: 'name', field: 'name', label: '商品', align: 'center'},
          {name: 'price', field: 'price', label: '单价', align: 'center'},
          {name: 'quantity', field: 'quantity', label: '数量', align: 'center'},
          {name: 'totalPrice', field: 'totalPrice', label: '总价', align: 'center'},
          {name: 'delete', field: 'delete', label: '操作', align: 'center'}
        ],
        isCheckedAll: true,
        isChecked: false
      }
    },
    created() {
      this.getCart()
    },
    computed: {
      amountPrice() {
        let total = 0
        this.cart.forEach(item => {
          if (item.isChecked) {
            total += item.price * item.quantity
          }
        })
        return total
      },
      amountQuantity() {
        let quantity = 0
        this.cart.forEach(item => {
          if (item.isChecked) {
            quantity += item.quantity
          }
        })
        return quantity
      },
      ...mapGetters('user', ['cart'])
    },
    methods: {
      addNum(id, quantity) {
        const productId = id
        let goodsNum = quantity += 1
        this.editCart({
          productId,
          goodsNum
        })
      },
      decreaseNum(id, quantity) {
        const productId = id
        let goodsNum = quantity -= 1
        if (goodsNum < 1) {
          goodsNum = 1
        }
        this.editCart({
          productId,
          goodsNum
        })
      },
      toggleChecked(id, flag) {
        const productId = id
        let isChecked
        if (flag) {
          isChecked = false
        } else {
          isChecked = true
        }
        this.editCart({
          productId,
          isChecked
        })
        setTimeout(() => {
          if (this.cart.length === this.cart.filter(item => item.isChecked === true).length) {
            this.isCheckedAll = true
          } else {
            this.isCheckedAll = false
          }
        }, 200)
      },
      toggleCheckedAll() {
        this.isCheckedAll = !this.isCheckedAll
        this.checkedAll({
          isCheckedAll: this.isCheckedAll
        })
      },
      goAddress() {
        if (this.amountPrice) {
          this.$router.push('/home/trade')
        }
      },
      deleteItem(id) {
        console.log(id)
        this.$q.dialog({
          title: '警告',
          message: '确定要删除吗？',
          cancel: '取消',
          ok: '确认',
          color: 'negative'
        })
          .then(() => {
            this.deleteCart({
              productId: id
            })
            this.$q.notify({
              message: '你删除了一款商品',
              color: 'negative',
              icon: 'done'
            })
          })
          .catch(() => {
            this.$q.notify({
              message: '已取消',
              color: 'positive',
              icon: 'done'
            })
          })
      },
      ...mapActions('user', ['getCart', 'deleteCart', 'editCart', 'checkedAll'])
    }
  }
</script>

<style lang="stylus" scoped>
  .check
    background: #0273d4;
    color: #fff
</style>
