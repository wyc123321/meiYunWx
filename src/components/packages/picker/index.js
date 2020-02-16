import picker from './src/picker.vue'
picker.install = function (Vue) {
  Vue.component(picker.name, picker)
}
export default picker