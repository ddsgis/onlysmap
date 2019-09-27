<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="Monitoring" name="Monitoring">
        <Monitoring/>
      </el-tab-pane>
      <el-tab-pane label="machinery">Machinery</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Monitoring from './monitoring.vue';
export default {
  components: {
    Monitoring
  },
  data() {
    return {
      activeName: 'Monitoring'
    };
  }
};
</script>

<style scoped>
</style>
