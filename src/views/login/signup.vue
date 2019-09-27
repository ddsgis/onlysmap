<template>
  <div class="sign-container">
    <div class="left">
      <!-- <img :src="src"> -->
    </div>
    <div class="right">
      <el-form :model="sign" size="mini" class="sign-form">
        <h3 class="title">注 册</h3>
        <div class="sign-body">
          <el-form-item style="margin-top:20px;">
            <el-input v-model="sign.email" type="text" placeholder="请输入邮箱地址"/>
          </el-form-item>
          <el-form-item style="margin-top:20px; display:none;">
            <el-input v-model="sign.vCode" type="text" placeholder="请输入验证码" style="width:172px;"/>
            <el-button :disabled="disabled" type="primary" @click="sendEmail">{{ yzBTN }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-input v-model="sign.password" type="text" placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native.prevent="handleSign">注 册</el-button>
          </el-form-item>
          <div class="tips">
            <router-link :to="{path:'/login'}" class="sign">已有账号</router-link>
            <router-link :to="{path:'/login'}" class="sign">找回密码</router-link>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { signUp, sendEmail } from '@/api/login.js';
export default {
  data() {
    return {
      sign: {},
      yzBTN: '获取验证码',
      disabled: false,
      time: 0
    };
  },
  methods: {
    handleSign() {
      var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (this.sign.email === '') {
        alert('请输入邮箱');
      } else if (!regEmail.test(this.sign.email)) {
        alert('邮箱格式不正确');
        return false;
      } else {
        signUp(this.sign)
          .then(res => {
            // debugger;
            this.$router.push('login');
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    sendEmail() {
      var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      // debugger;
      if (this.sign.email === '') {
        alert('请输入邮箱');
      } else if (!regEmail.test(this.sign.email)) {
        alert('邮箱格式不正确');
        return false;
      } else {
        this.time = 60;
        this.disabled = true;
        this.timer();
        sendEmail(this.sign.email)
          .then(res => {
            // debugger;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.yzBTN = this.time + 's后重新获取';
        setTimeout(this.timer, 1000);
      } else {
        this.time = 60;
        this.btntxt = '获取验证码';
        this.disabled = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  $font_color: #333333;
  $light_gray: #eee;
  $font_tips: #c3c3c3;
  .sign-container {
    position: relative;
    height: 100%;
    .left {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 50%;
      background: url("../../assets/img/s6.jpg") no-repeat;
      background-size: 100%;
      background-size: cover;
    }
    .right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50%;
      text-align: center;
      background: url("../../assets/img/bg.jpg") no-repeat;
      /deep/ .el-input__inner {
        padding: 0 10px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        border: 1px solid transparent;
        border-bottom: 1px solid rgb(235, 237, 242);
      }
      /deep/ .el-button {
        margin-top: 30px;
        font-size: 14px;
        width: 180px;
        height: 48px;
        border-radius: 50px;
        box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;
        background-color: #2077ff;
      }
      .sign-form {
        position: absolute;
        right: 160px;
        width: 320px;
        max-width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: transparent;
        border-radius: 5px;
      }
      .sign-body {
        // padding: 16px;
      }
      .title {
        font-size: 22px;
        margin-bottom: 40px;
        color: $font_color;
        text-align: left;
        font-weight: bold;
        text-align: center;
        // border-bottom: 1px solid $light_gray;
      }
      .sign-form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
      }
      .iconfont {
        font-size: 12px;
      }
      .tips {
        font-size: 12px;
        color: $font_tips;
        margin-bottom: 10px;
        text-align: center;
        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }
      .sign {
        font-size: 12px;
        display: inline-block;
        margin-left: 14px;
        text-align: left;
      }
    }
  }
</style>
