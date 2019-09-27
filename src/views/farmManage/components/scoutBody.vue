<template>
  <div class="scout">
    <el-card>
      <el-alert :closable="false" type="success" title="检测信息:"/>
      <el-form ref="form" :model="detail" size="medium">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              :rules="{required: true, message: '农场名称不能为空', trigger: 'blur'}"
              label="农场名称"
              prop="farmName"
            >
              <el-select :disabled="farmDis" v-model="detail.farmName" placeholder="请选择农场名称" @change="change">
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
              <el-select :disabled="farmDis" v-model="detail.fieldName" placeholder="请选择地块名称">
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
              :rules="{required: true, message: '监测日期不能为空', trigger: 'blur'}"
              label="监测日期"
              prop="scottTime"
            >
              <el-date-picker
                v-model="detail.scottTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="感染?" prop="infected">
              <el-select v-model="detail.infected" placeholder="是否感染">
                <el-option
                  v-for="(item,index) in isOrNo"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="detail.infected" class="find">
          <el-alert :closable="false" type="success" title="Findings"/>
          <template v-for="(item,index) in detail.findings">
            <div :key="index" style="overflow:hidden;">
              <div class="left">
                <el-form ref="left" :model="item">
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-form-item
                        :rules="{required: true, message: '部分不能为空', trigger: 'blur'}"
                        prop="scottSection"
                        label="部分"
                      >
                        <el-select v-model="item.scottSection" :disabled="item.disabled">
                          <el-option label="entire field" value="0"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="农作物">
                        <!-- <el-input v-model="item.crop"/> -->
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
                    <el-col :span="24">
                      <el-form-item label="感染">
                        <el-select v-model="item.infected" :disabled="item.disabled">
                          <el-option
                            v-for="(item,index) in isOrNo"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div v-show="item.infected" class="center">
                <el-form ref="center" :model="item">
                  <el-row :gutter="20">
                    <el-col :span="20" :offset="4">
                      <el-form-item
                        :rules="{required: true, message: '侵染类型不能为空', trigger: 'blur'}"
                        prop="infectedType"
                        label="侵染类型"
                      >
                        <el-select v-model="item.infectedType" :disabled="item.disabled" filterable>
                          <el-option
                            v-for="item1 in infectedType"
                            :key="item1.id"
                            :label="item1.value"
                            :value="item1.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20" :offset="4">
                      <el-form-item
                        :rules="{required: true, message: '感染种类不能为空', trigger: 'blur'}"
                        prop="infection"
                        label="感染种类"
                      >
                        <el-input v-model="item.infection" :disabled="item.disabled"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20" :offset="4">
                      <el-form-item
                        :rules="{required: true, message: '侵染程度不能为空', trigger: 'blur'}"
                        prop="infectionLevel"
                        label="侵染程度"
                      >
                        <el-select v-model="item.infectionLevel" :disabled="item.disabled">
                          <el-option
                            v-for="(item,index) in infectionLevel"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
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
                        v-model="item.remarks"
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
                      @click="addFinds(item)"
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
export default {
  mixins: [table, crop],
  props: {
    detail: {
      type: Object,
      default: function() {
        return {
          findings: [{}]
        };
      }
    }
  },
  data() {
    return {
      farmDis: false,
      farmList: [], // 农场列表
      fieldList: [],
      findChildShow: false,
      isOrNo: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      infectedType: [
        {
          value: '疾病',
          id: 1
        },
        {
          value: '线虫类',
          id: 2
        },
        {
          value: '害虫',
          id: 3
        },
        {
          value: '啮齿动物',
          id: 4
        },
        {
          value: '杂草',
          id: 5
        }
      ],
      infectionLevel: [
        {
          label: '低',
          value: 1
        },
        {
          label: '中',
          value: 2
        },
        {
          label: '高',
          value: 3
        }
      ]
    };
  },
  mounted() {
    // debugger;
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
      this.$set(this.detail, 'fieldName', this.fieldList[0]);
    },
    addFinds(item) {
      this.$refs.left[0].validate(async valid => {
        if (valid) {
          if (this.detail.findings[0].infected) {
            this.$refs['center'][0].validate(async validC => {
              if (validC) {
                this.detail.findings.map(res => {
                  return (res.disabled = true);
                });
                this.detail.findings.unshift({ infected: 0 });
              }
            });
          } else {
            this.detail.findings.map(res => {
              return (res.disabled = true);
            });
            this.detail.findings.unshift({ infected: 0 });
          }
        }
      });
    },
    removeFinds(index) {
      this.detail.findings.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
  .scout {
    .find {
      .left {
        float: left;
        width: 33%;
      }
      .center {
        float: left;
        width: 33%;
      }
      .right {
        float: left;
        width: 33%;
        .add {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
</style>
