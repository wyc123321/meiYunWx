<template>
  <div class="zoe-column-wrapper" ref="column">
    <ul class="zoe-picker-column">
      <slot></slot>
    </ul>
  </div>
  
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'picker-column',
  props: {
    value: {
      type: Number,
      default: 0
    },
    item: Array,
    show: Boolean
  },
  data() {
    return {
      active: false
    }
  },
  watch: {
    value: {
      handler(v) {
        this.scroll.wheelTo(v)
      }
    },
    show(v) {
      if (v) {
        setTimeout(() => {
          if (this.scroll) {
            this.scroll.refresh()
          } else {
            this.init()
          }
        }, 50); 
      }
    }
  },
  direact(index) {
    this.scroll.wheelTo(index)
  },
  methods: {
    refresh() {
      if (this.scroll) {
        this.scroll.refresh()
      }
    },
    init() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.column, {
          deceleration: 0.002,
          wheel: {
            selectedIndex: this.value,
            rotate: 15,
            adjustTime: 400,
            wheelWrapperClass: 'zoe-picker-column',
            wheelItemClass: 'zoe-picker-item'
          }
        })
        this.scroll.on('scrollEnd', e => {
          const y = Math.abs(e.y)
          const offset = Math.round(y / 40, 10)
          this.$emit('change', offset)
        })
      })
    }
  }
}
</script>

<style lang="scss">
  @import './variable';
  .zoe-column-wrapper{
    height:100%;
    overflow: hidden;
    flex: 1;
    padding-top: 105px;
  }
  .zoe-picker-column{
    text-align: center;
    margin:0;
    padding:0;
    list-style: none;
    // padding:105px 0;
  }
</style>
