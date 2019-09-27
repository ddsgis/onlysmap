<template>
  <div class="scout">
    <el-card>
      <el-alert :closable="false" type="success" title="普通信息:"/>
      <el-form ref="form" :model="detail" size="medium">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              :rules="{required: true, message: '农场名称不能为空', trigger: 'blur'}"
              label="农场名称"
              prop="farmName"
            >
              <el-select :disabled="farmDis" v-model="detail.farmName" placeholder="Select farm" @change="change">
                <el-option
                  v-for="(item, index) in farmList"
                  :label="item"
                  :value="item"
                  :key="index"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :rules="{required: true, message: '地块名称不能为空', trigger: 'blur'}"
              label="地块名称"
              prop="fieldName"
            >
              <el-select
                :disabled="farmDis"
                v-model="detail.fieldName"
                placeholder="Select field"
                @change="changeField"
              >
                <el-option
                  v-for="(item, index) in fieldList"
                  :label="item"
                  :value="item"
                  :key="index"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :rules="{required: true, message: '处置日期不能为空', trigger: 'blur'}"
              label="处置日期"
              prop="treatmentDate"
            >
              <el-date-picker
                v-model="detail.treatmentDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="detail.fieldName" class="find">
          <el-alert :closable="false" type="success" title="Treatments"/>
          <template v-for="(item,index) in detail.records">
            <div :key="index" style="overflow:hidden;">
              <div class="left">
                <el-form ref="left" :model="item">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item
                        :rules="{required: true, message: '部分不能为空', trigger: 'blur'}"
                        label="部分"
                        prop="treatSection"
                      >
                        <el-select v-model="item.treatSection" :disabled="item.disabled">
                          <el-option label="entire field" value="0"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="农药">
                        <el-input v-model="item.pesticide" :disabled="item.disabled"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="农作物">
                        <el-select v-model="item.cropTypeId" :disabled="item.disabled" filterable>
                          <el-option
                            v-for="item1 in restaurants"
                            :key="item1.id"
                            :label="item1.value"
                            :value="item1.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        :rules="{required: true, message: '浓度不能为空', trigger: 'blur'}"
                        prop="concentration"
                        label="浓度"
                      >
                        <el-input v-model="item.concentration" :disabled="item.disabled">
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        :rules="{required: true, message: '农药类型不能为空', trigger: 'blur'}"
                        prop="pesticideType"
                        label="农药类型"
                      >
                        <el-select v-model="item.pesticideType" :disabled="item.disabled">
                          <el-option
                            v-for="item1 in pestType"
                            :key="item1.id"
                            :label="item1.name"
                            :value="item1.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :rules="{required: true, message: '体积不能为空', trigger: 'blur'}"
                        prop="volume"
                        label="体积"
                      >
                        <el-input v-model="item.volume" :disabled="item.disabled">
                          <template slot="append">{{ item.volumeUnit }}</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-select v-model="item.volumeUnit" :disabled="item.disabled" class="s2">
                        <el-option label="升" value="升"/>
                        <el-option label="加仑" value="加仑"/>
                      </el-select>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="right">
                <el-row :gutter="20">
                  <el-col :span="18" :offset="2">
                    <el-form-item label="备注">
                      <el-input
                        :rows="11"
                        v-model="item.remark"
                        :disabled="item.disabled"
                        type="textarea"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      v-if="!index"
                      class="add"
                      type="primary"
                      icon="el-icon-plus"
                      circle
                      size="mini"
                      @click="addFinds"
                    />
                    <el-button
                      v-else-if="index"
                      class="add"
                      type="primary"
                      icon="el-icon-minus"
                      circle
                      size="mini"
                      @click="removeFinds(index)"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
          </template>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { table } from '@/components/mixins/mixin.js';
import { crop } from '@/components/mixins/crop.js';
import { dataDict } from '@/components/mixins/dictionary.js';

export default {
  mixins: [table, crop, dataDict],
  props: {
    detail: {
      type: Object,
      default: function() {
        return {
          records: [
            {
              volumeUnit: '升'
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      farmList: [], // 农场列表
      fieldList: [],
      treatShow: false,
      farmDis: false
    };
  },
  mounted() {
    if (this.detail.farmName !== '' && this.detail.farmName !== undefined) {
      this.farmDis = true;
    }
    this.initFFlist();
  },
  methods: {
    change(item) {
      const linkVal = this.$store.getters.fflist.filter(res => {
        return res.name === item;
      });
      this.fieldList = linkVal[0].child.map(res => {
        return res.name;
      });
      this.$set(this.detail, 'fieldName', '');
    },
    addFinds() {
      this.$refs.left[0].validate(async valid => {
        if (valid) {
          this.detail.records.map(res => {
            return (res.disabled = true);
          });
          this.detail.records.unshift({ volumeUnit: 'liters' });
        }
      });
    },
    removeFinds(index) {
      this.detail.records.splice(index, 1);
    },
    changeField(item) {
      if (item) {
        this.treatShow = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .scout {
    .find {
      .left {
        float: left;
        width: 70%;
      }
      .right {
        float: right;
        width: 30%;
        .add {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .s2 {
      position: absolute;
      bottom: 22px;
      width: 15%;
    }
  }
</style>
