import VueLazyLoad from 'vue-lazyload'

export default ({Vue}) => {
  Vue.use(VueLazyLoad, {
    loading: require('../statics/images/loading-bars.svg')
  })
}
