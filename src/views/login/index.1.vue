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
        <h3 class="title">欢迎登录</h3>
        <div class="login-body">
          <el-form-item class="form-item" prop="username">
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              autocomplete="on"
              placeholder="username"
            >
              <template slot="prepend">
                <i class="iconfont icon-yonghu"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-item" prop="password">
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              name="password"
              autocomplete="on"
              placeholder="password"
              @keyup.enter.native="handleLogin"
            >
              <template slot="prepend">
                <i class="iconfont icon-mima"/>
              </template>
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye"/>
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >登 录</el-button>
          </el-form-item>
          <router-link :to="{path:'/signUp'}" class="sign">注册</router-link>
        </div>
        <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span>password: admin</span>
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
      background-color: #f5f6f7;
      .login-form {
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
      .login-body {
        padding: 16px;
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
        font-size: 14px;
        padding: 14px 16px;
        margin: 0;
        color: $font_color;
        text-align: left;
        font-weight: bold;
        border-bottom: 1px solid $light_gray;
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
        color: #409eff;
        display: block;
        margin-left: 14px;
        text-decoration: underline;
        text-align: left;
      }
    }
  }
</style>
