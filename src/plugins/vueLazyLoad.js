import vueLazyLoad from 'vue-lazyload'

export default ({Vue}) => {
  Vue.use(vueLazyLoad, {
    loading: require('../statics/images/loading-bars.svg')
  })
}
