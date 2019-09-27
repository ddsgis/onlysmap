<template>
  <div class="map">
    <div v-if="!unbind" id="map" :style="{right:mapRight}" class="map">
      <div v-show="fieldShow" class="field">
        <i class="el-icon-close field-close" @click="fieldClose"/>
        <el-card class="field-info">
          <h2>地块信息</h2>
          <span>{{ farmInfo.farmName }}</span>,
          <!-- <a :href="hrefLink">{{ farmInfo.fieldName }}</a> -->
          <router-link :to="{path:'/farmManage/account/dashboard', query:{id:farmInfo.fieldId}}" >
            {{ farmInfo.fieldName }}
          </router-link>
          <span>({{ farmInfo.fieldArea }} ha)</span>
          <div v-show="cropInfoShow" class="crop-info">
            <div class="item">
              <span class="key">农作物：</span>
              <span class="value">{{ crop.cropName }}</span>
            </div>
            <div class="item">
              <span class="key">种植日期：</span>
              <span class="value">{{ crop.plantTime | dateformat('YYYY-MM-DD') }}</span>
            </div>
            <div class="item">
              <span class="key">预期收货日期：</span>
              <span class="value">{{ crop.expectedPlantTime | dateformat('YYYY-MM-DD') }}</span>
            </div>
            <div class="item">
              <span class="key">产量目标：</span>
              <span class="value">{{ crop.estimateYield }} {{ crop.harvestUnit }}</span>
            </div>
            <div class="item">
              <span class="key">现阶段：</span>
              <span class="value">{{ crop.stage }}</span>
            </div>
          </div>
        </el-card>

      </div>
      <el-dialog :title="title" :visible.sync="cropShow" width="70%" top="5vh">
        <el-alert :closable="false" type="success" title="种植详情"/>
        <el-form :model="crop" size="medium" label-width="200px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="种植日期/芽期（多年生植物）">
                <el-date-picker v-model="crop.plantTime" type="date" placeholder="选择日期"/>
              </el-form-item>
              <el-form-item label="农作物">
                <!-- <el-autocomplete
                v-model="crop.cropTypeId"
                :fetch-suggestions="querySearch"
                class="inline-input"
                placeholder="请输入内容"
                style="width:100%;"
                @select="handleSelect"
                />-->
                <el-select
                  v-model="crop.cropTypeId"
                  filterable
                  placeholder="请选择"
                  @change="handleSelect"
                >
                  <el-option
                    v-for="item in restaurants"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="品种">
                <el-select v-model="crop.plantVarietyId" :disabled="disabled" @change="changeM">
                  <el-option
                    v-for="(item,index) in variety"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="生长方式">
                <el-input
                  v-model.number="crop.plantStandard"
                  :disabled="disabled"
                  type="text"
                  placeholder="请输入生长方式"
                />
                <!-- <el-select v-model="crop.plantStandard" :disabled="disabled">
                <el-option
                  v-for="(item,index) in methods"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                />
                </el-select>-->
              </el-form-item>
              <el-col :span="12">
                <el-form-item label="单位" label-width="80px">
                  <el-select v-model="crop.harvestUnit" :disabled="disabled">
                    <el-option label="MT/ha" value="MT/ha"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产量目标" label-width="80px">
                  <el-input
                    v-model.number="crop.estimateYield"
                    type="number"
                    placeholder="请输入产量目标"
                  />
                  <!-- <el-autocomplete
                  :fetch-suggestions="querySearch"
                  v-model="crop.estimateYield"
                  class="inline-input"
                  placeholder="请输入产量目标"
                  @select="handleSelect"
                  />-->
                  <!-- <el-select v-model="crop.estimateYield" :disabled="disabled">
                  <el-option label="Select Yield Goal" value="Select Yield Goal"/>
                  </el-select>-->
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <img :src="cropImg" width="60%">
            </el-col>
          </el-row>
          <el-button type="success" @click="saveCrop">保存</el-button>
        </el-form>
      </el-dialog>
      <el-dialog :title="harvestTitle" :visible.sync="endSeason" width="50%" top="5vh">
        <el-alert :closable="false" type="success" title="收获详情"/>
        <el-form :model="crop" size="medium">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="农作物:">
                <span class="value">{{ crop.name }}</span>
              </el-form-item>

              <el-form-item label="收获日期">
                <el-date-picker v-model="crop.harvestDate" type="date" placeholder="选择日期"/>
              </el-form-item>
              <el-form-item label="实际产量">
                <el-input
                  v-model.number="crop.actualYield"
                  type="text"
                  placeholder="请输入实际产量"
                />
                <span>{{ crop.harvestUnit }}</span>
                <!-- <el-select v-model="crop.plantStandard" :disabled="disabled">
                <el-option
                  v-for="(item,index) in methods"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                />
                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-button type="success" @click="saveSeason">保存</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div v-else id="map"/>
    <div class="float-layer">
      <div id="nav">
        <div class="search" style="display:none;">
          <el-input v-model="location" size="mini" class="s-input" placeholder="请输入一个地址"/>
        </div>
        <div class="x-btn-group">
          <el-button size="mini" title="放大" @click="zoomOut();">
            <i class="iconfont icon-jia"/>
          </el-button>
          <el-button size="mini" title="缩放" @click="zoomIn();">
            <i class="iconfont icon-jian"/>
          </el-button>
        </div>
        <div class="x-btn-group" style="display:none;">
          <el-button size="mini" title="画多边形" @click="drawPlo();">
            <i class="iconfont icon-wubianxing"/>
          </el-button>
          <el-button size="mini" title="画圆" @click="drawPlo();">
            <i class="iconfont icon-weibiaoti1fuzhi"/>
          </el-button>
          <el-button size="mini" title="定位" @click="drawPlo();">
            <i class="iconfont icon-zuobiaocopy"/>
          </el-button>
        </div>
        <div class="x-btn-group" style="display:none;">
          <el-button size="mini" title="编辑" @click="drawPlo();">
            <i class="iconfont icon-bianji"/>
          </el-button>
          <el-button size="mini" title="删除" @click="drawPlo();">
            <i class="iconfont icon-shanchu"/>
          </el-button>
        </div>
      </div>
    </div>
    <div id="topNav" class="layer-btn">
      <el-button size="mini" style @click="addMap();">添加地块</el-button>
      <!-- <el-button title="图层控制" size="mini" @click="layerCheck();">图层控制</el-button> -->
      <el-button title="识别" size="mini" @click="detectLayer();">识别</el-button>
      <el-button title="上传地块" size="mini" @click="uploadShp();">上传地块</el-button>
    </div>
    <div id="mouse-position"/>
    <a-drawer :title="title" :width="720" :visible="farmShow" @close="onClose">
      <!-- <el-dialog :title="title" :visible.sync="farmShow" width="60%" top="5vh" @opened="opened"> -->
      <Farm ref="farm" :form="form" :geo="geoStr" @fieldEnd="fieldEnd"/>
      <!-- </el-dialog> -->
    </a-drawer>

    <el-dialog :title="soilTitle" :visible.sync="soilShow" fullscreen="fullscreen">
      <soil-body ref="soilBody" :detail="soilDetail"/>
      <div class="dialog-footer">
        <el-button type="success" @click="save_soil">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="waterTitle" :visible.sync="waterShow" fullscreen="fullscreen">
      <water-body ref="warterBody" :detail="soilDetail"/>
      <div class="dialog-footer">
        <el-button type="success" @click="save_water">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="orgTitle" :visible.sync="orgShow" fullscreen="fullscreen">
      <org-body ref="orgBody" :detail="soilDetail"/>
      <div class="dialog-footer">
        <el-button type="success" @click="save_org">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="planTitle" :visible.sync="planShow" fullscreen="fullscreen">
      <plan-body
        :steps="steps"
        :step-show="stepShow"
        :current-active="currentActive"
        :plan-data="planData"
        :farm-list="farmList"
        :field-list="fieldList"
      />
    </el-dialog>
    <el-dialog :title="scoutTitle" :visible.sync="scoutShow" fullscreen="fullscreen">
      <scout-body ref="scoutBody" :detail="soilDetail"/>
      <div class="dialog-footer">
        <el-button type="success" @click="save_scout">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="treatTitle" :visible.sync="treatShow" fullscreen="fullscreen">
      <treat-body ref="treatBody" :detail="soilDetail"/>
      <div class="dialog-footer">
        <el-button type="success" @click="save_treat">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="mapShow" fullscreen="fullscreen">
      <SubMap/>
    </el-dialog>
    <el-dialog :visible.sync="detectShow" fullscreen="fullscreen">
      <detectMap/>
    </el-dialog>
    <el-dialog :title="uploadTitle" :visible.sync="uploadShow" width="40%">
      <div class="upload_demo">
        <el-upload
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="4"
          :on-change="shpBind"
          :file-list="fileList"
          drag
          multiple
          action
          accept="shp"
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            将shp文件拖到此处，或
            <em>点击配置</em>
          </div>

          <div slot="tip" class="el-upload__tip">必须是shp文件</div>
        </el-upload>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="config();"
        >生成GeoJson数据</el-button>
      </div>
    </el-dialog>
    <div class="right">
      <!-- <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="用户管理">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      </el-tabs>-->
      <el-button :style="{right:left}" class="lb" type="default" size="mini" @click="leftOrRight">
        <!-- <div>项</div>
        <div>目</div>-->
      </el-button>
      <div v-show="isTCShow" :style="{width:tcWidth}" class="tcPanel">
        <div class="search">
          <el-input v-model="location" size="mini" class="s-input" placeholder="请输入一个地址"/>
        </div>
        <ul class="filters">
          <li v-for="(val, key) in fieldList" :key="key">
            <a @click="selectByAttribute(val.Id)">{{ val.fieldName }}</a>
            <div class="other">
              <span class="area">{{ val.fieldArea.toFixed(2) }} ac</span>
            </div>
          </li>
        </ul>
      </div>
      <el-button :style="{right:left}" class="tc" type="default" size="mini" @click="leftTC">
        <!-- <div>图</div>
        <div>层</div>-->
      </el-button>
      <div v-show="tcShow" :style="{width:tcWidth}" class="tcPanel">
        <div id="layersControl" class="x-tree">
          <el-tree
            :data="layersdata"
            :default-expanded-keys="[1]"
            :default-checked-keys="[1]"
            class="tree"
            show-checkbox
            node-key="id"
            @check-change="changeLayer"
          />
        </div>
      </div>
      <div v-show="tcShow || isTCShow" class="close" @click="close">x</div>
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import 'ol/ol.css';
// import BMap from 'BMap'
// import MVT from 'ol/format/MVT's
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { TileArcGISRest } from 'ol/source';
import { defaults } from 'ol/control';
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import MousePosition from 'ol/control/MousePosition';
// import OSM from 'ol/source/OSM'
import { getMapLayers, getMapRect } from '@/api/farmmap.js';
import { createStringXY } from 'ol/coordinate.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Farm from './components/farm';
import SubMap from './components/subMap';
import detectMap from './components/detectMap';
import { map } from '@/components/mixins/map.js';
import { getList } from '@/api/farmManage.js';
import { getToken } from '@/utils/auth';
import base from '@/api/base.js';
import { getArea } from 'ol/sphere.js';
import { Polygon, LineString } from 'ol/geom.js';
import Overlay from 'ol/Overlay.js';
import { unByKey } from 'ol/Observable.js';
import { open } from 'shapefile';
// import Feature from 'ol/Feature';

