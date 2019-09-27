import { getFarmField } from '@/api/farmManage.js';

export const table = {
  data() {
    return {
      searchShow: false, // 搜索表单显示与否
      searchModel: {}, // 搜索表单对象
      loading: true, // 表单加载动画
      tableData: [], // 表单数据
      headerStyle: {
        backgroundColor: '#f5f7fa'
      }, // table表头颜色设置
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条目个数
      total: 0, // 数据总数
      pageSizes: [10, 20, 30], // 每页显示个数选择器的选项设置
      dialogVisible: false, // 模态框显示
      title: '', // 模态框标题
      fullscreen: true, // 模态框是否全屏显示
      btnLoading: false, // 保存按钮加载
      farmList: [], // 农场列表
      fieldList: []
    };
  },
  methods: {
    query() {
      this.initData();
    },
    empty() {
      this.searchModel = {};
    },
    search() {
      this.searchShow = !this.searchShow;
    },
    add() {
      this.dialogVisible = true;
      this.title = '新增';
    },
    pCancel(id) {
      this.$refs[`popover-` + id].doClose();
    },
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
    initFFlist() {
      this.farmList = this.$store.getters.fflist.map(res => {
        return res.name;
      });
      if (this.farmList.length === 0) {
        this.getFFList();
      }
      this.fList = [];
    },
    getFFList() {
      getFarmField()
        .then(result => {
          if (result.status === 20000) {
            const list = result.data;
            this.$store.dispatch('getFFList', list);
            this.farmList = this.$store.getters.fflist.map(res => {
              return res.name;
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    change(item) {
      const linkVal = this.$store.getters.fflist.filter(res => {
        return res.name === item;
      });
      this.fieldList = linkVal[0].child.map(res => {
        return res.name;
      });
      this.$set(this.searchModel, 'fieldName', '');
    },
    testName() {
      this.detail.testName = `${this.detail.farmName},${this.detail.fieldName}`;
    }
  }
};
