<template>
  <div class="zoe-pop" v-show="show">
    <div class="mask" :class="{active: active}" @click="close"></div>
    <div class="zoe-picker" :class="{active: active}">
      <header>
        <span class="tit">{{title}}</span>
        <span class="confirm" @click="confirm">确定</span>
      </header>
      <div class="wrapper">
        <i class="mask top"></i>
        <i class="mask bottom"></i>
        <template v-if="type === 'cascade'">
          <picker-column :key="i" v-for="(item, i) in columns" @change="row => changeCascade(row, i)" :value="selected[i]" :item="item" :show="show">
            <picker-item v-for="(op, j) in item" :key="j" :text="op[label]" :render="render"></picker-item>
          </picker-column>
        </template>
        <template v-if="type === 'normal'">
          <picker-column @change="changeSingle" :value="current" :item="options" :show="show">
            <picker-item v-for="(op, j) in options" :key="j" :text="op[label]" :render="render"></picker-item>
          </picker-column>
        </template>
        <template v-if="type === 'multiple'">
          <picker-column @change="row => changeMultiple(row, i)" :value="selected[i]" :item="item" v-for="(item, i) in options" :show="show">
            <picker-item v-for="(op, j) in item" :key="j" :text="op[label]" :render="render"></picker-item>
          </picker-column>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import pickerColumn from './picker-column'
import pickerItem from './picker-item'
export default {
  name: 'Picker',
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    render: Function,
    label: String,
    type: {
      type: String,
      default: 'normal'
    },
    value: {
      type: [Array, Number],
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    options: {
      immediate: true,
      handler() {
        if (this.type === 'cascade') {
          this.parseOptions()
        } else if (this.type === 'multiple') {
          this.selected = this.value
        }
      }
    },
    value: {
      immediate: true,
      handler(v) {
        this.current = v
      }
    },
    show(v) {
      if (v) {
        setTimeout(() => {
          this.active = v
        }, 50);
      }     
    }
  },
  components: {
    pickerColumn,
    pickerItem
  },
  data() {
    return {
      index: 0,
      selected: [],
      columns: [],
      active: false,
      // 单列选择时索引
      current: 0
    }
  },

  methods: {
    close() {
      this.active = false
      setTimeout(() => {
        this.$emit('update:show', false)
      }, 300)
    },
    confirm() {
      if (this.type === 'normal') {
        this.$emit('input', this.current)
        this.$emit('change', this.current)
      } else {
        this.$emit('input', this.selected)
        this.$emit('change', this.selected)
      }
      this.close()
    },
    changeSingle() {
      this.$emit('input', this.current)
    },
    changeMultiple(row, col) {
      this.selected[col] = row
      this.$emit('input', this.selected)
    },
    countColumn(options, columns = 0) {
      if (options.length) {
        columns++
      }
      const current = options.filter(o => o.children && o.children.length)
      if (current.length) {
        columns = this.countColumn(current[0].children, columns)
      }
      return columns
    },
    formateColumns(options, index = 0, columns = []) {
      if (index < this.selected.length) {
        if (index === 0) {
          columns[0] = options
        } else if (index < this.selected.length) {
          columns[index] = options
        }
        if (index !== this.selected.length - 1) {
          columns = this.formateColumns(options[this.selected[index]].children, index + 1, columns)
        }
        return columns
      }
      return []
    },
    // 检测级联层级
    parseOptions() {
      const count = this.countColumn(this.options)
      let i = count
      while(i--) {
        this.selected[i] = this.value ? this.value[i] : 0
      }
      if (count > 0) {
        this.columns = this.formateColumns(this.options)
      }
    },
    changeCascade(row, col) {
      this.selected.forEach((item, i) => {
        if (i === col) {
          this.selected[i] = row
        } else if (i > col) {
          this.selected[i] = 0
        }
      })
      this.$emit('change', this.selected)
      this.columns = this.formateColumns(this.options)
    }
  }
}
</script>

<style lang="scss">
  @import './variable.scss';
  .zoe-pop{
    position: fixed;
    left:0;
    top:0;
    z-index: 100;
    width:100%;
    height:100vh;
    > .mask{
      position: absolute;
      width:100%;
      height:100%;
      background: rgba(0, 0, 0, .6);
      opacity: 0;
      transition: .3s;
      &.active{
        opacity: 1;
      }
    }
  }
  .zoe-picker{
    background: white;
    position: absolute;
    z-index: 10;
    bottom:0;
    left:0;
    width:100%;
    height:300px;
    transform: translate3d(0, 300px, 0);
    transition: .3s;
    &.active{
      transform: translate3d(0, 0, 0);
    }
    header{
      height:50px;
      border-bottom: 1px solid $border;
      justify-content: space-between;
      font-size: 14px;
      text-align: center;
      display: block;
      position: relative;
      box-sizing: border-box;
      span{
        display: block;
        line-height: 50px;
        padding:0 10px;
      }
      .tit{
        color:$text-gray;
      }
      .confirm{
        color:$green;
        position: absolute;
        right:0;top:0;
      }
    }
    .wrapper{
      height: calc(300px - 50px);
      position: relative;
      display: flex;
      .mask{
        position: absolute;
        z-index: 10;
        left:0;
        width:100%;
        height: 105px;
        pointer-events: none;
        transform: translateZ(0);
        box-sizing: border-box;
        &.top{
          background: linear-gradient(0deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));
          top:0;
          border-bottom: 1px solid $border;
        }
        &.bottom{
          background: linear-gradient(180deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));
          bottom:0;
          border-top: 1px solid $border;
        }
      }
    }
  }
</style>
