<template>
  <div class="custom-time-limit-wrap" @click.stop="">
    <div class="head">
      <div class="title">自定义修改时长</div>
    </div>
    <div class="form-row" style="margin-top: 20px;">
      <div class="label">修改时长</div>
      <el-input v-model="customTimeLimit" placeholder="时长单位为小时" @input="customTimeLimit = customTimeLimit.replace(/[^\d]/g, '')"></el-input>
    </div>
    <div class="foot" style="margin-top: 20px;">
      <div class="submit-btn" style="width: 90px;height: 30px;" @click="closeCustomTimeLimit">取消</div>
      <div class="submit-btn" style="width: 90px;height: 30px;margin-left: 10px" @click="confirmCustomTimeLimit">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customTimeLimit: '',
    };
  },

  props: {
    childCloseTimeLimitDialogToggle_1: Boolean,
  },

  watch: {
    childCloseTimeLimitDialogToggle_1() {
      this.closeCustomTimeLimit();
    },
  },

  methods: {
    closeCustomTimeLimit() {
      this.$emit('closeCustomTimeLimit');
      this.customTimeLimit = '';
    },
    confirmCustomTimeLimit() {
      this.$emit('confirmCustomTimeLimit', this.customTimeLimit);
      this.customTimeLimit = '';
    },
  },
};
</script>

<style lang="less">
  @import "../assets/style/style";
  .custom-time-limit-wrap{
    position: absolute;
    left: 100px;
    bottom: 100px;
    width: 428px;
    height: 190px;
    border-radius: 20px;
    padding: 0 30px;
    box-sizing: border-box;
    border: 2px solid #b5b5b5;
    background-color: #ffffff;
    box-shadow: 4px 4px 4px 0 #8a8a8a;
    overflow: hidden;
    .head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding-top: 10px;
      .title{
        color: @bColor;
        font-size: 20px;
        font-weight: bold;
      }
      .delete-btn{
        color: @bColor;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
      }
    }
    .form-row{
      display: flex;
      align-items: center;
      margin-top: 12px;
      .label{
        width: 100px;
        color: @bColor;
        font-weight: bold;
      }
    }
    .foot{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 12px;
    }
  }
</style>
