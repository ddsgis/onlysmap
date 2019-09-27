<template>
  <div class="model">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card class="x-card">
          <div class="x-img">
            <div id="map"/>
          </div>
          <div class="x-info">
            <h1>{{ baseInfo.fieldName }}<span style="font-size:18px;">( {{ baseInfo.farmName }} )</span></h1>
            <p>{{ baseInfo.discription }}</p>
          </div>
          <!-- <el-menu class="el-menu-vertical-demo" default-active="1">
            <el-menu-item index="1">
              <router-link :to="{path:'/farmManage/account/dashboard'}">基本信息</router-link>
            </el-menu-item>
            <el-menu-item index="2">
              <router-link :to="{path:'/farmManage/account/timeline'}">种植记录</router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <router-link :to="{path:'/farmExperiment/soilAnalysis'}">土壤分析记录</router-link>
            </el-menu-item>
          </el-menu> -->

        </el-card>
      </el-col>
      <el-col :span="20">
        <div class="info">
          <field-info :base-info="baseInfo"/>
          <field-plant :base-plant="basePlant"/>
          <!-- <model-bear :period-list="periodList"/>
          <model-env :envir-list="envirList" :xue-ming="baseInfo.xueMing"/>
          <model-pest/>
          <model-product :product-list="productList"/>
          <model-variety :seed-list="seedList"/> -->
        </div>
      </el-col>

    </el-row>
    <div class="leftNav">
      <el-steps :active="active" direction="vertical">
        <el-step
          v-for="(item,index) in lefNavList"
          :title="item.title"
          :key="item.title"
          class="step"
          @click.native="jump(index)"
        />
      </el-steps>
    </div>
  </div>
</template>

<script>
import fieldInfo from './components/fieldInfo';
import fieldPlant from './components/fieldPlant';
import { getFarmField, getFieldInfo } from '@/api/farmManage.js';
import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import { defaults } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
// import { getMapRect } from '@/api/farmmap.js';
import base from '@/api/base.js';
import { Fill, Stroke, Style, Text } from 'ol/style.js';
import { getToken } from '@/utils/auth';

