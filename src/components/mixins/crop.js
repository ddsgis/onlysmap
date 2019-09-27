import {
  getCrops
} from '@/api/farmmap.js';
export const crop = {
  data() {
    return {
      restaurants: [],
    };
  },
  mounted() {
    // palnting
    this.loadAll();
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
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
    async loadAll() {
      await getCrops().then(res => {
        const {
          list
        } = res.data;
        list.map(response => {
          response.value = response.name;
          return response;
        });
        this.restaurants = list;
      });
    },
  },
};
