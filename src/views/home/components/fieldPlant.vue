<template>
  <div>
    <div class="header">
      <i class="el-icon-document"/>种植记录
      <div class="pull-right">
        <!-- <el-button type="success" title="添加" icon="el-icon-plus" circle size="mini" @click="add"/> -->
      </div>
    </div>
    <div class="content">
      <el-table :data="pestList" style="width: 100%">
        <el-table-column label="种植时间">
          <template slot-scope="scope">
            <span>{{ scope.plantTime | dateformat('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pzNamee" label="种植作物"/>
        <el-table-column prop="estimateYield" label="产量"/>
        <el-table-column label="收获时间">
          <template slot-scope="scope">
            <span>{{ scope.harvestDate | dateformat('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="hightHumidity" label="最高湿度"/>
        <el-table-column prop="lowHumidity" label="最低湿度"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-search"
              circle
              size="small"
              @click="check(scope.$index, scope.row)"
            />
          </template>
        </el-table-column> -->
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
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" fullscreen="fullscreen">
      <pest-form :detail="detail" :disabled="disabled"/>
      <div slot="footer" class="dialog-footer">
        <el-button v-loading="loading" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMethod } from '@/api/farmmap.js';

// import pestForm from './pestForm';
import { table } from '@/components/mixins/mixin.js';

export default {
  components: {
    // pestForm
  },
  mixins: [table],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      title: '',
      detail: {},
      disabled: false,
      pageSizes: [5],
      pageSize: 5,
      pestList: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      const id = this.$route.query.id;
      // const cropID = this.$route.query.cropID;
      const params = {
        seedId: '',
        fieldId: id,
        harvest: ''
      };
      getMethod(params).then(result => {
        if (result.status === 20000) {
          this.total = result.data.count;
          this.pestList = result.data.list;
        }
      });
    },
    add() {
      this.dialogVisible = true;
      this.title = '病害信息';
    },
    save() {},
    check(index, row) {
      this.dialogVisible = true;
      this.title = '病害信息';
      this.detail = row;
      this.disabled = true;
    }
  }
};
</script>

<style scoped>
</style>
