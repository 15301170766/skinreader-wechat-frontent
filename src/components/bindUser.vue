<template>
    <div id="bg" >
        <div id="hint"><!-- 提示框 -->
            <p>登录失败</p>
        </div>

       <!-- <div id="login_wrap">-->


            <div class="login" style="overflow: hidden;"><!-- 登录注册切换动画 -->
                <img style="height: 100%;width: 100%" src="../assets/blur-bokeh-5547.jpg"
                />
          <!--      <div id="status" style="font-size: 20px">
                    <i style="top: 0">{{userRole}}</i>
                  &lt;!&ndash;  <i style="top: 35px">医生</i>&ndash;&gt;
                    <i style="right: 5px">绑定</i>
                </div>-->
                <span style="">
                    <div style="text-align: left;
                                position: relative;
                                bottom: 50px;line-height: 30px;">
                        <p style="font-size: 25px">绑定手机</p>
                        <p style="font-size: 17px">您将可以收到医生的随访及关怀信息</p>
                    </div>
                   <el-form :rules="rules" ref="form" :model="form" label-width="0px">
                    <el-form-item  prop="phone" style="height: 55px">
                            <!-- <p class="form form1">
                                <el-input class="form_input" style="font-family: inherit" v-model="form.name" placeholder="请输入用户名"></el-input>
                            </p> -->
                            <p class="form">
                                <el-input class="form_input" style="font-family: inherit" v-model="form.phone" placeholder="请输入手机号"></el-input>
                            </p>
                    </el-form-item>

                            <!-- <p class="form"><input type="password" id="passwd" placeholder="password"></p>-->
                            <!-- <p class="form confirm"><input type="password" id="confirm-passwd" placeholder="confirm password"></p>-->
                        <el-button :disabled="disable" v-loading="loading" type="button" value="绑定" class="btn" @click="login('form')">
                            {{subMsg}}
                        </el-button>
                        </el-form>
                        <!-- <input type="button" value="Log in" class="btn" onclick="login()" style="margin-right: 20px;">-->

                  <!--  <a href="#">Forget your password?</a>-->
                </span>
            </div>

        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                width="77%"
                >
            <span>{{warningTitle}}，页面将在{{time}}秒后自动退出</span>
            <span slot="footer" class="dialog-footer">
    <el-button style="height: 30px;width: 55px" type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>

     <!--   </div>-->

    </div>
</template>
<script>
    import gql from 'graphql-tag';
    import jsonp from 'jsonp';
    var wx = require('weixin-js-sdk');
    export default {
        name: '',
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
                        wx.miniProgram.navigateTo({url: '/pages/packageA/pages/ChatFree/main'})
                        //下面weixin退出去方法
                        // wx.closeWindow();
                        wx.miniProgram.postMessage({ data: {foo: 'bar'} })
                        // wx.miniProgram.getEnv(function(res) { console.log(res.miniprogram) })
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
                       this.warningTitle = '您已经进行过信息绑定'
                       this.showExitModal();
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
    }
