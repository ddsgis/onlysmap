<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <div slot="header" class="clearfix">
            <i class="iconfont icon-taizhang"/>
            <!-- <span>Weekly Status</span> -->
            <span>每周状态</span>
          </div>
          <div class="body">
            <p class="title">您的地块状态</p>
            <el-col :span="6">
              <div class="item">
                <div class="img">
                  <i class="iconfont icon-wangyuanj"/>
                </div>
                <p>1</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item">
                <div class="img">
                  <i class="iconfont icon-shulin"/>
                </div>
                <p>1</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item">
                <div class="img">
                  <i class="iconfont icon-wodenongchang"/>
                </div>
                <p>1</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="item" style="border-right:0;">
                <div class="img">
                  <i class="iconfont icon-haichong"/>
                </div>
                <p>1</p>
              </div>
            </el-col>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="iconfont icon-taizhang"/>
            <!-- <span>Recent Activites</span> -->
            <span>近期活动</span>
          </div>
          <div class="body">
            <ul>
              <li>
                <el-col :span="4">
                  <div class="day">19</div>
                  <div class="month">Mar</div>
                </el-col>
                <el-col :span="20">
                  <router-link :to="{path:''}">hahahahah</router-link>
                  <div class="info">yixiexinxi</div>
                </el-col>
              </li>
              <li>
                <el-col :span="4">
                  <div class="day">19</div>
                  <div class="month">Mar</div>
                </el-col>
                <el-col :span="20">
                  <router-link :to="{path:''}">hahahahah</router-link>
                  <div class="info">yixiexinxi</div>
                </el-col>
              </li>
            </ul>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="iconfont icon-taizhang"/>
            <span>日历</span>
          </div>
          <div class="body">
            <a-calendar @panelChange="onPanelChange"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="iconfont icon-taizhang"/>
            <span>快速导航</span>
          </div>
          <div class="body">
            <el-col :span="6">
              <router-link :to="{path:'/knowledgeBase/pest'}" class="router">
                <div class="img">
                  <i class="iconfont icon-yiyaoxiang"/>
                </div>
                <p>Pesticides</p>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link :to="{path:'/farmManage/scoutList'}" class="router">
                <div class="img">
                  <i class="iconfont icon-wangyuanj"/>
                </div>
                <p>Scout</p>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link :to="{path:'/farmManage/treatList'}" class="router">
                <div class="img">
                  <i class="iconfont icon-xinxinicon"/>
                </div>
                <p>Treatment</p>
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link :to="{path:'/farmManage/map'}" class="router" style="border-right:0;">
                <div class="img">
                  <i class="iconfont icon-diqiu"/>
                </div>
                <p>Map</p>
              </router-link>
            </el-col>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="iconfont icon-taizhang"/>
            <span>感染记录</span>
          </div>
          <div class="body">
            <LineChart :chart-data="lineChartData"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './admin/components/LineChart';
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }
};
export default {
  components: {
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    };
  },
  methods: {
    onPanelChange(value, mode) {
      console.log(value, mode);
    }
  }
};
</script>

<style scoped lang="scss">
  .dashboard {
    .box-card {
      /deep/ .el-card__header {
        background-color: #ebecf0;
      }
      .body {
        .el-col-6 {
          padding: 0 !important;
          text-align: center;
        }
        .title {
          font-size: 12px;
          padding: 15px;
          margin: 0 20px;
          border-bottom: 1px solid #cccccc;
        }
        .item {
          text-align: center;
          border-right: 1px solid #cccccc;
          margin: 20px 0;
          .img {
            margin: 5px 0;
            .iconfont {
              font-size: 36px;
            }
          }
          p {
            font-size: 24px;
            margin: 10px 0;
          }
          &:hover {
            color: #41a259;
            cursor: pointer;
          }
        }
        .router {
          display: inline-block;
          width: 130px;
          text-align: center;
          padding: 15px;
          margin: 10px 0 20px 0;
          border-radius: 5px;
          background-color: #ebecf0;
          .img {
            .iconfont {
              font-size: 34px;
            }
          }
          p {
            margin: 0;
            font-size: 14px;
          }
          &:hover {
            background-color: #41a259;
            color: #ffffff;
          }
        }
        ul {
          list-style: none;
          margin: 0;
          margin-bottom: 10px;
          li {
            overflow: hidden;
            border-bottom: 1px solid #cccccc;
            padding: 10px 0;
            .day {
              text-align: center;
              font-size: 24px;
              color: #888888;
            }
            .month {
              text-align: center;
              font-size: 14px;
              color: #888888;
            }
            a {
              color: #41a259;
            }
          }
        }
      }
    }
  }
</style>
