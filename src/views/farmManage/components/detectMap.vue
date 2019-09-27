<template>
  <div class="sub-map">
    <div id="detectMap" class="map">
      <!-- <div id="editMap"/> -->
      <div id="popup" class="ol-popup">
        <div class="pophead" style="width:100%;height: 20px;">
          <div id="popup-title" style="font:bold 15px sans-serif;align:left;position: absolute;top: 5px;left: 8px;color: #000000">元素信息</div>
          <a id="popup-closer" href="#" class="ol-popup-closer" style="color:#8e908c;" @click="overlayClose()"/>
        </div>
        <div id="popup-content" style="padding: 10px"/>
      </div>
    </div>
    <div id="topNav" class="layer-btn">
      <el-button size="mini" style="" @click="addManually();">退出</el-button>
    </div>
    <div v-show="isShow" class="mapSlider">
      <!-- <vue-slide-bar v-show="isShow"
        v-model="sliderWithLabel.value"
        :data="sliderWithLabel.data"
        :range="sliderWithLabel.range"
        @callbackRange="callbackRange"/> -->
      <ve-line ref="mychart" :data="chartData" :settings="chartSettings" :events="chartEvents" height="300px"/>
    </div>
    <div class="map-right">
      <el-tree
        ref="tree"
        :data="dataRater"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        @check-change="changeLayer"
      />
      <!-- <div class="tcPanel"> -->
      <!-- <div class="search">
          <el-input v-model="location" size="mini" class="s-input" placeholder="请输入一个地址"/>
        </div> -->
      <!-- <ul class="filters">
          <li v-for="(val, key) in fieldList" :key="key">
            <a
              @click="selectByAttribute(val.url)"
            >{{ val.name }}</a>
          </li>
        </ul>
      </div>
    </div> -->
      <!-- <div class="footer" style="">
      <el-row :gutter="20" class="row">
        <el-col :span="12">Select a shape or draw your own</el-col>
        <el-col :span="8">
          <el-button type="primary" @click="drawPolygon">画图形</el-button>
        </el-col>
      </el-row>
    </div> -->
      <a-drawer :title="title" :width="720" :visible="farmShow" :mask-closable="closed" :mask="mask" @close="onSubClose">
        <!-- <el-dialog :title="title" :visible.sync="farmShow" width="60%" top="5vh" @opened="opened"> -->
        <Farm ref="farm" :form="form" :geo="geoStr" @fieldEnd="fieldSubEnd"/>
      <!-- </el-dialog> -->
      </a-drawer>
    </div>
</div></template>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import { VectorTile } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import 'ol/ol.css';
// import BMap from 'BMap'
// import MVT from 'ol/format/MVT'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { VectorTile as VectorSourceTile } from 'ol/source';// TileArcGISRest,TileWMS,
import { defaults } from 'ol/control';
import { Draw, Modify, Snap, Select } from 'ol/interaction.js'; //
import MousePosition from 'ol/control/MousePosition';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js'; //
import GeoJSON from 'ol/format/GeoJSON.js';
import { MVT } from 'ol/format';

import { getToken } from '@/utils/auth';
import base from '@/api/base.js';
import { getMapRect } from '@/api/farmmap.js';// getMapLayers,
import { createStringXY } from 'ol/coordinate.js';
import { createXYZ } from 'ol/tilegrid.js';

