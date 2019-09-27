import {
  FarmManageSave,
  getCrops,
  getVariety,
  getMethod,
  saveCrop
} from '@/api/farmmap.js';

import { saveScout, saveTreat } from '@/api/farmManage.js';
export const map = {
  data() {
    return {
      title: '',
      icon: 'el-icon-arrow-left',
      isTCShow: false,
      tcShow: false,
      width: '256px',
      tcWidth: '0',
      mapRight: '',
      isXMorTC: '',
      left: 0,
      fieldShow: false, // 侧边栏信息显示
      cropShow: false, // Select Crop弹框
      crop: {
        harvestUnit: 'MT/ha',
        plantTime: new Date()
      },
      cropData: {},
      cropImg: require('@/assets/img/no-image.png'),
      restaurants: [],
      variety: [],
      methods: [],
      disabled: true,
      soilDetail: {
        findings: [{}],
        records: [
          {
            volumeUnit: '升'
          }
        ]
      },
      isMap: true,
      soilShow: false, // add soil test 显示与否
      soilTitle: '', // add soil test标题
      waterShow: false, // add water test 显示与否
      waterTitle: '', // add water test标题
      orgShow: false, // add org test 显示与否
      orgTitle: '', // add org test标题
      planShow: false, // add plan test 显示与否
      planTitle: '', // add plan test标题
      cropInfoShow: false, // 选择农作物保存后显示农作物信息
      scoutTitle: '',
      scoutShow: false, //
      treatTitle: '',
      treatShow: false, //
      endSeason: false, // 季节结束是否显示
      harvestTitle: '',
      steps: '',
      stepShow: '',
      currentActive: '',
      planData: '',
      farmList: '',
      fieldList: ''
    };
  },
  created() {
    this.cropData = this.crop;
  },
  mounted() {
    // palnting
    this.loadAll();
  },
  methods: {
    fieldEnd(form) {
      // 关闭弹出模态框，右侧filed信息框显示
      this.farmShow = false;
      this.fieldShow = true;
      this.selection = [];
      this.farmInfo = form;
      FarmManageSave(form).then(res => {
        const id = res.data;
        this.farmInfo.id = id;
      });
      const _this = this;
      this.map.on('click', _this.initCheckLayer);
    },
    fieldSubEnd(form) {
      // 关闭弹出模态框，右侧filed信息框显示
      this.farmShow = false;
      this.fdialogVisible = true;
      this.selection = [];
      this.farmInfo = form;
      FarmManageSave(form).then(res => {
        const id = res.data;
        this.farmInfo.id = id;
      });
      // const _this = this;
      // this.map.on('click', _this.initCheckLayer);
    },
    fieldClose() {
      // 关闭右侧filed显示框
      this.fieldShow = false;
      const _this = this;
      this.map.on('click', _this.initCheckLayer);
    },
    selectCrop() {
      this.cropShow = true;
      this.title = '农田种植';
      // this.crop.plantTime = new Date();
      this.$set(this.crop, 'plantTime', new Date());
      this.$set(this.crop, 'cropTypeId', '');
      this.$set(this.crop, 'plantVarietyId', '');
      this.$set(this.crop, 'estimateYield', '');
      this.$set(this.crop, 'plantStandard', '');
      this.cropImg = '';
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    onClose() {
      this.farmShow = false;
    },
    async loadAll() {
      await getCrops().then(res => {
        const { list } = res.data;
        list.map(response => {
          response.value = response.name;
          return response;
        });
        this.restaurants = list;
      });
    },
    handleSelect(item) {
      this.disabled = false;
      const info = this.restaurants.filter(res => {
        return res.id === item;
      });
      this.cropImg = info[0].imgPath;
      getVariety(item).then(res => {
        if (res.code === 20000) {
          const { list } = res.data;
          this.variety = list;
        }
      });
    },
    changeM(id) {
      const param = {
        seedId: id,
        fieldId: this.farmInfo.fieldId
      };
      getMethod(param).then(res => {
        if (res.code === 20000) {
          const { list } = res.data;
          this.crop.plantStandard = list[0];
        }
      });
    },
    addSoilTest() {
      this.soilShow = true;
      this.soilTitle = '新增Soil Test';
    },
    // saveSoil() {
    //   this.$refs['soilBody'].$refs['form'].validate(valid => {
    //     if (valid) {
    //       console.log(valid);
    //       this.soilShow = false;
    //       this.$router.push({
    //         path: '/farmExperiment/soilAnalysis'
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // ,
    save_soil() {
      const _this = this;
      this.$refs['soilBody'].$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true;
          const linkVal = this.$store.getters.fflist.filter(res => {
            return res.name === _this.soilDetail.farmName;
          });
          const result = linkVal[0].child.filter(res => {
            return res.name === _this.soilDetail.fieldName;
          });
          _this.soilDetail.fieldId = result[0].id;
          // await saveSoil(_this.soilDetail).then(res => {
          //   if (res.code === 20000) {
          //     this.$message({
          //       message: '保存成功！',
          //       type: 'success'
          //     });
          //     this.soilShow = false;
          //     this.$router.push({
          //       path: '/farmExperiment/soilAnalysis'
          //     });
          //   } else {
          //     this.$message({
          //       message: '保存失败！',
          //       type: 'error'
          //     });
            // }
          // });
        } else {
          return false;
        }
      });
    },
    addWaterTest() {
      this.waterShow = true;
      this.waterTitle = '新增Water Test';
      this.isMap = true;
    },
    save_water() {
      const _this = this;
      this.$refs['warterBody'].$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true;
          const linkVal = this.$store.getters.fflist.filter(res => {
            return res.name === _this.soilDetail.farmName;
          });
          const result = linkVal[0].child.filter(res => {
            return res.name === _this.soilDetail.fieldName;
          });
          _this.soilDetail.fieldId = result[0].id;
          // await saveWater(_this.soilDetail).then(res => {
          //   if (res.code === 20000) {
          //     this.$message({
          //       message: '保存成功！',
          //       type: 'success'
          //     });
          //     this.waterShow = false;
          //     this.$router.push({
          //       path: '/farmExperiment/waterAnalysis'
          //     });
          //   } else {
          //     this.$message({
          //       message: '保存失败！',
          //       type: 'error'
          //     });
          //   }
          // });
        } else {
          return false;
        }
      });
    },
    addOrgTest() {
      this.orgShow = true;
      this.orgTitle = '新增org Test';
      this.isMap = true;
    },
    save_org() {
      const _this = this;
      this.$refs['orgBody'].$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true;
          const linkVal = this.$store.getters.fflist.filter(res => {
            return res.name === _this.soilDetail.farmName;
          });
          const result = linkVal[0].child.filter(res => {
            return res.name === _this.soilDetail.fieldName;
          });
          _this.soilDetail.fieldId = result[0].id;
          // await saveOrg(_this.soilDetail).then(res => {
          //   if (res.code === 20000) {
          //     this.$message({
          //       message: '保存成功！',
          //       type: 'success'
          //     });
          //     this.orgShow = false;
          //     this.$router.push({
          //       path: '/farmExperiment/orgAnalysis'
          //     });
          //   } else {
          //     this.$message({
          //       message: '保存失败！',
          //       type: 'error'
          //     });
          //   }
          // });
        } else {
          return false;
        }
      });
    },
    addScoutTest() {
      this.scoutShow = true;
      this.scoutTitle = '新增检测列表';
    },
    save_scout() {
      const _this = this;
      this.$refs['scoutBody'].$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true;
          const linkVal = this.$store.getters.fflist.filter(res => {
            return res.name === _this.soilDetail.farmName;
          });
          const result = linkVal[0].child.filter(res => {
            return res.name === _this.soilDetail.fieldName;
          });
          _this.soilDetail.fieldId = result[0].id;
          await saveScout(_this.soilDetail).then(res => {
            if (res.code === 20000) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.scoutShow = false;
              this.$router.push({
                path: '/farmManage/scoutList'
              });
            } else {
              this.$message({
                message: '保存失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    addTreatTest() {
      this.treatShow = true;
      this.treatTitle = '新增处置清单';
    },
    save_treat() {
      const _this = this;
      this.$refs['treatBody'].$refs['form'].validate(async valid => {
        if (valid) {
          this.loading = true;
          const linkVal = this.$store.getters.fflist.filter(res => {
            return res.name === _this.soilDetail.farmName;
          });
          const result = linkVal[0].child.filter(res => {
            return res.name === _this.soilDetail.fieldName;
          });
          _this.soilDetail.fieldId = result[0].id;
          await saveTreat(_this.soilDetail).then(res => {
            if (res.code === 20000) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.treatShow = false;
              this.$router.push({
                path: '/farmManage/treatList'
              });
            } else {
              this.$message({
                message: '保存失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // isOrgDialog() {
    //   this.orgShow = false;
    //   this.$router.push({
    //     path: '/farmExperiment/orgAnalysis'
    //   });
    // },
    addPlanTest() {
      this.planShow = true;
      this.planTitle = '新增';
      this.isMap = true;
      this.steps = ['总体详情', '作物选择', '施肥计划'];
      this.planData = {};
      this.stepShow = {
        generalShow: true, // general表单显示与否,
        cropShow: false, // crop表单显示与否
        scheduleShow: false, // schedule表单是否显示
        soilShow: false, // soil表单是否显示
        baseShow: false, // base表单是否显示
        waterShow: false, // water表单是否显示
        tissueShow: false, // tissue表单是否显示
        adjustedShow: false, // adjusted表单是否显示
        fertigationShow: false, // fertigation表单是否显示
        blendShow: false // blend表单是否显示
      };
      this.currentActive = 0;
    },
    isPlanDialog() {
      this.planShow = false;
      this.$router.push({
        path: '/muckManage/plan'
      });
    },
    getCropInfo() {
      const _this = this;
      const param = {
        seedId: '',
        fieldId: _this.farmInfo.fieldId,
        harvest: '1'
      };
      getMethod(param).then(res => {
        if (res.code === 20000) {
          const { list } = res.data;
          if (list.length > 0) {
            _this.crop = list[0];
            _this.cropInfoShow = true;
          } else {
            _this.crop = _this.cropData;
            _this.cropInfoShow = false;
          }
          // this.crop.plantStandard = list[0];
        } else {
          _this.cropInfoShow = false;
        }
      });
    },
    saveCrop() {
      this.cropShow = false;
      this.crop.fieldId = this.farmInfo.fieldId;
      this.crop.statue = 1;
      const data = this.crop;
      // debugger;
      this.cropInfoShow = true;
      const _this = this;
      saveCrop(data).then(res => {
        if (res.code === 20000) {
          // this.cropInfoShow = true;
          _this.getCropInfo();
        }
      });
    },
    endSeasons() {
      this.endSeason = true;
      this.harvestTitle = '农田丰收';
      debugger;
      this.$set(this.crop, 'harvestDate', new Date());
      this.$set(this.crop, 'actualYield', '');
    },
    saveSeason() {
      this.endSeason = false;
      this.crop.fieldId = this.farmInfo.fieldId;
      this.crop.statue = 2;
      const data = this.crop;
      // debugger;
      this.cropInfoShow = false;
      const _this = this;
      saveCrop(data).then(res => {
        if (res.code === 20000) {
          _this.cropInfoShow = false;
          _this.crop = _this.cropData;
        }
      });
    },
    leftOrRight() {
      if (!this.isTCShow) {
        this.isTCShow = true;
        this.tcShow = false;
        this.left = this.width;
        this.tcWidth = this.width;
        this.mapRight = this.width;
        // this.map.setSize([sizeWidth, size[1]]);
        this.$nextTick(res => {
          this.map.updateSize();
        });
      } else {
        this.close();
      }
    },
    leftTC() {
      if (!this.tcShow) {
        this.tcShow = true;
        this.isTCShow = false;
        this.left = this.width;
        this.tcWidth = this.width;
        this.mapRight = this.width;
      } else {
        this.close();
      }
    },
    close() {
      this.tcShow = false;
      this.isTCShow = false;
      this.left = '0';
      this.tcWidth = '0';
      this.mapRight = '10px';
    }
  }
};
