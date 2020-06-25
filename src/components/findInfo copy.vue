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
         warningTitle:"您已绑定成功",
                time:3,
                dialogVisible:false,
                rules:{
                    phone:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ]
                },
                form:{},
                username: '',
                onoff:true,
                userRole:"患者",
                loading:false,
                disable:false,
                subMsg:"确定",
                openid:"",
                roleKey:2,
                wx_headimgurl:"",
                wx_nickname:""
    };
  },
    methods:{
            showExitModal(){
                this.dialogVisible = true;
                let that = this;
               let intervalTime = setInterval(function (){
                   console.log(that.time)
                    if (that.time >1){
                        that.time-=1;
                        console.log(that.time)
                    }else{
                        that.dialogVisible = false;
                        //去掉定时器的方法
                        clearInterval(intervalTime);

                        //下面weixin退出去方法
                        wx.closeWindow();

                    }
                },1000);

            },
           async sginWexinsdk(){
                var timestamp = Date.parse(new Date());
                let noncestr =  Math.random().toString(36).substr(2);
               console.log(window.location.href)
               let url = window.location.href;
               let singUrl = url.split("#")
               console.log(singUrl[0])
                const response = await this.$apollo.mutate({
                    mutation: gql`mutation(
                                  $noncestr: String!
                                  $timestamp: String!
                                  $url: String!
                                ){
                                  wxJsapiSign(
                                    noncestr: $noncestr,
                                    timestamp: $timestamp,
                                    url: $url
                                  )
                                }`,
                    variables: {
                        noncestr: noncestr,
                        timestamp:timestamp,
                        url:singUrl[0],
                    },
                });
                console.log(response.data.wxJsapiSign)
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxbe7ec83ba9498419', // 必填，公众号的唯一标识
                    timestamp:timestamp, // 必填，生成签名的时间戳
                    nonceStr: noncestr, // 必填，生成签名的随机串
                    signature: response.data.wxJsapiSign,// 必填，签名
                    jsApiList: ['closeWindow'] // 必填，需要使用的JS接口列表
                });
                wx.ready(function(){
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                });
                wx.error(function(res){
                    console.log(res)
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            },
            //登录按钮
             login(ruleForm) {
                 this.loading = true;
                     this.$refs[ruleForm].validate(async(valid) => {
                         if (valid) {
                             //bindDoctorAndPatient(role:${this.pageNumber},page_size:${this.pageSize})
                             try {
                                 const response = await this.$apollo.mutate({
                                     mutation: gql`mutation(
                                  $role: Int!
                                  $mobile: String!
                                  $openid: String!
                                  $name: String
                                   $wx_headimgurl: String
                                   $wx_nickname: String
                                ){
                                  bindDoctorAndPatient(
                                    role: $role,
                                    mobile: $mobile,
                                    openid: $openid,
                                    name: $name,
                                    wx_headimgurl: $wx_headimgurl,
                                    wx_nickname: $wx_nickname
                                  )
                                }`,
                                     variables: {
                                         role: this.roleKey,
                                         mobile:this.form.phone,
                                         openid:this.openid,
                                         name:this.form.name,
                                         wx_headimgurl: this.wx_headimgurl,
                                         wx_nickname: this.wx_nickname
                                     },
                                 });
                                 this.disable = true;
                                 this.showExitModal();

                             }catch (e) {
                                 let message = e.message.split(":")[1];
                                 this.$message.error(message);
                             }
                             this.loading = false;
                         } else {
                             this.loading = false;
                         }
                     });
             },
                    // JS`正则表达式`获取地址栏url参数：
             getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg); // 匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; // 返回参数值

             },
                //引用hint()在最上方弹出提示
            async  hint() {

                let param = this.$route.query
                console.log(this.getUrlParam('code'))

                let weCode = this.getUrlParam('code');
                let roleState = this.getUrlParam('state');
                if (roleState =='pation'){
                    this.roleKey = 2
                }else if (roleState == 'doctor') {
                    this.roleKey = 1
                }
                 let variables = {code:weCode}
                 const res = await this.$apollo.query({
                     query: gql`query($code: String!){
                     getFWHCode(code: $code)
                   }`,
                     variables,
                 });
              console.log(res)
               let resJson = JSON.parse(res.data.getFWHCode);
               console.log(resJson)
               if (resJson.openid){
                   this.openid = resJson.openid;
                   this.wx_headimgurl = resJson.headimgurl;
                   this.wx_nickname = resJson.nickname;
                   //判断 是否绑定过 如果有自动执行退出方法
                   let isBindVariables = {openid:resJson.openid}
                   const isBind = await this.$apollo.query({
                       query: gql`query($openid: String!){
                     getIsBind(openid: $openid)
                   }`,
                       variables: isBindVariables,
                   });

                   if (isBind.data.getIsBind == true){
                      //  this.warningTitle = '您已经进行过信息绑定'
                      //  this.showExitModal();

                       const findInfo = await this.$apollo.query({
                       query: gql`query($openid: String!){
                     getPatientInfoByFwhOpenid(openid: $openid){
                       id
                       phone
                     }
                   }`,
                       variables: isBindVariables,
                   });
                   }

                   this.sginWexinsdk();

              /*     else {
                       this.openid = resJson.openid
                       let access_token = resJson.access_token
                      // let url = "https://api.weixin.qq.com/sns/userinfo?access_token=31_5HhfOhV8-UcL6mrNYPEDHOu_AeBm8PBzCgqi_CpO4LddU29vnJwr_9eWSaSGMVNGdbkdHmbduwvMY6QbAvDoWQ&openid=o-_cjuMsi-bhutmAosZVMcVqEhTg&lang=zh_CN";
                       let urlk = "https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+this.openid+"&lang=zh_CN"
                       jsonp(urlk, null, (err, data) => {
                           if (err) {
                               console.error(err.message);
                           } else {
                               console.log(data);
                           }
                       })
                   }*/

               }else {
                   this.$message.error("获取id失败请重新进入页面");
               }
               /*  if (res.data.getFWHCode != 'errcode'){
                    this.openid = res.data.getFWHCode
                }*/
            }

        },
      async  mounted(){

            this.hint();
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