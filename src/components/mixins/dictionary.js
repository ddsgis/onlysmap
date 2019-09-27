import {
  getPestType
} from '@/api/datadic.js';

export const dataDict = {
  data() {
    return {
      pestType: [],
    };
  },
  mounted() {
    // palnting
    this.loadDataDic();
  },
  methods: {
    querySearch(queryString, cb) {
      var pestType = this.pestType;
      var results = queryString ? pestType.filter(this.createFilter(queryString)) : pestType;
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
    },
    async loadDataDic() {
      await getPestType().then(res => {
        const list = res.data;
        list.map(response => {
          response.value = response.name;
          return response;
        });
        this.pestType = list;
      });
    },
  },
};
