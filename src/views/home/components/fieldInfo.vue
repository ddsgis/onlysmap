<template>
  <div>
    <div id="jbxx" class="header">
      <i class="el-icon-document"/>基本信息
    </div>
    <div class="content">
      <el-row>
        <el-col :span="6">
          <span class="title">所属农场</span>
        </el-col>
        <el-col :span="6">
          <span class="title">{{ baseInfo.farmName }}</span>
        </el-col>
        <el-col :span="4">
          <span class="title">地块名称</span>
        </el-col>
        <el-col :span="8">
          <span class="title">{{ baseInfo.fieldName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">地块类型</span>
        </el-col>
        <el-col :span="6">
          <span class="title">{{ baseInfo.fieldType }}</span>
        </el-col>
        <el-col :span="4">
          <span class="title">地块面积</span>
        </el-col>
        <el-col :span="8">
          <span class="title">{{ baseInfo.fieldArea }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    baseInfo: {
      type: Object,
      default: null
    }
  },
  created() {
    console.log(this.baseInfo);
  }
};
</script>

<style scoped>
</style>
