<template>
  <div class="login-container">
    <div class="right">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="登录" name="first">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
            size="mini"
          >
            <div class="login-body">
              <el-form-item class="form-item" prop="username">
                <span>账号：</span>
                <el-input
                  v-model="loginForm.username"
                  name="username"
                  type="text"
                  autocomplete="on"
                  placeholder="用户名"
                />
              </el-form-item>
              <el-form-item class="form-item" prop="password">
                <span>密码：</span>
                <el-input
                  :type="pwdType"
                  v-model="loginForm.password"
                  name="password"
                  autocomplete="on"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                />
                <!-- <span class="show-pwd" @click="showPwd">
                  <svg-icon icon-class="eye"/>
                </span>-->
              </el-form-item>
              <div class="tips">
                <router-link :to="{path:'/login'}" class="sign">忘记密码？</router-link>
              </div>
              <el-form-item>
                <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <el-form :model="sign" size="mini" class="login-form">
            <div class="sign-body">
              <el-form-item class="form-item">
                <span>邮箱：</span>
                <el-input v-model="sign.email" type="text" placeholder="请输入邮箱地址"/>
              </el-form-item>
              <el-form-item class="form-item" style="display:none;">
                <el-input
                  v-model="sign.vCode"
                  type="text"
                  placeholder="请输入验证码"
                  style="width:172px;"
                />
                <el-button :disabled="disabled" type="primary" @click="sendEmail">{{ yzBTN }}</el-button>
              </el-form-item>
              <el-form-item class="form-item">
                <span>密码：</span>
                <el-input v-model="sign.password" type="text" placeholder="请输入密码"/>
              </el-form-item>
              <div class="tips">
                <router-link :to="{path:'/login'}" class="sign">已有账号</router-link>
                <router-link :to="{path:'/login'}" class="sign">找回密码</router-link>
              </div>
              <el-form-item>
                <el-button type="primary" @click.native.prevent="handleSign">注 册</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate';
import { signUp, sendEmail } from '@/api/login.js';
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      sign: {
      },
      yzBTN: '获取验证码',
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      activeName: 'first',
      disabled: false,
      time: 0
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              // debugger;
              this.loading = false;
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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
  $bg: #2d3a4b;
  $dark_gray: #e8eaec;
  $light_gray: #eee;
  $font_color: #333333;
  $font_tips: #c3c3c3;
  .login-container {
    position: relative;
    height: 100%;
    background: url("../../assets/img/bg.jpeg") no-repeat;
    .right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50%;
      text-align: center;
      /deep/ .el-input__inner {
        padding: 0 10px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        border: 1px solid rgb(235, 237, 242);
        background-color: transparent;
        color: #ffffff;
      }
      /deep/ .el-button {
        font-size: 14px;
        width: 100px;
        height: 30px;
        box-shadow: 0px 0 5px #91b1c6;
        background-color: #91b1c6;
        border-color: #91b1c6;
        &:hover {
          color: #c3c3c3;
        }
      }
      /deep/ .el-tabs {
        position: absolute;
        width: 320px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #ffffff;
        border-radius: 5px;
      }
      /deep/ .el-tabs__nav {
        width: 100%;
        .el-tabs__item {
          width: 50%;
          padding: 0;
          color: #ffffff;
        }
        .el-tabs__item:last-child {
          border-right: 0;
        }
        .el-tabs__active-bar {
          width: 50% !important;
          background-color: #ffffff;
        }
        .el-tabs__item.is-active {
          color: #ffffff;
          background-color: #91b1c6;
        }
      }
      /deep/ .el-tabs__nav {
        border: 0;
      }
      /deep/ .el-input {
        width: 60%;
      }
      /deep/ .el-form-item__content {
        > span {
          color: #ffffff;
        }
      }
      .login-form {
        width: 320px;
        background-color: transparent;
        border-radius: 5px;
      }
      .login-body {
        // padding: 16px;
      }
      .tips {
        font-size: 14px;
        color: $font_tips;
        text-align: right;
        margin-right: 40px;
        margin-top: -10px;
        margin-bottom: 10px;
        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }
      .form-item {
        margin: 10px 0 24px 0;
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
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
      .iconfont {
        font-size: 12px;
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
