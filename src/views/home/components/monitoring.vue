<template>
  <div class="mointor">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Field Info</span>
          </div>
          <div class="text item">
            <ul>
              <li class="x-li">
                <span class="x-name">Name</span>
                <span class="x-value">F3R556</span>
              </li>
              <li class="x-li">
                <span class="x-name">Crop</span>
                <span class="x-value">Sunflower</span>
              </li>
              <li class="x-li">
                <span class="x-name">Name</span>
                <span class="x-value">F3R556</span>
              </li>
              <li class="x-li">
                <span class="x-name">Variety</span>
                <span class="x-value">-</span>
              </li>
              <li class="x-li">
                <span class="x-name">Productivity</span>
                <span class="x-value">3.00 t/ha</span>
              </li>
              <li class="x-li">
                <span class="x-name">Soil type</span>
                <span class="x-value">-</span>
              </li>
              <li class="x-li">
                <span class="x-name">Sowing date</span>
                <span class="x-value">Aprill 28,2018</span>
              </li>
              <li class="x-li">
                <span class="x-name">Harversing date</span>
                <span class="x-value">September 28,2018</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>NDM</span>
          </div>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>Weather</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Stateline images</span>
          </div>
          <div class="text item">我是地图模块</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Vegetation</span>
          </div>
          <div class="text item">
            <ve-line :data="vData" :settings="vSettings" :extend="vExtend"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Temperature</span>
          </div>
          <div class="text item">
            <ve-line :data="tData" :settings="tSettings" :extend="tExtend"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    this.vSettings = {
      labelMap: {
        fieldF3R556: 'FieldF3R556',
        average: 'Average'
      }
    };
    this.vExtend = {
      'xAxis.0.axisLabel.rotate': 45
    };
    this.tSettings = {
      labelMap: {
        soilTem: 'Soil,℃',
        aicTem: 'Aic，℃'
      },
      yAxisType: ['℃']
    };
    this.tExtend = {
      'xAxis.0.axisLabel.rotate': 45,
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      }
    };
    return {
      vData: {
        columns: ['date', 'fieldF3R556', 'average'],
        rows: [
          { date: '一月份', fieldF3R556: 0.11, average: 0.15 },
          { date: '二月份', fieldF3R556: 0.21, average: 0.22 },
          { date: '三月份', fieldF3R556: 0.31, average: 0.39 },
          { date: '四月份', fieldF3R556: 0.45, average: 0.45 },
          { date: '五月份', fieldF3R556: 0.35, average: 0.33 },
          { date: '六月份', fieldF3R556: 0.35, average: 0.32 },
          { date: '七月份', fieldF3R556: 0.25, average: 0.2 },
          { date: '八月份', fieldF3R556: 0.45, average: 0.4 },
          { date: '九月份', fieldF3R556: 0.25, average: 0.23 },
          { date: '十月份', fieldF3R556: 0.15, average: 0.11 },
          { date: '十一月份', fieldF3R556: 0.15, average: 0.13 },
          { date: '十二月份', fieldF3R556: 0.05, average: 0.1 }
        ]
      },
      tData: {
        columns: ['date', 'soilTem', 'aicTem'],
        rows: [
          { date: '一月份', soilTem: -10, aicTem: -9 },
          { date: '二月份', soilTem: -20, aicTem: -19 },
          { date: '三月份', soilTem: -30, aicTem: -25 },
          { date: '四月份', soilTem: 0, aicTem: 0.45 },
          { date: '五月份', soilTem: 10, aicTem: 9 },
          { date: '六月份', soilTem: 20, aicTem: 16 },
          { date: '七月份', soilTem: 30, aicTem: 27 },
          { date: '八月份', soilTem: 40, aicTem: 46 },
          { date: '九月份', soilTem: 50, aicTem: 50 },
          { date: '十月份', soilTem: 40, aicTem: 32 },
          { date: '十一月份', soilTem: 30, aicTem: 27 },
          { date: '十二月份', soilTem: 20, aicTem: 20 }
        ]
      }
    };
  }
};
</script>

<style lang='scss' scoped>
  .mointor {
    .box-card {
      height: 370px;
    }
    .text {
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    }
    .x-li {
      line-height: 30px;
      .x-name {
        display: inline-block;
        width: 40%;
      }
      .x-value {
        display: inline-block;
        width: 40%;
      }
    }
  }
</style>
