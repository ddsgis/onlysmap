<template>
  <div class="farm">
    <el-card>
      <el-alert :closable="false" type="success" title="新增地块"/>
      <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="农场名称" prop="farmName">
              <!-- <el-select v-model="form.farmName" @change="change">
                <el-option
                  v-for="(item, index) in farmList"
                  :label="item"
                  :value="item"
                  :key="index"
                />
              </el-select>-->
              <el-autocomplete
                v-model="form.farmName"
                :fetch-suggestions="querySearch"
                class="inline-input"
                placeholder="选择/输入农场名称"
                style="width:100%;"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地块名称" prop="fieldName">
              <el-input v-model="form.fieldName" placeholder="输入地块名称"/>
              <!-- <el-select v-model="form.fieldName">
                <el-option
                  v-for="(item, index) in fieldList"
                  :label="item"
                  :value="item"
                  :key="index"
                />
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地块类型" prop="fieldType">
              <el-select v-model="form.fieldType" placeholder="选择地块类型">
                <el-option label="土壤生长" value="0"/>
                <el-option label="温室" value="1"/>
                <el-option label="无土栽培" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地块面积(英亩)" prop="fieldArea">
              <el-input v-model="form.fieldArea">
                <el-tooltip
                  slot="suffix"
                  class="item"
                  effect="dark"
                  content="你可以手动调整地块大小(地块区域)"
                  placement="top-start"
                >
                  <i class="el-input__icon el-icon-question"/>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述">
              <el-input v-model="form.discription" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert :closable="false" type="success" title="Field Section"/>
        <span v-show="fieldInfoShow">没有Field，你是否需要新增？</span>
        <template v-for="(item,index) in form.fieldSection">
          <div :key="index">
            <el-form ref="fields" :model="item" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item
                    :rules="{
                      required: true, message: '请输入名称', trigger: 'blur'
                    }"
                    prop="name"
                    label="Name"
                  >
                    <el-input v-model="item.name"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    :rules="{
                      required: true, message: '请输入描述', trigger: 'blur'
                    }"
                    prop="description"
                    label="Description"
                  >
                    <el-input v-model="item.description"/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    v-if="!index"
                    class="x-btn"
                    type="warning"
                    icon="el-icon-plus"
                    size="medium"
                    @click="addField(index)"
                  />
                  <el-button
                    v-else-if="index"
                    class="x-btn"
                    type="warning"
                    icon="el-icon-minus"
                    size="medium"
                    @click="removeField(index)"
                  />
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
      </el-form>
      <el-button type="success" @click="save">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { farmField } from '@/components/mixins/farmField.js';
export default {
  mixins: [farmField],
  props: {
    geo: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      restaurants: [], // Farm点击提示值
      fieldInfoShow: true, // field是否新增提示
      rules: {
        // 验证规则
        farmName: [
          {
            required: true,
            message: '请输入农场名称',
            trigger: 'blur'
          }
        ],
        fieldName: [
          {
            required: true,
            message: '请输入地块名称',
            trigger: 'blur'
          }
        ],
        fieldType: [
          {
            required: true,
            message: '请选择地块类型',
            trigger: 'blur'
          }
        ],
        fieldArea: [
          {
            required: true,
            message: '请输入地块面积(英亩)',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    this.initFFlist();
  },
  methods: {
    addField() {
      this.$refs.fields[0].validate(valid => {
        if (valid) {
          this.form.fieldSection.unshift({});
        }
      });
    },
    removeField(index) {
      this.form.fieldSection.splice(index, 1);
    },
    handleSelect(item) {
      // this.form.farmName = item.value;
    },
    save() {
      debugger;
      this.form['geometryInfo'] = this.geo;
      this.form.fieldSection.unshift();
      this.form.fieldSection = JSON.stringify(this.form.fieldSection);
      const _this = this;
      this.$refs['form'].validate(valid => {
        if (valid) {
          _this.$emit('fieldEnd', _this.form);
        } else {
          return false;
        }
      });
    },
    calculateArea(s) {
      // debugger;
      var s1 = [];
      var pointArr = [];
      s1 = s.split(';');
      for (var i = 0; i < s1.length; i++) {
        var ss = s1[i];
        var temp = ss.split(',');
        var point = [];
        point.push(Number(temp[0]), Number(temp[1]));
        pointArr.push(point);
      }
      const stt = this.PlanarPolygonAreaMeters2(pointArr);
      console.log(stt);
      return stt;
    },
    PlanarPolygonAreaMeters2(points) {
      var earthRadiusMeters = 6371000.0;
      var metersPerDegree = (2.0 * Math.PI * earthRadiusMeters) / 360.0;
      var radiansPerDegree = Math.PI / 180.0;
      var a = 0;
      for (var i = 0; i < points.length; ++i) {
        var j = (i + 1) % points.length;
        var xi =
          points[i][0] *
          metersPerDegree *
          Math.cos(points[i][1] * radiansPerDegree);
        var yi = points[i][1] * metersPerDegree;
        var xj =
          points[j][0] *
          metersPerDegree *
          Math.cos(points[j][1] * radiansPerDegree);
        var yj = points[j][1] * metersPerDegree;
        a += xi * yj - xj * yi;
      }
      return Math.abs(a / 2);
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
    }
  }
};
</script>

<style lang="scss" scoped>
  .farm {
    .x-btn {
      margin-bottom: 20px;
      margin-left: 0;
    }

input::-webkit-input-placeholder{ /*WebKit browsers*/
  color: red;
}

input::-moz-input-placeholder{ /*Mozilla Firefox*/
  color: red;
}

input::-ms-input-placeholder{ /*Internet Explorer*/
  color: red;
}
  }

</style>