</script>
<style scoped>
    @import "../assets/style/bindUserCss.css";
    *{
        margin: 0;
        padding: 0;
    }

    html,
    body {
        height: 100%;
    }


    input:focus{
        outline: none;
    }
    .form_input /deep/ .el-input__inner{
        width: 300px;
        height: 30px;
        font-size: 18px;
        background: none;
        border: none;
        border-bottom: 2px solid #06325f;
        color: #010101;
    }

    .form_input /deep/ .el-input__inner::placeholder{
        color: #05050554;
        font-size: 18px;
        font-family: inherit;
    }
    .confirm{
        height: 0;
        overflow: hidden;
        transition: .25s;
    }
    .btn{
        width: 140px;
        height: 40px;
        color: white;
        border: 2px solid #DC8384;
        background: #DC8384;
        font-family: inherit;
        transition: .25s;
        border-radius: 20px;
        font-size: 18px;
        position: relative;
        left: 30%;
        top: 80px;
    }
    .btn:hover{
        background: rgba(255,255,255,.25);
    }
    #login_wrap{
        width: 980px;
        min-height: 500px;
        border-radius: 10px;
        font-family: inherit;
        overflow: hidden;
        box-shadow: 0px 0px 120px rgba(0, 0, 0, 0.25);
        position: fixed;
        top: 50%;
        right: 50%;
        margin-top: -250px;
        margin-right: -490px;
    }
    .login{
        width: 50%;
        height: 100%;
        min-height: 500px;
        background: linear-gradient(45deg, #abd3f1, #092e53);
        position: relative;
        float: right;
    }
    .login #status{
        width: 90px;
        height: 35px;
        margin: 40px auto;
        color: #fff;
        font-size: 30px;
        font-weight: 600;
        position: relative;
        overflow: hidden;
    }
    .login #status i{
        font-style: normal;
        position: absolute;
        transition: .5s
    }
    .login span{
        text-align: center;
        position: absolute;
        left: 50%;
        margin-left: -150px;
        top: 40%;
        margin-top: -140px;
    }
    .login span a{
        text-decoration: none;
        color: #fff;
        display: block;
        margin-top: 80px;
        font-size: 18px;
    }
    #bg{
        background: linear-gradient(40deg,#0f61ae,#b0c7e5);
        height: 100%;
    }
    /*绘图*/
    #login_img{
        width: 50%;
        min-height: 500px;
        background: linear-gradient(45deg, #0e406e, #d0b6b6);
        float: left;
        position: relative;
    }
    #login_img span{
        position: absolute;
        display: block;
    }
    #login_img .circle{
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: linear-gradient(45deg, #df5555, #ef907a);
        top: 70px;
        left: 50%;
        margin-left: -100px;
        overflow: hidden;
    }
    #login_img .circle span{
        width: 150px;
        height: 40px;
        border-radius: 50px;
        position: absolute;
    }
    #login_img .circle span:nth-child(1){
        top: 30px;
        left: -38px;
        background: #c55c59;
    }
    #login_img .circle span:nth-child(2){
        bottom: 20px;
        right: -35px;
        background: #934555;
    }
    #login_img .star span{
        background: radial-gradient(#fff 10%,#fff 20%,rgba(72, 34, 64, 0));
        border-radius: 50%;
        box-shadow: 0 0 7px #fff;
    }
    #login_img .star span:nth-child(1){
        width: 15px;
        height: 15px;
        top: 50px;
        left: 30px;
    }
    #login_img .star span:nth-child(2){
        width: 10px;
        height: 10px;
        left: 360px;
        top: 80px;
    }
    #login_img .star span:nth-child(3){
        width: 5px;
        height: 5px;
        top: 400px;
        left: 80px;
    }
    #login_img .star span:nth-child(4){
        width: 8px;
        height: 8px;
        top: 240px;
        left: 60px;
    }
    #login_img .star span:nth-child(5){
        width: 4px;
        height: 4px;
        top: 20px;
        left: 200px;
    }
    #login_img .star span:nth-child(6){
        width: 4px;
        height: 4px;
        top: 460px;
        left: 410px;
    }
    #login_img .star span:nth-child(7){
        width: 6px;
        height: 6px;
        top: 250px;
        left: 350px;
    }
    #login_img .fly_star span{
        width: 90px;
        height: 3px;
        background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        background: -o-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        background: linear-gradient(to right, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
        transform: rotate(-45deg);
    }
    #login_img .fly_star span:nth-child(1){
        top:60px;
        left: 80px;
    }
    #login_img .fly_star span:nth-child(2){
        top: 210px;
        left: 332px;
        opacity: 0.6;
    }
    #login_img p{
        text-align: center;
        color: #af4b55;
        font-weight: 600;
        margin-top: 365px;
        font-size: 25px;
    }
    #login_img p i{
        font-style: normal;
        margin-right: 45px;
    }
    #login_img p i:nth-last-child(1){
        margin-right: 0;
    }
    /*提示*/
    #hint{
        width: 100%;
        line-height: 70px;
        background: linear-gradient(-90deg, #9b494d, #bf5853);
        text-align: center;
        font-size: 25px;
        color: #fff;
        box-shadow: 0 0 20px #733544;
        display: none;
        opacity: 0;
        transition: .5s;
        position: absolute;
        top: 0;
        z-index: 999;
    }
    /* 响应式 */
    @media screen and (max-width:1000px ) {
        #login_img{
            display: none;
        }
        #login_wrap{
            width: 490px;
            margin-right: -245px;
        }
        .login{
            width: 100%;

        }
    }
    @media screen and (max-width:560px ) {
        #login_wrap{
            width: 330px;
            margin-right: -165px;
        }
   /*     .login span{
            margin-left: -125px;
        }*/
        .form input{
            width: 250px;
        }
        .btn{
            width: 113px;
        }
        .btn span{
           margin-left: 0px;
        }
    }
    @media screen and (max-width:345px ) {
        #login_wrap {
            width: 290px;
            margin-right: -145px;
        }
    }
    .form1{
        margin-bottom: 20px;
    }
</style>