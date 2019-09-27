<template>
  <div class="sign-container">
    <div class="left">
      <!-- <img :src="src"> -->
    </div>
    <div class="right">
      <el-form :model="sign" size="mini" class="sign-form">
        <h3 class="title">欢迎注册</h3>
        <div class="sign-body">
          <el-form-item style="margin-top:20px;">
            <el-input v-model="sign.name" type="text" placeholder="请输入邮箱地址">
              <template slot="prepend">
                <i class="el-icon-message"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top:20px; display:none;">
            <el-input v-model="sign.vCode" type="text" placeholder="请输入验证码" style="width:172px;">
              <template slot="prepend">
                <i class="el-icon-news"/>
              </template>
            </el-input>
            <el-button :disabled="disabled" type="primary" @click="sendEmail">{{ yzBTN }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-input v-model="sign.password" type="text" placeholder="请输入密码">
              <template slot="prepend">
                <i class="iconfont icon-mima"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSign">注 册</el-button>
          </el-form-item>
          <router-link :to="{path:'/login'}" class="login">登录</router-link>
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
      if (this.sign.name === '') {
        alert('请输入邮箱');
      } else if (!regEmail.test(this.sign.name)) {
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
      debugger;
      if (this.sign.name === '') {
        alert('请输入邮箱');
      } else if (!regEmail.test(this.sign.name)) {
        alert('邮箱格式不正确');
        return false;
      } else {
        this.time = 60;
        this.disabled = true;
        this.timer();
        sendEmail(this.sign.name)
          .then(res => {
            debugger;
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
      background-color: #f5f6f7;
      .sign-form {
        // background-color: #ffffff;
        // border-radius: 5px;
        position: absolute;
        right: 160px;
        width: 300px;
        max-width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 5px;
      }
      .sign-body {
        padding: 16px;
      }
      .title {
        font-size: 14px;
        padding: 14px 16px;
        margin: 0;
        color: $font_color;
        text-align: left;
        font-weight: bold;
        border-bottom: 1px solid $light_gray;
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
    }
  }
</style>
