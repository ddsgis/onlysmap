<template>
  <div class="login-container">
    <div class="left">
      <!-- <img :src="src"> -->
    </div>
    <div class="right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
        size="mini"
      >
        <h3 class="title">登 录</h3>
        <div class="login-body">
          <el-form-item class="form-item" prop="username">
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              autocomplete="on"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item class="form-item" prop="password">
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              name="password"
              autocomplete="on"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye"/>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登 录</el-button>
          </el-form-item>
        </div>
        <div class="tips">
          <router-link :to="{path:'/signUp'}" class="sign">立即注册</router-link>
          <router-link :to="{path:'/login'}" class="sign">找回密码</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate';

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
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
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
      .login-form {
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
      .login-body {
        // padding: 16px;
      }
      .tips {
        font-size: 14px;
        color: $font_tips;
        margin-bottom: 10px;
        text-align: center;
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
