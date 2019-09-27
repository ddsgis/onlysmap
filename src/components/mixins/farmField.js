import {
  getFarmField
} from '@/api/farmManage.js';

export const farmField = {
  data() {
    return {
      farmList: [], // 农场列表
      fieldList: [], // 农田列表
    };
  },
  methods: {
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
            list.map(res => {
              this.restaurants.push({
                id: res.id,
                value: res.name
              });
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
      this.$set(this.form, 'fieldName', this.fieldList[0]);
    }
  }
};
