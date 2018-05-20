<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="closeModel">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"/>
          </div>
          <div class="btn-wrap">
            <slot name="btn-group"/>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="mdShow" @click="closeModel"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      mdShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeModel() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">

</style>
