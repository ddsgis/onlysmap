export const table = {
  data() {
    return {
      searchModel: {}, // 搜索表单对象
      tableData: [],
      loading: true, // 表单加载动画
      headerStyle: {
        backgroundColor: '#f5f7fa'
      },
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条目个数
      total: 0, // 数据总数
      pageSizes: [10, 20, 30], // 每页显示个数选择器的选项设置
    };
  },
  methods: {
    handleSizeChange(val) {
      // pageSize 改变时会触发
      this.currentPage = 1;
      this.pageSize = val;
      this.initData();
    },
    handleCurrentChange(val) {
      // currentPage 改变时会触发
      this.currentPage = val;
      this.initData();
    },
  },
};
