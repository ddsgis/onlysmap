<template>
  <div class="fieldTab">
    <div class="f-form">
      <el-form :model="searchModel" size="medium" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="农场名称">
              <el-select v-model="searchModel.farmName" @change="change">
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
            <el-form-item label="地块名称">
              <el-select v-model="searchModel.fieldName">
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
            <el-button type="success" size="medium" @click="query">搜索</el-button>
            <el-button type="success" size="medium" @click="empty">清空</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="地块面积">
              <el-input v-model="searchModel.fieldArea" placeholder="请输入地块面积">
                <template slot="append">公顷</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="描述">
              <el-input v-model="searchModel.discription" placeholder="请输入描述"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="f-table">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="add">新增</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="headerStyle"
      border
      size="medium"
      style="width: 100%"
    >
      <el-table-column prop="farmName" label="农场名称" sortable/>
      <el-table-column prop="fieldName" label="地块名称" sortable>
        <template slot-scope="scope">
          <router-link
            :to="{path:'/farmManage/account/dashboard',query:{id:scope.row.Id}}"
          >{{ scope.row.fieldName }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="fieldArea" label="地块面积(ha)" sortable/>
      <el-table-column prop="discription" label="描述" sortable/>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini">设为默认</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popover :ref="'popover-' + scope.row.id" placement="top" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="pCancel(scope.row.id)">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
      <Farm :form="form"/>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveModel">保 存</el-button>
      </div>-->
    </el-dialog>
    <el-dialog :visible.sync="fdialogVisible" width="60%">
      <h2>你想要怎样去增加你的地块？</h2>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="f-desc">
            <img :src="fManuallyIcon" width="175" height="75">
            <p>在地图上选择图形，然后画你需要的</p>
          </div>
          <el-button type="primary" @click="addManually">手动增加</el-button>
        </el-col>
        <el-col :span="12">
          <div class="f-desc">
            <img :src="fShapeIcon" width="65" height="75">
            <p>通过上传shape文件，增加对地块</p>
          </div>
          <el-button type="primary" @click="addShape">上传shape文件</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Farm from './farm.vue';
import { getList, save, deleteModel } from '@/api/farmManage.js';
import { uniqueArrayObject } from '@/utils/common.js';
import { table } from '@/components/mixins/mixin.js';
// import farmVue from './farm.vue';
export default {
  components: {
    Farm
  },
  mixins: [table],
  data() {
    return {
      activeName: 'fieldList',
      form: {
        fieldSection: []
      },
      farmNameList: [],
      fdialogVisible: false,
      fManuallyIcon: require('@/assets/img/draw.png'),
      fShapeIcon: require('@/assets/img/shape.png')
    };
  },
  mounted() {
    this.initFFlist();
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        sortBy: '',
        descending: '',
        filter: JSON.stringify(this.searchModel),
        type: 'field'
      };
      getList(params).then(res => {
        const list = res.data.list;
        this.tableData = list;
        this.farmNameList = uniqueArrayObject(list, 'farmName');
        this.total = res.data.count;
        this.loading = false;
      });
    },
    query() {
      this.initData();
    },
    empty() {
      this.searchModel = {};
    },
    add() {
      this.title = '新增';
      this.fdialogVisible = true;
    },
    addManually() {
      this.$router.push({
        path: '/farmManage/subMap'
      });
    },
    addShape() {
      this.$router.push({
        path: '/farmManage/shape'
      });
    },
    handleEdit(index, row) {
      this.title = '编辑';
      this.dialogVisible = true;
      this.form = row;
      this.form.fieldSection = [{}];
    },
    handleDelete(index, row) {
      deleteModel(row.Id).then(res => {
        debugger;
        if (res.code === 20000) {
          this.$message({
            message: '删除数据成功！',
            type: 'success'
          });
          this.currentPage = 1;
          this.loading = true;
          this.initData();
        } else {
          this.$message({
            message: '保存失败！',
            type: 'error'
          });
        }
      });
    },
    saveModel() {
      const model = this.form;
      model.fieldType = 'field';
      this.btnLoading = true;
      save(model).then(res => {
        if (res.code === 20000) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.initData();
          this.btnLoading = false;
          this.dialogVisible = false;
        } else {
          this.$message({
            message: '保存失败！',
            type: 'error'
          });
          this.btnLoading = false;
        }
      });
    },
    handleSizeChange(val) {
      // pageSize 改变时会触发
      this.pageSize = val;
      this.currentPage = 1;
      this.initData();
    },
    handleCurrentChange(val) {
      // currentPage 改变时会触发
      this.currentPage = val;
      this.initData();
    },
    addField() {
      // Field->新增
    }
  }
};
</script>

<style scoped lang="scss">
  .fieldTab {
    /deep/ .el-dialog__body {
      .el-col-12 {
        text-align: center;
        margin: 20px 0;
      }
      h2 {
        text-align: center;
      }
      .f-desc {
        text-align: center;
        img {
          margin: 10px 0 20px 0;
        }
      }
    }
  }
</style>
