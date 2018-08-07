<template>
  <q-layout view="lhh Lpr lff">
    <q-layout-header>
      <q-toolbar
        color="#000"
      >
        <q-btn
          flat
          dense
          round
          color="primary"
        >
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title class="text-primary q-title">
          网上商城
        </q-toolbar-title>
        <q-btn flat rounded color="primary" class="q-subheading" @click="showLoginModal(false)">注册</q-btn>
        <q-btn flat rounded color="teal" class="q-subheading" @click="showLoginModal(true)">登录</q-btn>
      </q-toolbar>
      <q-toolbar
        color="light"
      >
        <q-toolbar-title>
          <q-breadcrumbs
            color="teal"
          >
            <q-breadcrumbs-el label="HOME"/>
            <q-breadcrumbs-el color="primary" :label="label"/>
          </q-breadcrumbs>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-modal v-model="opened">
      <q-tabs
        inverted
        v-model="selectTab"
        align="justify"
        style="width: 100%"
        no-pane-border
      >
        <q-tab slot="title" name="tab-1" label="登录"/>
        <q-tab slot="title" name="tab-2" label="注册"/>
        <q-tab-pane name="tab-1">
          <q-field
            class="q-mb-md"
            :error="$v.form.email.$error"
            helper="请输入你的邮箱"
            error-label="请输入正确的邮箱地址"
          >
            <q-input
              float-label="邮箱"
              @blur="$v.form.email.$touch"
              v-model="form.email"
            />
          </q-field>
          <q-field
            class="q-mb-md"
            :error="$v.form.password.$error"
            helper="请输入你的密码"
            error-label="请输入6位以上的密码"
          >
            <q-input
              float-label="密码"
              v-model="form.password"
              type="password"
              @blur="$v.form.password.$touch"
            />
          </q-field>
          <q-btn class="full-width" @click.native="_login">登录</q-btn>
        </q-tab-pane>
        <q-tab-pane name="tab-2">
          <q-field
            class="q-mb-md"
            :error="$v.form.email.$error"
            helper="请输入你的邮箱"
            error-label="请输入正确的邮箱地址"
          >
            <q-input
              float-label="邮箱"
              @blur="$v.form.email.$touch"
              v-model="form.email"
            />
          </q-field>
          <q-field
            class="q-mb-md"
            :error="$v.form.password.$error"
            helper="请输入你的密码"
            error-label="请输入6位以上的密码"
          >
            <q-input
              float-label="密码"
              v-model="form.password"
              type="password"
              @blur="$v.form.password.$touch"
            />
          </q-field>
          <q-btn class="full-width" @click.native="_register">注册</q-btn>
        </q-tab-pane>
      </q-tabs>
    </q-modal>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {required, minLength, email} from 'vuelidate/lib/validators'

  export default {
    name: 'MyLayout',
    validations: {
      form: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(6)
        }
      }
    },
    data() {
      return {
        form: {
          email: 'admin@qq.com',
          password: '123456'
        },
        opened: false,
        selectTab: 'tab-1'
      }
    },
    computed: {
      label() {
        return this.$route.name.toUpperCase()
      },
      ...mapGetters('user', ['userInfo'])
    },
    methods: {
      showLoginModal(flag) {
        if (flag) {
          this.selectTab = 'tab-1'
        } else {
          this.selectTab = 'tab-2'
        }
        this.opened = true
      },
      _register() {
      },
      _login() {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          this.$q.notify('请检查输入的内容')
          return
        }
        this.login({
          email: this.form.email,
          password: this.form.password
        })
          .then(data => {
            if (data.status === 0) {
              this.$q.notify({
                message: '登录成功',
                color: 'positive',
                icon: 'done'
              })
              this.opened = false
            } else {
              this.$q.notify({
                message: data.message,
                color: 'negative',
                icon: 'priority_high'
              })
            }
          })
      },
      ...mapActions('user', ['login'])
    }
  }
</script>

<style>
</style>
