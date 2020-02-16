<script>
export default {
  name: 'picker-item',
  props: {
    render: {
      type: Function,
      default: null
    },
    text: {
      type: String,
      default: ''
    }
  },
  render(h) {
    return (
      <li class="zoe-picker-item">
        {this.render ? (
          this.render(h, this.text)
        ) : (
          this.text
        )}
      </li>
    )
  }
}
</script>

<style lang="scss">
  @import './variable';
  .zoe-picker-item{
    font-size: 16px;
    color:$text;
    line-height: 40px;
    height:40px;
    @include st(1);
  }
</style>