import Farm from './farm';
import { map } from '@/components/mixins/map.js';
// import TileGrid from 'ol/tilegrid/TileGrid';
import { getArea } from 'ol/sphere.js';
import { Polygon, LineString } from 'ol/geom.js';
import { unByKey } from 'ol/Observable.js';
import Overlay from 'ol/Overlay.js';
import VueSlideBar from 'vue-slide-bar';
export default {
  components: {
    Farm,
    VueSlideBar
  },
  mixins: [map],
  data() {
    this.chartSettings = {
        xAxisType: 'time'
      };
    this.chartEvents = {
        click: function(e) {
          // self.name = e.name;
          console.log(e);
        }
      };
    return {
      chartData: {
          columns: ['日期', '房子', '地块'],
          rows: [
            { '日期': '2012', '房子': 20, '地块': 4, '下单率': 0.32 },
            { '日期': '2015', '房子': 15, '地块': 7, '下单率': 0.26 },
            { '日期': '2016', '房子': 24, '地块': 6, '下单率': 0.76 },
            { '日期': '2017', '房子': 11, '地块': 2, '下单率': 0.49 },
            { '日期': '2018', '房子': 43, '地块': 3, '下单率': 0.323 },
            { '日期': '2019', '房子': 35, '地块': 2, '下单率': 0.78 }
          ]
        },
      fdialogVisible: false,
      closed: false,
      mask: false,
      map: {},
      vector: {},
      draw: {},
      isShow: false,
      overlay: {},
      selection: {},
      titleLayer: {},
      layerdata: [],
      farmShow: false,
      yearValue: '2019',
      form: {
        fieldSection: [{}]
      },
      fieldList: [{'name': '种植作物', 'url': ''}],
      dataRater: [{
        id: 1,
        label: '识别信息',
        children: [{
          id: 1.1,
          label: '房子',
          layername: 'farm:140929_DLTB_2018'
          // children: [{
          //   id: 9,
          //   label: '三级 1-1-1'
          // }, {
          //   id: 10,
          //   label: '三级 1-1-2'
          // }]
        }, {
          id: 1.2,
          label: '地块',
          layername: 'farm:140929_DLTB_2018'
        }, {
          id: 1.3,
          label: '植被',
          layername: 'farm:140929_DLTB_2018'
        }, {
          id: 1.4,
          label: '河流',
          layername: 'farm:140929_DLTB_2018'
        }
        ]
      }, {
        id: 2,
        label: '基本图层',
        children: [{
          id: 2.1,
          label: '地块',
          layername: 'farm:140929_2018_dkfb'
        }]
      }, {
        id: 3,
        label: 'npk分布',
        children: [
          {
            id: 3.1,
            label: '祁阳',
            layerGrade: '1',
            layername: 'farm:140727_npk_2018'
          }
        ]
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      geoStr: '',
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
      listener: null,
      sliderWithLabel: {
        // value: 45,
        data: [2014, 2016, 2017, 2018, 2019],
        range: [
          {
            label: '2014'
          },
          {
            label: '2016'
          },
          {
            label: '2017'
          },
          {
            label: '2018'
          },
          {
            label: '2019'
          }
        ],
        rangeValue: {}
      }
    };
  },
  mounted() {
    this.initHtml();
  },
  methods: {
    callbackRange(val) {
      this.sliderWithLabel.rangeValue = val;
    },
    initHtml() {
      const _this = this;
      this.map = this.initMap();
      // console.log(process.env.BASE_API + '/farmmanage/farmjson');
      // this.vector = null;
      // this.vector = new VectorLayer({
      //   source: new VectorSource({
      //     // projection: 'EPSG:3857',
      //     format: new GeoJSON({
      //       dataProjection: 'EPSG:3857'
      //     }),
      //     // url: process.env.BASE_API + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
      //     url: base.farm + '/farmmanage/farmjson?token=' + getToken() // 从文件加载边界等地理信息
      //   }),
      //   style: function(feature) {
      //     // style.getText().setText(resolution < 5000 ? feature.get('name') : ''); // 当放大到1:5000分辨率时，显示国家名字
      //     // return [style];
      //     // debugger;
      //     const selected = !!_this.selection[feature.get('fieldName')];
      //     var style = new Style({
      //       fill: new Fill({
      //         color: selected ? 'rgba(200,20,20,0.3)' : 'rgba(255, 255, 255, 0.2)'
      //       }),
      //       stroke: new Stroke({
      //         color: selected ? 'rgba(200,20,20,0.8)' : '#ffcc33',
      //         width: selected ? 2 : 1
      //       }),
      //       text: new Text({
      //         font: '12px Calibri,sans-serif',
      //         fill: new Fill({
      //           color: '#000'
      //         }),
      //         stroke: new Stroke({
      //           color: '#fff',
      //           width: 3
      //         })
      //       })
      //     });
      //     style.getText().setText(feature.get('fieldName'));
      //     return style;
      //   }
      // });
      // getMapRect().then(res => {
      //   // const data = res.data;
      //   // this.setViewLevel(data);
      // });
      // this.map.addLayer(this.vector);
      // this.titleLayer = new TileLayer({
      //   source: new TileWMS({
      //     url: 'http://localhost:8077/geoserver/rs/wms',
      //     params: {
      //       'LAYERS': 'rs:yongzhou',
      //       'TILED': true

      //     },
      //     serverType: 'geoserver'
      //   })
      // });
      // var tiled = new ol.layer.Tile({
      //     visible: false,
      //     source: new ol.source.TileWMS({
      //       url: 'http://localhost:8077/geoserver/rs/wms',
      //       params: {'FORMAT': format,
      //                'VERSION': '1.1.1',
      //                tiled: true,
      //             STYLES: '',
      //             LAYERS: 'rs:yongzhou',
      //          tilesOrigin: 12407397.928941365 + "," + 3030671.5581644364
      //       }
      //     })
      //   });
      // this.map.addLayer(this.titleLayer);
      debugger;
      var list = [];
      for (var m = 0; m < this.dataRater.length; m++) {
        for (var n = 0; n < this.dataRater[m].children.length; n++) {
          list.push(this.dataRater[m].children[n]);
        }
      }
      // var list = this.dataRater[0].children;
      for (var k = 0; k < list.length; k++) {
        var layerName = list[k]['layername'];
        var layerProjection = '3857';
        var layerG = list[k]['layerGrade'];
        // this.titleLayer = null;
        if (layerG === '1') {
          // var pointTypename = 'xcy:point';
          var pointVectorSource = new VectorSource({
              format: new GeoJSON(),
              url: function(extent) {
                  return '/geoserver/farm/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=' + layerName + '&outputFormat=application%2Fjson';
              },
              // strategy: ol.loadingstrategy.bbox
          });
          list[k]['treeVector'] = new VectorLayer({
              source: pointVectorSource,
              style: new Style({
                  image: new CircleStyle({
                      radius: 5,
                      fill: new Fill({
                          color: '#389BCD',
                          opacity: 0.5
                      })
                  })
              })
          });
        } else {
          list[k]['treeVector'] = new VectorTile({
            source: new VectorSourceTile({
              // projection: 'EPSG:3857',
              format: new MVT({
                dataProjection: 'EPSG:3857'
              }),
              // format: new
              tileGrid: createXYZ({
                maxZoom: 21
              }),
              url: '/geoserver/gwc/service/tms/1.0.0/' +
                  layerName + '@' + layerProjection + '@pbf/{z}/{x}/{-y}.pbf'
            }),
            style: function(feature) {
              const selected = !!_this.selection[feature.get('ID')];
              var style = new Style({
                fill: new Fill({
                  color: selected ? 'rgba(200,20,20,0.3)' : 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new Stroke({
                  color: selected ? 'rgba(200,20,20,0.8)' : '#ffcc33',
                  width: selected ? 2 : 1
                }),
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
              // style.getText().setText(feature.get('行政区'));
              return style;
            }
          });
        }
      }
      this.overlay = new Overlay({
        element: document.getElementById('popup'),
        autoPlan: true,
        autoPanMargin: 20,
	      positioning: 'top-center'
      });
      this.map.addOverlay(this.overlay);
      this.layerdata = list;
      // this.map.addLayer(this.titleLayer);

      this.selectTool = new Select({});
      // this.setViewLevel();
      // this.map.on('click', function(e) {
      //   _this.initCheckLayer(e);
      // });
      this.map.on('click', _this.SelectPolygon);
    },
    reloadMap() {
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
      getMapRect().then(res => {
        // const data = res.data;
        // this.setViewLevel(data);
      });
      this.map.addLayer(this.vector);
      this.map.addLayer(this.titleLayer);
    },
    initMap() {
      const center = transform([112.33, 37.36], 'EPSG:4326', 'EPSG:3857');
      var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });
      var googleMapLayer = new TileLayer({
                source: new XYZ({
                    // url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
                    url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
                })
            });
      var view = new View({
        center: center,
        projection: 'EPSG:3857',
        zoom: 15,
        maxZoom: 21,
        minZoom: 5
      });
      return new Map({
        target: 'detectMap',
        layers: [
          // this.getTianDiTuLayer('img_w')
          googleMapLayer
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
    setViewLevel(data) {
      if (data !== '' && data !== undefined) {
        var coor = data.split(',');
        var extent = [coor[0], coor[1], coor[2], coor[3]];
        // const resolution = this.map.getView().getResolutionForExtent(extent);
        // this.map.getView().setResolution(resolution);
        this.map.getView().fit(extent, {
          size: [1003, 500],
          padding: [100, 300, 300, 100]
        });
      }
    },
    changeLayer(data, checked, indeterminate) {
      // alert(data);
      debugger;
      this.layerdata.forEach((layer, index) => {
        if (layer.id === data.id) {
          if (checked) {
            this.map.addLayer(layer.treeVector);
            this.isShow = true;

            this.chartData = {
              columns: ['日期', '房子', '地块'],
              rows: [
                { '日期': '2012', '房子': 20, '地块': 4, '下单率': 0.32 },
                { '日期': '2015', '房子': 15, '地块': 7, '下单率': 0.26 },
                { '日期': '2016', '房子': 24, '地块': 6, '下单率': 0.76 },
                { '日期': '2017', '房子': 11, '地块': 33, '下单率': 0.49 },
                { '日期': '2018', '房子': 43, '地块': 3, '下单率': 0.323 },
                { '日期': '2019', '房子': 35, '地块': 2, '下单率': 0.78 }
              ]
            };
            this.$nextTick(_ => {
              this.$refs['mychart'].echarts.resize();
            });
          } else {
            this.map.removeLayer(layer.treeVector);
            this.isShow = false;
          }
        }
      });
    },
    SelectPolygon(event) {
      this.overlay.setPosition(undefined);
      const pixel = this.map.getEventPixel(event.originalEvent);
      const feature = this.map.forEachFeatureAtPixel(pixel, function(
        feature,
        layer
      ) {
        return feature;
      });
      debugger;
      // var pop_closer = document.getElementById('popup-closer');
      // var popTitle = document.getElementById('popup-title');
      var pop_content = document.getElementById('popup-content');
      if (feature !== undefined) {
        // selectStyle.getText().setText(feature.get('fieldName'));
        // popTitle.innerHTML = feature.get('');

        this.selection = {};
        this.selection[feature.get('ID')] = feature;
        var neirong = '';
        var filter = ['geometry'];

        // 放大
        // this.setViewLevel(feature.getExtent().join(','));
        if (feature.getGeometry().getType() === 'Point') {
          this.map.getView().setCenter(event.coordinate);
          for (var key in feature.getKeys()) {
          if (filter.indexOf(feature.getKeys()[key]) === -1) {
            neirong += feature.getKeys()[key] + ':' + feature.get(feature.getKeys()[key]) + '<br/>';
          }
        }
        } else {
          this.map.getView().fit(feature, {
            // size: [1803, 700],
            // constrainResolution: false,
            earest: true,
            padding: [40, 720, 100, 0]
          });
          for (var key1 in feature.getProperties()) {
            if (filter.indexOf(key1) === -1) {
              neirong += key1 + ':' + feature.get(key1) + '<br/>';
            }
        }
        }
        pop_content.innerHTML = neirong;
        // this.titleLayer.setStyle(this.titleLayer.getStyle());
        this.overlay.setPosition(event.coordinate);

        // console.log(feature.getExtent().join(','));
        // let geoStr = '';
        // const coords = feature.getFlatCoordinates();
        // for (var i = 0, ii = coords.length; i < ii; i += 2) {
        //   geoStr += coords[i] + ',' + coords[i + 1] + ';';
        // }
        // // const geoStr = .join(';');
        // // console.log(geoStr);
        // debugger;
        // var area = feature.get('mpArea');
        // // this.form.fieldArea = area * 0.0015 * 0.1647369; // 转为英亩
        // if (area === undefined) {
        //   area = getArea(feature.getGeometry());
        // }
        // const fieldArea = area * 0.0015 * 0.1647369;
        // this.$set(this.form, 'fieldArea', fieldArea);
        // this.$set(this.form, 'farmName', '');
        // this.$set(this.form, 'fieldName', '');
        // this.$set(this.form, 'fieldType', '');
        // // this.$set(this.form, 'fieldSection', []);
        // this.geoStr = geoStr.substring(0, geoStr.length - 1);
        // debugger;
        // this.titleLayer.setStyle(this.titleLayer.getStyle());
        // // feature.setStyle(selectStyle);
        // // alert(feature.get('fieldName'));
        // this.farmShow = true;
      } else {
        alert('no feature');
      }
    },
    addManually() {
      // this.fdialogVisible = false;
      // debugger;
      // this.reloadMap();
      // this.initHtml();
      const parent = this.$parent.$parent;
      parent.detectShow = false;
      parent.reloadMap();

      // debugger;
      // this.$router.push({
      //   path: '/farmManage/map'
      // });
    },
    addNext() {
      this.fdialogVisible = false;
      this.map.getOverlays().clear();
      // this.measureTooltipElement.classList.add('hidden');
      // this.map.removeOverlay(this.measureTooltip);
      // this;
      this.reloadMap();

      // this.$router.push({
      //   path: '/subMap'
      // });
    },
    drawPolygon() {
      this.farmShow = false;
      this.map.removeLayer(this.titleLayer);
      const _this = this;
      // debugger;
      this.map.un('click', _this.SelectPolygon);
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
      // this.map.on('click', _this.initCheckLayer);
      this.map.un('pointermove', _this.pointerMoveHandler);
      _this.helpTooltipElement.classList.add('hidden');
      // _this.measureTooltipElement.classList.add('hidden');
      // 绘制图形类型
      // var geoType = $("#type option:selected").val()
      // $("#dialog-confirm").dialog("open") // 打开属性信息设置对话框
      const geoType = 'Polygon';
      let geoStr = '';
      const currentFeature = evt.feature; // 当前绘制的要素

      var geo = currentFeature.getGeometry(); // 获取要素的几何信息
      this.map.getView().fit(geo, {
          // size: [1803, 700],
          // constrainResolution: false,
          // earest: true,
          padding: [40, 720, 100, 0]
        });
      var coordinates = geo.getCoordinates(); // 获取几何坐标
      var area = getArea(geo);
      const fieldArea = area * 0.0015 * 0.1647369; // 转为英亩
      this.$set(this.form, 'fieldArea', fieldArea);
      this.$set(this.form, 'farmName', '');
      this.$set(this.form, 'fieldName', '');
      this.$set(this.form, 'fieldType', '');
      // console.log(area);
      // 将几何坐标拼接为字符串
      if (geoType === 'Polygon') {
        geoStr = coordinates[0].join(';');
      } else {
        geoStr = coordinates.join(';');
      }
      this.geoStr = geoStr;
      // console.log(geoStr);
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
    onSubClose() {
      this.farmShow = false;
      this.map.getOverlays().clear();
      // if (this.measureTooltipElement) {
      //   this.measureTooltipElement.parentNode.removeChild(
      //     this.measureTooltipElement
      //   );
      // }
      this.reloadMap();
    },
    overlayClose() {
      this.overlay.setPosition(undefined);
    }
  }
};
</script>

<style lang="scss" scoped>
  .sub-map {
    .map {
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      top: 0px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
    }
    .footer {
      position: absolute;
      height: 100px;
      line-height: 100px;
      background-color: #ffffff;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      margin: 0;
      .row {
        margin: 0 !important;
      }
    }
    .map-right{
      width: 300px;
      position: absolute;
        top: 0;
        right: 0;
        // width: 0;
        bottom: 0;
        background-color: #ffffff;
        overflow: auto;
    }
    .layer-btn {
      position: absolute;
      top: 20px;
      left: 80px;
      .el-button + .el-button {
        margin-left: 0;
      }
    }
    .mapSlider{
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 300px;
      // width: 100%;
      background-color: wheat;
      // height: 200px;
    }
  }
  /*设置弹出框样式*/
     .ol-popup {
        position: absolute;
        background-color: #eeeeee;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
    }
    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    .ol-popup:after {
        border-top-color: #eeeeee;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }
    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
    }
    .ol-popup-closer:after {
        content: "✖";
    }
</style>
