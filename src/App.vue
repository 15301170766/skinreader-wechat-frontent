<template>
  <div style="height: 100%" id="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        created() {

        }
    }
</script>
<style lang="less">
@import "./assets/style/style";
// element单选按钮样式
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: @bColor !important;
  border-color: rgba(0, 0, 0, 0) !important;
  box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0) !important;
}
</style>