export default {
  components: {
    fieldInfo,
    fieldPlant
  },
  data() {
    return {
      src: require('@/assets/img/map.jpeg'),
      active: 0,
      baseInfo: {},
      basePlant: {},
      lefNavList: [
        {
          title: '基本信息'
        },
        {
          title: '种植记录'
        },
        {
          title: '天气信息'
        }
        // {
        //   title: '环境需求'
        // },
        // {
        //   title: '病虫害信息'
        // },
        // {
        //   title: '产出品'
        // },
        // {
        //   title: '作物品种'
        // }
      ],
    };
  },
  created() {

  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.onScroll, true);
      getFieldInfo(this.$route.query.id).then(result => {
        // debugger;
        const data = result.data;
        this.baseInfo = data.baseInfo;
        this.setViewLevel(data.baseInfo.rect);
      });
    });
    this.initHtml();
    this.getFFList();
    // this.initPng();
  },
  methods: {
    initHtml() {
      this.map = this.initMap();
      // console.log(process.env.BASE_API + '/farmmanage/farmjson');
      this.vector = new VectorLayer({
        source: new VectorSource({
          // projection: 'EPSG:3857',
          format: new GeoJSON({
            dataProjection: 'EPSG:3857'
          }),
          // url: process.env.BASE_API + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
          url: base.farm + '/farmmanage/fieldjson?token=' + getToken() + '&id=' + this.$route.query.id // 从文件加载边界等地理信息
        }),
        style: function(feature) {
          // style.getText().setText(resolution < 5000 ? feature.get('name') : ''); // 当放大到1:5000分辨率时，显示国家名字
          // return [style];
          // debugger;
          const selected = true;
          var style = new Style({
            fill: new Fill({
              color: selected ? 'rgba(200,20,20,0.3)' : 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: selected ? 'rgba(200,20,20,0.8)' : '#ffcc33',
              width: selected ? 2 : 1
            }),
            // image: new CircleStyle({
            //   radius: 7,
            //   fill: new Fill({
            //     color: '#ffcc33'
            //   })
            // }),
            text: new Text({
              font: '12px Calibri,sans-serif',
              fill: new Fill({
                color: '#000'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3
              })
            })
          });
          style.getText().setText(feature.get('fieldName'));
          return style;
        }
      });
      // debugger;
      // this.setViewLevel(this.baseInfo.rect);
      // getMapRect(this.$route.query.id).then(res => {
      //   const data = res.data;
      //   this.setViewLevel(data);
      // });
      this.map.addLayer(this.vector);
    },
    getFFList() {
      getFarmField()
        .then(result => {
          if (result.status === 20000) {
            const list = result.data;
            this.$store.dispatch('getFFList', list);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initMap() {
      const center = transform([111.58, 38.7], 'EPSG:4326', 'EPSG:3857');
      return new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              // projection: 'EPSG:4326',
              url:
                'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
            })
            // extent: {
            //     name: 'layer1'
            // }
          })
        ],
        view: new View({
          center: center,
          projection: 'EPSG:3857',
          zoom: 14,
          maxZoom: 19,
          minZoom: 1
        }),
        controls: defaults({
          attribution: false,
          rotate: false,
          zoom: false,
          mouseposition: false
        }).extend([])
      });
    },
    setViewLevel(data) {
      if (data !== '' && data !== undefined) {
        var coor = data.split(',');
        var extent = [coor[0], coor[1], coor[2], coor[3]];
        this.map.getView().fit(extent);
      }
    },
    jump(index) {
      const jump = document.querySelectorAll('.header');
      const total = jump[index].offsetTop;
      this.active = index;
      const _this = this;
      let distance = _this.$parent.$refs['appMain'].scrollTop;
      // 平滑滚动，时长500ms，每10ms一跳，共50跳
      let step = total / 50;
      if (total > distance) {
        smoothDown();
      } else {
        const newTotal = distance - total;
        step = newTotal / 50;
        smoothUp();
      }
      function smoothDown() {
        if (distance < total) {
          distance += step;
          _this.$parent.$refs['appMain'].scrollTop = distance;
          setTimeout(smoothDown, 10);
        } else {
          _this.$parent.$refs['appMain'].scrollTop = total;
        }
      }
      function smoothUp() {
        if (distance > total) {
          distance -= step;
          _this.$parent.$refs['appMain'].scrollTop = distance;
          setTimeout(smoothUp, 10);
        } else {
          _this.$parent.$refs['appMain'].scrollTop = total;
        }
      }
    },
    onScroll() {
      const scrolled = this.$parent.$refs['appMain'].scrollTop;
      if (scrolled <= 107) {
        this.active = 0;
      } else if (scrolled <= 311 && scrolled >= 107) {
        this.active = 0;
      } else if (scrolled <= 698 && scrolled >= 311) {
        this.active = 1;
      } else if (scrolled <= 900 && scrolled >= 698) {
        this.active = 2;
      } else if (scrolled <= 1266 && scrolled >= 900) {
        this.active = 3;
      } else if (scrolled <= 1368 && scrolled >= 1266) {
        this.active = 4;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .model {
    .x-card {
      margin: 0;
      border: 1px solid #dcdfe6;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    }
    #map {
      height: 250px;
    }
    .x-img {
      margin: -20px;
      margin-bottom: 30px;
      // height: 250px;
    }
    .x-info {
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      p {
        word-wrap: break-word;
        line-height: 2;
      }
    }
    .el-menu-vertical-demo {
      border: 0;
      margin: 0 -20px;
    }
    .is-active {
      background-color: #409eff;
      color: #fff;
    }
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .leftNav {
      position: fixed;
      bottom: 50px;
      height: 400px;
      margin-left: 50px;
    }
    .step {
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
