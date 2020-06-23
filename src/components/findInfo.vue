<template>
  <div class="findInfo">
    <div class="nav">个人信息</div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改信息</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import gql from "graphql-tag";
import jsonp from "jsonp";
var wx = require("weixin-js-sdk");
export default {
  name: "findInfo",
  data() {
    return {
        form:{}
    };
  }
};
</script>
<style  scoped>
.findInfo {
  width: 100%;
  height: 100%;
  background: url("../assets/blur-bokeh-5547.jpg") no-repeat;
  background-size: 100% 100%;
  padding: 40px;
  box-sizing: border-box;
}
.nav {
  font-size: 26px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 80px;
}
.saveBtn{
    border-radius:50px;
    padding: 16px 40px;
    margin: 0 auto;
}
</style>