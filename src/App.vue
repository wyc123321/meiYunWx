<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/reset.less';
</style>
<style>
  html,body{
    height: 100%;
    background: rgb(248,247,252);
  }
  #app {
    width: 100%;
    height: 100%;
  }
</style>