export default {
  components: {
    Farm,
    SubMap,
    detectMap
  },
  mixins: [map],
  data() {
    return {
      mapShow: false,
      detectShow: false,
      uploadShow: false,
      uploadTitle: '上传shp文件',
      key: '',
      map: {},
      vector: {},
      draw: {},
      modify: {},
      snap: {},
      selectTool: null,
      layersdata: [],
      farmShow: false, // 添加地块表单显示标记
      geoStr: '',
      unbind: false,
      fileList: [],
      selection: {},
      location: '', // 地图查询地址
      farmInfo: {},
      layerShow: false,
      layertitle: '图层选择',
      hrefLink: '',
      form: {
        fieldSection: [{}]
      },
      fieldList: {},
      searchModel: {},
      /**
       * Currently drawn feature.
       * @type {module:ol/Feature~Feature}
       */
      sketch: null,
      /**
       * The help tooltip element.
       * @type {Element}
       */
      helpTooltipElement: null,
      /**
       * Overlay to show the help messages.
       * @type {module:ol/Overlay}
       */
      helpTooltip: null,
      /**
       * The measure tooltip element.
       * @type {Element}
       */
      measureTooltipElement: null,
      /**
       * Overlay to show the measurement.
       * @type {module:ol/Overlay}
       */
      measureTooltip: null,
      /**
       * Message to show when the user is drawing a polygon.
       * @type {string}
       */
      continuePolygonMsg: 'Click to continue drawing the polygon',
      /**
       * Message to show when the user is drawing a line.
       * @type {string}
       */
      continueLineMsg: 'Click to continue drawing the line',
      listener: null
    };
  },
  mounted() {
    this.initHtml();
    const params = {
      pageSize: 100,
      currentPage: 1,
      sortBy: 'CreateTime',
      descending: 'desc',
      filter: JSON.stringify(this.searchModel),
      type: 'field'
    };
    getList(params).then(res => {
      const list = res.data.list;
      this.fieldList = list;
    });
  },
  methods: {
    initHtml() {
      const _this = this;
      this.map = this.initMap();
      // console.log(process.env.BASE_API + '/farmmanage/farmjson');
      this.vector = new VectorLayer({
        source: new VectorSource({
          // projection: 'EPSG:3857',
          format: new GeoJSON({
            dataProjection: 'EPSG:3857'
          }),
          // url: process.env.BASE_API + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
          url: base.farm + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
        }),
        style: function(feature) {
          // style.getText().setText(resolution < 5000 ? feature.get('name') : ''); // 当放大到1:5000分辨率时，显示国家名字
          // return [style];
          // debugger;
          const selected = !!_this.selection[feature.get('fieldName')];
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
      getMapRect('').then(res => {
        const data = res.data;
        this.setViewLevel(data);
      });
      this.map.addLayer(this.vector);
      // this.map.addControl(new MousePosition());
      getMapLayers().then(res => {
        const list = res.data;
        for (var k = 0; k < list.length; k++) {
          if (list[k]['label'] === '识别图层') {
            list[k]['treeId'] = new TileLayer({
              source: new TileArcGISRest({
                url: list[k].url
              })
            });
          } else {
            list[k]['treeId'] = new TileLayer({
              source: new XYZ({
                url: list[k].url
              })
            });
          }
        }
        this.layersdata = list;
      });
      this.selectTool = new Select({});
      // this.setViewLevel();
      // this.map.on('click', function(e) {
      //   _this.initCheckLayer(e);
      // });
      this.map.on('click', _this.initCheckLayer);
    },
    reloadMap() {
      // this.vector.getSource().refresh();
      const _this = this;
      this.map.removeLayer(this.vector);
      this.vector = new VectorLayer({
        source: new VectorSource({
          // projection: 'EPSG:3857',
          format: new GeoJSON({
            dataProjection: 'EPSG:3857'
          }),
          // url: process.env.BASE_API + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
          url: base.farm + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
        }),
        style: function(feature) {
          // style.getText().setText(resolution < 5000 ? feature.get('name') : ''); // 当放大到1:5000分辨率时，显示国家名字
          // return [style];
          // debugger;
          const selected = !!_this.selection[feature.get('fieldName')];
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
      debugger;
      getMapRect('').then(res => {
        const data = res.data;
        this.setViewLevel(data);
      });
      this.map.addLayer(this.vector);
    },
    initMap() {
      // alert(1111);
      const center = transform([111.58, 38.7], 'EPSG:4326', 'EPSG:3857');
      var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });
      var view = new View({
        center: center,
        projection: 'EPSG:3857',
        zoom: 15,
        maxZoom: 21,
        minZoom: 8
        // 12408328.549645802,3180315.4358613286;12410774.534550928,3056793.198152484;12623116.599127147,3055723.0797564914;12618988.999599747,3182149.924540173;12408328.549645802,3180315.4358613286
        // extent: [12408328.549645802, 12623116.599127147, 3180315.4358613286, 3055723.0797564914]
      });
      // const extent = [12408328, 3056793, 12623117, 3180315];
      // view.fit(extent, { nearest: true});
      // var key = 'pk.eyJ1IjoiZmFybWxvZ3MiLCJhIjoiVnJZSUIwWSJ9.XSJYFLurKX_qxVQ1-iCqBA';
      return new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              // projection: 'EPSG:4326',
              url:
                // 'http://www.google.cn/maps/vt?lyrs=s@823&gl=cn&x={x}&y={y}&z={z}'
                // 'http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
                'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
              // 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              // 'http://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=0767c985fdbfea9f4f2dd0e490d52a07'
              // 'http://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=2ce94f67e58faa24beb7cb8a09780552']
              // 'https://{a-d}.tiles.mapbox.com/v4/farmlogs.mj5no0lo/{z}/{x}/{y}.png?access_token=' + key
            })
            // extent: {
            //     name: 'layer1'
            // }
          })
          // googleMapLayer
          // this.getTianDiTuLayer('img_w')
          // this.getTianDiTuLayer('cva_w')
        ],
        view: view,
        controls: defaults({
          attribution: false,
          rotate: false,
          zoom: false,
          mouseposition: true
        }).extend([mousePositionControl])
      });
    },
    setViewLevel(data) {
      // const bigger_box = {'lng_min': 12408328, 'lng_max': 12623117, 'lat_min': 3056793, 'lat_max': 3180315};
      // var topLeft = [parseFloat(bigger_box['lng_min']), parseFloat(bigger_box['lat_max'])];
      // var topRight = [parseFloat(bigger_box['lng_max']), parseFloat(bigger_box['lat_max'])];
      // var bottomLeft = [parseFloat(bigger_box['lng_min']), parseFloat(bigger_box['lat_min'])];
      // var bottomRight = [parseFloat(bigger_box['lng_max']), parseFloat(bigger_box['lat_min'])];
      // // var p1 = transform(topLeft, 'EPSG:3857', 'EPSG:3857');
      // // var p2 = transform(topRight, 'EPSG:3857', 'EPSG:3857');
      // // var p3 = transform(bottomLeft, 'EPSG:3857', 'EPSG:3857');
      // // var p4 = transform(bottomRight, 'EPSG:3857', 'EPSG:3857');
      // var p1 = topLeft;
      // var p2 = topRight;
      // var p3 = bottomLeft;
      // var p4 = bottomRight;
      // const coor_bigger_box = [p1, p2, p4, p3];
      // debugger;
      // var shape_tmp = new Feature({
      //   geometry: new Polygon([coor_bigger_box])
      // });
      // const tmpLayer = new VectorLayer({
      //   source: new VectorSource(),
      //   style: new Style({
      //     stroke: new Stroke({
      //       color: 'rgba(0,0,0,0)',
      //       width: 2,
      //     }),
      //     fill: new Fill({
      //       color: 'rgba(0,0,0,0)',
      //     })
      //   }),
      // });
      // tmpLayer.getSource().addFeature(shape_tmp);
      // var feature = tmpLayer.getSource().getFeatures()[0];
      // var polygon = (feature.getGeometry());
      // var size = (this.map.getSize());
      // this.map.getView().fit(polygon, {size: size, constrainResolution: false, nearest: true});
      // this.map.getView().fit(polygon, size);
      if (data !== '' && data !== undefined) {
        var coor = data.split(',');
        var extent = [coor[0], coor[1], coor[2], coor[3]];
        this.map.getView().fit(extent);
      }
    },
    getTianDiTuLayer(lyr) {
      var urls = [];
      for (var i = 0; i < 8; i++) {
        urls.push(
          'http://t' +
          i +
          '.tianditu.gov.cn/DataServer?T=' +
          lyr +
          '&x={x}&y={y}&l={z}&tk=0767c985fdbfea9f4f2dd0e490d52a07'
        );
      }
      var layer = new TileLayer({
        source: new XYZ({
          urls: urls
        })
      });
      return layer;
    },
    drawPlo() {
      // this.unbind = true;
      this.fieldShow = false;
      const _this = this;
      // debugger;
      this.map.un('click', _this.initCheckLayer);
      this.map.on('pointermove', _this.pointerMoveHandler);
      this.map.getViewport().addEventListener('mouseout', function() {
        _this.helpTooltipElement.classList.add('hidden');
      });
      // 实例化交互绘制类对象并添加到地图容器中
      this.draw = new Draw({
        source: this.vector.getSource(), // 绘制层数据源
        // 几何图形类型
        type: 'Polygon',
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      // modify
      this.modify = new Modify({
        source: this.vector.getSource()
      });
      // snap
      this.snap = new Snap({
        source: this.vector.getSource()
      });
      this.map.addInteraction(this.draw);
      this.createMeasureTooltip();
      this.createHelpTooltip();
      // this.map.addInteraction(this.modify);
      // this.map.addInteraction(this.snap);
      this.draw.on('drawstart', this.drawStartEvt, this);
      // 添加绘制结束事件监听，在绘制结束后保存信息到数据库
      this.draw.on('drawend', this.drawEndCallBack, this);
    },
    /**
     * Handle pointer move.
     * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
     */
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return;
      }
      /** @type {string} */
      var helpMsg = 'Click to start drawing';

      if (this.sketch) {
        //   var geom = (this.sketch.getGeometry());
        //   if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg;
        //   } else if (geom instanceof LineString) {
        //     helpMsg = this.continueLineMsg;
        //   }
      }

      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);

      this.helpTooltipElement.classList.remove('hidden');
    },
    /**
     * Creates a new help tooltip
     */
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement('div');
      this.helpTooltipElement.className = 'tooltip hidden';
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      });
      this.map.addOverlay(this.helpTooltip);
    },
    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip() {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(
          this.measureTooltipElement
        );
      }
      this.measureTooltipElement = document.createElement('div');
      this.measureTooltipElement.className = 'tooltip tooltip-measure';
      this.measureTooltip = new Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this.map.addOverlay(this.measureTooltip);
    },
    initCheckLayer(event) {
      // alert('12');
      // debugger;
      const pixel = this.map.getEventPixel(event.originalEvent);
      const feature = this.map.forEachFeatureAtPixel(pixel, function(
        feature,
        layer
      ) {
        return feature;
      });
      if (feature !== undefined) {
        // selectStyle.getText().setText(feature.get('fieldName'));
        this.selection = {};
        this.selection[feature.get('fieldName')] = feature;
        this.farmInfo = feature.values_;
        // 放大
        this.setViewLevel(this.farmInfo.fieldRect);
        // farmInfo 需返回农作物保存后，农作物的一些信息，来判断该块地是否种植农作物
        this.getCropInfo();
        // if ((this.farmInfo.crop !== undefined && this.farmInfo.crop.cropID > 0) || (this.crop.Id > 0)) {
        //   this.cropInfoShow = true;
        //   this.crop = this.farmInfo.crop;
        // } else {
        //   this.cropInfoShow = false;
        //   // 加入判断，根据地块获得当前种植的作物
        //   const param = {
        //     seedId: '',
        //     fieldId: this.farmInfo.fieldId,
        //     harvest: '1'
        //   };
        //   const _this = this;
        //   getMethod(param).then(res => {
        //     if (res.code === 20000) {
        //       const { list } = res.data;
        //       if (list.length > 0) {
        //         _this.crop = list[0];
        //         _this.cropInfoShow = true;
        //       } else {
        //         _this.cropInfoShow = false;
        //       }
        //       // this.crop.plantStandard = list[0];
        //     } else {
        //       _this.cropInfoShow = false;
        //     }
        //   });
        // }
        debugger;
        this.soilDetail.farmName = feature.get('farmName');
        this.soilDetail.fieldName = feature.get('fieldName');
        this.hrefLink = '/farmManage/account/dashboard?id=' + this.farmInfo.fieldId;
        console.log(this.soilDetail.farmName);
        // this.soil
        this.vector.setStyle(this.vector.getStyle());
        // feature.setStyle(selectStyle);
        // alert(feature.get('fieldName'));
        this.fieldShow = true;
      } else {
        alert('no feature');
      }
    },
    drawStartEvt(evt) {
      // debugger;
      // set sketch
      this.sketch = evt.feature;
      const _this = this;

      /** @type {module:ol/coordinate~Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;

      this.listener = this.sketch.getGeometry().on('change', function(evt) {
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = _this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          // output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        _this.measureTooltipElement.innerHTML = output;
        _this.measureTooltip.setPosition(tooltipCoord);
      });
    },
    /**
     * 绘制结束事件的回调函数，
     * @param {ol.interaction.DrawEvent} evt 绘制结束事件
     */
    drawEndCallBack(evt) {
      const _this = this;
      this.measureTooltipElement.className = 'tooltip tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      // this.helpTooltipElement = null;
      this.createMeasureTooltip();
      unByKey(this.listener);
      this.map.on('click', _this.initCheckLayer);
      this.map.un('pointermove', _this.pointerMoveHandler);
      // _this.helpTooltipElement.classList.add('hidden');
      // 绘制图形类型
      // var geoType = $("#type option:selected").val()
      // $("#dialog-confirm").dialog("open") // 打开属性信息设置对话框
      const geoType = 'Polygon';
      let geoStr = '';
      const currentFeature = evt.feature; // 当前绘制的要素
      var geo = currentFeature.getGeometry(); // 获取要素的几何信息
      var coordinates = geo.getCoordinates(); // 获取几何坐标
      var area = getArea(geo);
      this.form.fieldArea = area * 0.0015 * 0.1647369; // 转为英亩
      console.log(area);
      // 将几何坐标拼接为字符串
      if (geoType === 'Polygon') {
        geoStr = coordinates[0].join(';');
      } else {
        geoStr = coordinates.join(';');
      }
      this.geoStr = geoStr;
      console.log(geoStr);
      this.farmShow = true;
      this.map.removeInteraction(this.draw);
      // this.unbind = false;
    },
    /**
     * Format area output.
     * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea(polygon) {
      // var sourceProj = this.map.getView().getProjection(); // 获取投影坐标系
      // debugger;
      // var area = getArea(polygon, { projection: sourceProj });
      var area = getArea(polygon);
      var output;
      if (area > 10000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2<sup>';
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2<sup>';
      }
      return output;
    },
    changeLayer(data, checked, indeterminate) {
      // alert(data);
      this.layersdata.forEach((layer, index) => {
        if (layer.id === data.id) {
          if (checked) {
            this.map.addLayer(layer.treeId);
          } else {
            this.map.removeLayer(layer.treeId);
          }
        }
      });
    },
    zoomOut() {
      const view = this.map.getView();
      view.setZoom(view.getZoom() + 1);
    },
    zoomIn() {
      const view = this.map.getView();
      view.setZoom(view.getZoom() - 1);
    },
    opened() { },
    layerCheck() {
      console.log('选择图层');
      this.layerShow = true;
    },
    addMap() {
      this.mapShow = true;
    },
    selectByAttribute(value) {
      var features = this.vector.getSource().getFeatures();
      // console.log(features);
      // var value = '115街坊';
      // var property = 'name';
      var selectedByAttriFeature;// 实际应用中设置成全局变量
      for (var i = 0, ii = features.length; i < ii; i++) {
        // if (features[i].get(property) === value) {
        if (features[i].getId() === value + '') {
          selectedByAttriFeature = features[i];
          break;
        }
      }
      if (selectedByAttriFeature !== undefined) {
        // selectStyle.getText().setText(feature.get('fieldName'));
        this.selection = {};
        this.selection[selectedByAttriFeature.get('fieldName')] = selectedByAttriFeature;
        this.farmInfo = selectedByAttriFeature.values_;
        // 放大
        this.setViewLevel(this.farmInfo.fieldRect);
        console.log(this.farmInfo.crop.cropID);
        // farmInfo 需返回农作物保存后，农作物的一些信息，来判断该块地是否种植农作物
        this.getCropInfo();
        // if ((this.farmInfo.crop !== undefined && this.farmInfo.crop.cropID > 0) || (this.crop.Id > 0)) {
        //   this.cropInfoShow = true;
        //   this.crop = this.farmInfo.crop;
        // } else {
        //   this.cropInfoShow = false;
        //   // 加入判断，根据地块获得当前种植的作物
        //   const param = {
        //     seedId: '',
        //     fieldId: this.farmInfo.fieldId,
        //     harvest: '1'
        //   };
        //   const _this = this;
        //   getMethod(param).then(res => {
        //     if (res.code === 20000) {
        //       const { list } = res.data;
        //       if (list.length > 0) {
        //         _this.crop = list[0];
        //         _this.cropInfoShow = true;
        //       } else {
        //         _this.cropInfoShow = false;
        //       }
        //       // this.crop.plantStandard = list[0];
        //     } else {
        //       _this.cropInfoShow = false;
        //     }
        //   });
        // }
        // debugger;
        this.soilDetail.farmName = selectedByAttriFeature.get('farmName');
        this.soilDetail.fieldName = selectedByAttriFeature.get('fieldName');
        this.soilDetail.testName = this.soilDetail.farmName + ',' + this.soilDetail.fieldName;
        this.hrefLink = '#/farmManage/account/dashboard?id=' + this.farmInfo.fieldId;
        this.vector.setStyle(this.vector.getStyle());
        // feature.setStyle(selectStyle);
        // alert(feature.get('fieldName'));
        this.fieldShow = true;
      } else {
        alert('no feature');
      }
    },
    detectLayer() {
      this.detectShow = true;
    },
    uploadShp() {
      this.uploadShow = true;
    },
    config() {
      debugger;
      const _this = this;
      var shpFile, dbfFile, prjFile;
      var shpArray, dbfArray;
      for (var k = 0; k < _this.fileList.length; k++) {
        var name = _this.fileList[k].name;
        var extension = name.split('.')[1];
        if (extension === 'shp') {
          shpFile = _this.fileList[k];
        }
        if (extension === 'dbf') {
          dbfFile = _this.fileList[k];
        }
        if (extension === 'prj') {
          prjFile = _this.fileList[k];
        }
      }
      // this.fileList.forEach(element => {
      //   const name = element.name;
      //   const extension = name.split('.')[1];
      //   if (extension === 'shp') {
      //     shpFile = element;
      //   }
      //   if (extension === 'dbf') {
      //     dbfFile = element;
      //   }
      //   if (extension === 'prj') {
      //     prjFile = element;
      //   }
      // });
      prjFile.name;
      const shpname = shpFile.name;
      const shpextension = shpname.split('.')[1];
      // console.log(extension)
      if (shpextension !== 'shp') {
        this.$alert('文件不是shp文件！请重新选择文件', {
          confirmButtonText: '确定'
        });
      } else {
        // var newProj = 'EPSG:4326';
        const reader = new FileReader();
        const fileData = shpFile.raw;
        reader.readAsArrayBuffer(fileData);
        reader.onload = function(e) {
          shpArray = e.target.result;
          var reader2 = new FileReader();
          reader2.readAsArrayBuffer(dbfFile.raw);
          reader2.onload = function(evt) { // 读取完文件之后会回来这里
            dbfArray = evt.target.result;
            open(shpArray, dbfArray, { encoding: 'UTF-8' })
              .then(source => source.read()
                .then(function log(result) {
                  if (result.done) return;
                  console.log(result.value);
                  var tempfeature = new GeoJSON().readFeatures(result.value);
                  // var style = _this.vector.getStyle();
                  // tempfeature.setStyle(style);
                  _this.vector.getSource().addFeatures(tempfeature);
                  _this.uploadShow = false;
                  var geo = tempfeature[0].getGeometry(); // 获取要素的几何信息
                  _this.map.getView().fit(geo, {
                    // size: [1803, 700],
                    // constrainResolution: false,
                    // earest: true,
                    padding: [40, 720, 100, 0]
                  });
                  return source.read().then(log);
                }))
              .catch(error => console.error(error.stack));
          };
        };
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    shpBind(files, fileList) {
      this.fileList = fileList;
    }
  }
};
</script>

<style scoped lang="scss">
  $bg: rgba(
    $color: #ffffff,
    $alpha: 0.7
  );
  .map {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    margin: -10px;
    /deep/ .anticon {
      vertical-align: 0.4em;
    }
    .upload_demo {
      text-align: center;
      margin-top: 50px;
    }
    .right {
      .close {
        position: absolute;
        right: 10px;
        top: 0;
        width: 20px;
        height: 20px;
        text-align: center;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
      /deep/ .el-button--mini {
        border-radius: 0;
      }
      .lb {
        padding: 7px;
        position: absolute;
        top: 0px;
        right: 10px;
        width: 25px;
        height: 80px;
        background: url("../../assets/img/xm.png") no-repeat;
        background-size: 100%;
        background-size: cover;
        border: 0;
      }
      .tc {
        padding: 7px;
        position: absolute;
        top: 80px;
        right: 0;
        width: 25px;
        height: 80px;
        background: url("../../assets/img/tc.png") no-repeat;
        background-size: 100%;
        background-size: cover;
        border: 0;
      }
      .tcPanel {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        bottom: 0;
        background-color: #ffffff;
        overflow: auto;
        padding-top: 25px;
        .filters {
          padding: 0;
          text-decoration: none;
          li {
            padding: 5px 15px;
            border-bottom: 1px solid #dcdcdc;
            line-height: 1.2;
            a {
              display: block;
              font-size: 18px;
              color: #333333;
            }
            a:hover {
              color: #41a259;
              cursor: pointer;
            }
            .other {
              .area {
                color: #666666;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    #map {
      height: 100%;
    }
    .float-layer {
      position: absolute;
      top: 20px;
      left: 30px;
      color: #ffffff;
      .el-button {
        padding: 8px !important;
        display: block;
      }
      .search {
        position: absolute;
        left: 40px;
        width: 200px;
      }
      .x-btn-group {
        .iconfont {
          font-size: 12px;
        }
        .el-button + .el-button {
          margin: 0;
        }
        .el-button:first-child {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        .el-button:nth-child(2) {
          border-radius: 0;
        }
        .el-button:last-child {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        margin-bottom: 20px;
      }
      .x-btn {
        padding: 10px;
      }
      .x-tree {
        margin-top: 10px;
        position: absolute;
        top: 30px;
        left: 40px;
        width: 200px;
        .tree {
          border-radius: 4px;
        }
      }
    }
    .layer-btn {
      position: absolute;
      top: 20px;
      left: 80px;
      .el-button + .el-button {
        margin-left: 0;
      }
    }
    #mouse-position {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
    .field {
      position: absolute;
      z-index: 1;
      top: 200px;
      bottom: 10px;
      right: 10px;
      width: 300px;
      padding-top: 20px;
      // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      .field-close {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        width: 20px;
        text-align: center;
        height: 20px;
        line-height: 30px;
        color: #fff;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
      .field-info {
        background-color: $bg;
        margin-top: 30px;
        a {
          text-decoration-line: underline;
          &:hover {
            color: rgb(64, 158, 255);
          }
        }
      }
      .field-action {
        background-color: $bg;
        .el-button--text {
          display: block;
          margin: 0;
          padding: 5px 0;
          color: #333333;
          text-decoration-line: underline;
          &:hover {
            color: rgb(64, 158, 255);
          }
        }
      }
      .field-button {
        background-color: $bg;
        .filed-btn {
          width: 100%;
        }
      }
      .crop-info {
        margin: 5px 0;
        .item {
          margin: 5px 0;
          .key {
            display: inline-block;
            width: 115px;
            font-weight: 600;
          }
        }
      }
    }
    .el-select-dropdown {
      z-index: 20006;
    }
  }
</style>

