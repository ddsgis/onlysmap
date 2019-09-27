<template>
  <div>
    <div class="f-form">
      <el-form :model="searchModel" size="medium" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="农场名称">
              <el-input v-model="searchModel.farmName" placeholder="请输入农场名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="success" size="medium" @click="query">搜索</el-button>
            <el-button type="success" size="medium" @click="empty">清空</el-button>
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
      <el-table-column prop="fieldCount" label="地块数目" sortable/>
      <el-table-column prop="totalArea" label="总面积(ha)" sortable/>
      <el-table-column prop="description" label="说明" sortable/>
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
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form ref="ruleForm" :model="farmData" :rules="rules" label-width="110px">
        <el-form-item label="农场名称" prop="farmName">
          <el-input v-model="farmData.farmName"/>
        </el-form-item>
        <el-form-item label="地块数目">
          <el-input v-model="farmData.fieldCount" disabled/>
        </el-form-item>
        <el-form-item label="总面积(ha)">
          <el-input v-model="farmData.totalArea" disabled/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="farmData.description" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, save } from '@/api/farmManage.js';
import { table } from '@/components/mixins/mixin.js';
export default {
  mixins: [table],
  data() {
    return {
      activeName: 'fieldList',
      farmData: {
        farmName: '',
        fieldCount: 0,
        totalArea: 0
      },
      rules: {
        farmName: [
          { required: true, message: '请输入农场名称', trigger: 'blur' }
        ]
      },
      isEdit: false
    };
  },
  mounted() {
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
        type: 'farm'
      };
      getList(params).then(res => {
        const list = res.data.list;
        this.tableData = list;
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
      this.isEdit = false;
      this.farmData = {};
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      this.title = '编辑';
      this.isEdit = true;
      this.dialogVisible = true;
      this.farmData = row;
    },
    handleDelete() {},
    saveModel() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const model = this.farmData;
          model.fieldType = 'farm';
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
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
