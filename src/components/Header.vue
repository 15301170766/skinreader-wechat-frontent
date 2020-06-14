<template>
  <div class="wrapper">
      <div class="logo">鼎视科技</div>
      <!--<div class="help-btn iconfont">&#xe648;</div>-->
      <div class="user-btn">
          <div class="user-pic iconfont">&#xe65a;</div>
          <div class="user-name">{{username}}</div>
          <div class="menu-box">
              <div class="bg"></div>
              <ul class="menu">
                  <li class="menu-tab" @click="logout"><span class="iconfont">&#xe79c;</span>退出登录</li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
export default {
    name: '',
    data() {
        return {
            username: '',
        };
    },
    methods: {
        async logout() {
            try {
                const res = await this.$apollo.mutate({
                    mutation: gql`mutation{
                    adminLogout
                    }`,
                });
                if (res.data) {
                    this.$message({
                        message: '退出成功',
                        type: 'success',
                    });
                    this.$router.push('/');
                    window.sessionStorage.setItem('username', '');
                }
            } catch (error) {
                this.$message.error(error.message.split(':')[1]);
            }
        },
    },
    created() {
        console.log("abb")
/*        if (window.sessionStorage.username) {
            this.username = window.sessionStorage.username;
        } else {
            this.$router.push('/');
        }*/
    },
};
</script>

<style lang="less" scoped>
    .wrapper{
        height: 60px;
        min-width: 1100px;
        background: linear-gradient(to right, #808080, #363636 65%);
        user-select: none;
        .logo{
            float: left;
            height: 60px;
            color: #fff;
            margin-left: 60px;
            font-size: 20px;
            line-height: 60px;
        }
        .help-btn{
            float: right;
            width: 30px;
            height: 30px;
            margin-top: 14px;
            margin-right: 30px;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
        }
        .user-btn{
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            float: right;
            padding: 2px 20px;
            border-radius: 10px;
            margin-right: 80px;
            margin-top: 7px;
            cursor: pointer;
            user-select: none;
            .user-pic{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                color: #eee;
                background-color: #fff;
                font-size: 30px;
            }
            .user-name{
                height: 40px;
                color: #fff;
                margin-left: 15px;
                font-weight: bold;
                line-height: 40px;
            }
            .menu-box{
                display: none;
                position: absolute;
                right: 0;
                top: 36px;
                width: 180px;
                z-index: 2;
                .bg{
                    height: 20px;
                }
                .menu{
                    border-radius: 5px;
                    overflow: hidden;
                    color: #fff;
                    background-color: #2f2f2f;
                    .menu-tab{
                        display: flex;
                        align-items: center;
                        height: 36px;
                        font-size: 14px;
                        line-height: 36px;
                        cursor: pointer;
                        user-select: none;
                        .iconfont{
                            margin-left: 20px;
                            margin-right: 10px;
                            font-size: 28px;
                        }
                    }
                    .menu-tab:hover{
                        background-color: #7e8c8d;
                    }
                }
            }
        }
        .user-btn:hover{
            background-color: #828282;
        }
        .user-btn:hover .menu-box{
            display: block;
        }
    }
</style>
