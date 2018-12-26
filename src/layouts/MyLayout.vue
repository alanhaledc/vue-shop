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
        <q-btn-group flat v-show="showLoginBtn">
          <q-btn flat rounded color="secondary" class="q-subheading" @click="showLoginModal(false)">注册</q-btn>
          <q-btn flat rounded color="primary" class="q-subheading" @click="showLoginModal(true)">登录</q-btn>
        </q-btn-group>
        <div flat v-show="!showLoginBtn">
          <q-chip class="text-info q-title bg-white">{{userInfo.username}}</q-chip>
          <q-btn
            flat
            color="primary"
            class="q-subheading"
            icon="shopping_cart"
            size="lg"
            @click="$router.push('/home/cart')"
          >
            <q-chip
              floating
              class="text-pink text-weight-bolder q-subheading bg-transparent q-mr-sm q-mt-xs"
            >
              {{cartCount}}
            </q-chip>
          </q-btn>
          <q-btn color="negative" rounded class="q-subheading q-ml-md" @click="_logout">注销</q-btn>
        </div>
      </q-toolbar>
      <q-toolbar
        color="light"
      >
        <q-toolbar-title>
          <q-breadcrumbs
            color="teal"
          >
            <q-breadcrumbs-el label="HOME" @click.native="$router.push('/home')" style="cursor: pointer"/>
            <q-breadcrumbs-el color="primary" :label="label"/>
          </q-breadcrumbs>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-modal v-model="opened">
      <q-item>
        <q-btn
          icon="close"
          dense round
          color="negative"
          class="absolute-top-right q-mt-xs q-mr-xs"
          @click="opened=false"
        ></q-btn>
      </q-item>
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
            :error="$v.LoginForm.username.$error"
            helper="请输入你的用户名"
            error-label="请输入4位以上的用户名"
          >
            <q-input
              float-label="用户名"
              @blur="$v.LoginForm.username.$touch"
              v-model="LoginForm.username"
            />
          </q-field>
          <q-field
            class="q-mb-md"
            :error="$v.LoginForm.password.$error"
            helper="请输入你的密码"
            error-label="请输入6位以上的密码"
          >
            <q-input
              float-label="密码"
              v-model="LoginForm.password"
              type="password"
              @blur="$v.LoginForm.password.$touch"
            />
          </q-field>
          <q-btn class="full-width" @click.native="_login" color="primary">登录</q-btn>
        </q-tab-pane>
        <q-tab-pane name="tab-2">
          <q-field
            class="q-mb-md"
            :error="$v.registerForm.username.$error"
            helper="请输入你的用户名"
            error-label="请输入4为以上的用户名"
          >
            <q-input
              float-label="用户名"
              @blur="$v.registerForm.username.$touch"
              v-model="registerForm.username"
            />
          </q-field>
          <q-field
            class="q-mb-md"
            :error="$v.registerForm.password.$error"
            helper="请输入你的密码"
            error-label="请输入6位以上的密码"
          >
            <q-input
              float-label="密码"
              v-model="registerForm.password"
              type="password"
              @blur="$v.registerForm.password.$touch"
            />
          </q-field>
          <q-btn class="full-width" @click.native="_register" color="secondary">注册</q-btn>
        </q-tab-pane>
      </q-tabs>
    </q-modal>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'MyLayout',
  validations: {
    LoginForm: {
      username: {
        required,
        minLength: minLength(4)
      },
      password: {
        required,
        minLength: minLength(6)
      }
    },
    registerForm: {
      username: {
        required,
        minLength: minLength(4)
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  data() {
    return {
      LoginForm: {
        username: 'user1',
        password: '123456'
      },
      registerForm: {
        username: '',
        password: ''
      },
      opened: false,
      selectTab: 'tab-1'
    }
  },
  created() {
    this.getCartCount()
  },
  computed: {
    label() {
      return this.$route.name.toUpperCase()
    },
    showLoginBtn() {
      return this.userInfo.username === undefined
    },
    ...mapGetters('user', ['userInfo', 'cartCount'])
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
      this.$v.registerForm.$touch()
      if (this.$v.registerForm.$error) {
        this.$q.notify({
          message: '请检查输入的内容',
          icon: 'warning',
          position: 'top'
        })
        return
      }
      const { username, password } = this.registerForm
      this.register({
        username,
        password
      })
        .then(res => {
          const { data } = res
          if (data.success) {
            this.$q.notify({
              message: '注册成功',
              color: 'positive',
              icon: 'done',
              position: 'top'
            })
            this.opened = false
            this.setCartCount(0)
          } else {
            this.$q.notify({
              message: data.message,
              icon: 'warning',
              position: 'top'
            })
          }
        })
    },
    _login() {
      this.$v.LoginForm.$touch()
      if (this.$v.LoginForm.$error) {
        this.$q.notify({
          message: '请检查输入的内容',
          icon: 'warning',
          position: 'top'
        })
        return
      }

      const { username, password } = this.LoginForm
      this.login({
        username,
        password
      })
        .then(res => {
          const { data } = res
          if (data.success) {
            this.$q.notify({
              message: '登录成功',
              color: 'positive',
              icon: 'done',
              position: 'top'
            })
            this.opened = false
            this.getCartCount()
          } else {
            this.$q.notify({
              message: data.msg,
              icon: 'warning',
              position: 'top'
            })
          }
        })
    },
    _logout() {
      this.logout()
        .then(() => {
          this.$q.localStorage.clear()
          this.$q.notify({
            message: '退出成功',
            color: 'positive',
            icon: 'done',
            position: 'top'
          })
          this.$router.push('/')
        })
    },
    ...mapActions('user', ['login', 'register', 'logout', 'getCartCount']),
    ...mapMutations('user', ['setCartCount'])
  }
}
</script>

<style>
</style>
