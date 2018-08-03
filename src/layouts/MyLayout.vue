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
        <q-btn flat rounded color="primary" class="q-title">注册</q-btn>
        <q-btn flat rounded color="teal" class="q-title">登录</q-btn>
      </q-toolbar>
      <q-toolbar
        color="light"
      >
        <q-toolbar-title>
          <q-breadcrumbs
            color="teal"
          >
            <q-breadcrumbs-el label="HOME"/>
            <q-breadcrumbs-el color="primary" label="GOODS"/>
          </q-breadcrumbs>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

  export default {
    name: 'MyLayout'
  }
</script>

<style>
</style>
