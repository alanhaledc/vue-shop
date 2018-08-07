<template>
  <div>
    <q-item class="row">
      <q-item-side>
        <q-chip square>配送地址</q-chip>
      </q-item-side>
      <q-item-main/>
      <q-item-side>
        <q-btn-group>
          <q-btn
            :icon="isShowAllAddress ? 'expand_less': 'expand_more'"
            @click.native="isShowAllAddress = !isShowAllAddress"
            :disable="addressList.length < 5"
          >
            {{isShowAllAddress ? '收起': '更多'}}
          </q-btn>
          <q-btn icon="add" @click="isOpenAdd=true">新增</q-btn>
        </q-btn-group>
      </q-item-side>
    </q-item>
    <div class="row">
      <q-item
        class="col-md-3"
        v-for="address in showAddressList"
        :key="address._id"
      >
        <q-card style="width: 100%">
          <q-card-title>
            <div class="q-title">{{address.recipient}}</div>
            <div class="q-subheading">{{address.phone}}</div>
            <div slot="right">
              <q-btn
                icon="check"
                round
                dense
                :class="{check: address.isChecked}"
                @click="checkedAddress(address._id)"
              ></q-btn>
            </div>
          </q-card-title>
          <q-card-main>
            <div>{{address.streetName}}</div>
            <div>{{address.postCode}}</div>
          </q-card-main>
          <q-card-actions>
            <q-btn
              dense
              :color="address.isDefault ? 'primary': ''"
              flat
              rounded
              @click="setDefaultAddress(address._id)"
            >
              {{address.isDefault ? '默认地址' : '设为默认'}}
            </q-btn>
            <q-btn icon="edit" flat round dense class="text-teal" @click="showEditModal(address)"></q-btn>
            <q-btn
              icon="delete"
              flat
              round
              dense
              class="text-negative"
              @click="deleteAddress(address._id)"/>
          </q-card-actions>
        </q-card>
      </q-item>
    </div>
    <q-modal
      v-model="isOpenAdd"
    >
      <q-card>
        <q-card-title class="text-center">
          <div>添加地址</div>
          <div slot="right">
            <q-btn icon="close" round dense color="negative" @click="isOpenAdd=false"></q-btn>
          </div>
        </q-card-title>
        <q-card-main>
          <q-item>
            <q-field label="收件人：" labelWidth="4">
              <q-input v-model="newAddress.recipient"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="手机号码：" labelWidth="4">
              <q-input type="number" v-model="newAddress.phone"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="详细地址：" labelWidth="4">
              <q-input type="textarea" v-model="newAddress.streetName"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="邮政编码：" labelWidth="4">
              <q-input type="number" v-model="newAddress.postCode"/>
            </q-field>
          </q-item>
        </q-card-main>
        <q-card-actions class="row justify-center">
          <q-btn color="teal" @click="isOpenAdd=false">取消</q-btn>
          <q-btn color="primary" @click="saveNewAddress">保存</q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>
    <q-modal
      v-model="isOpenEdit"
    >
      <q-card>
        <q-card-title class="text-center">
          <div>修改地址</div>
          <div slot="right">
            <q-btn icon="close" round dense color="negative" @click="isOpenEdit=false"></q-btn>
          </div>
        </q-card-title>
        <q-card-main>
          <q-item>
            <q-field label="收件人：" labelWidth="4">
              <q-input v-model="curAddress.recipient"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="手机号码：" labelWidth="4">
              <q-input type="number" v-model="curAddress.phone"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="详细地址：" labelWidth="4">
              <q-input type="textarea" v-model="curAddress.streetName"/>
            </q-field>
          </q-item>
          <q-item>
            <q-field label="邮政编码：" labelWidth="4">
              <q-input type="number" v-model="curAddress.postCode"/>
            </q-field>
          </q-item>
        </q-card-main>
        <q-card-actions class="row justify-center">
          <q-btn color="teal" @click="isOpenEdit=false">取消</q-btn>
          <q-btn color="primary" @click="saveEditAddress">保存</q-btn>
        </q-card-actions>
      </q-card>
    </q-modal>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'Address',
    data() {
      return {
        isShowAllAddress: false,
        isOpenAdd: false,
        isOpenEdit: false,
        curAddress: {},
        newAddress: {
          recipient: '',
          phone: '',
          streetName: '',
          postCode: ''
        }
      }
    },
    created() {
      this.getAddressList()
    },
    computed: {
      showAddressList() {
        return this.isShowAllAddress ? this.addressList : this.addressList.slice(0, 4)
      },
      ...mapGetters('user', ['addressList'])
    },
    methods: {
      saveNewAddress() {
        this.addAddress(this.newAddress)
        this.isOpenAdd = false
        this.newAddress = {}
      },
      showEditModal(address) {
        this.isOpenEdit = true
        this.curAddress = address
      },
      saveEditAddress() {
        this.editAddress(this.curAddress)
        this.isOpenEdit = false
      },
      ...mapActions('user',
        [
          'getAddressList', 'addAddress', 'deleteAddress', 'editAddress', 'setDefaultAddress', 'checkedAddress'
        ]
      )
    }
  }
</script>

<style lang="stylus" scoped>
  .check
    background: #0273d4;
    color: #fff
</style>
