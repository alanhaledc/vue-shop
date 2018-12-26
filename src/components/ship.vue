<template>
  <div>
    <q-item>
      <q-item-side>
        <q-chip square>配送方式</q-chip>
      </q-item-side>
    </q-item>
    <div class="row">
      <q-item
        class="col-md-3"
        v-for="ship in shipList"
        :key="ship._id"
      >
        <q-card style="width: 100%">
          <q-card-title>
            <q-item-tile>{{ship.ship}}</q-item-tile>
            <q-item-tile>{{ship.cost === '0' ? '免费': ship.cost + '元'}}</q-item-tile>
            <div slot="right">
              <q-btn
                icon="done"
                round dense
                :class="{check: ship.isChecked}"
                @click="checkedShip(ship._id)"
              />
            </div>
          </q-card-title>
        </q-card>
      </q-item>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Ship',
  data() {
    return {}
  },
  created() {
    this.getShipList()
  },
  computed: {
    ...mapGetters('ship', ['shipList'])
  },
  methods: {
    ...mapActions('ship', ['getShipList', 'checkedShip'])
  }
}
</script>

<style lang="stylus" scoped>
  .check
    background: #0273d4;
    color: #fff
</style>
