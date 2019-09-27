export const analysis = {
  props: {
    detail: {
      type: Object,
      default: function() {
        return {};
      }
    },
    farmList: {
      type: Array,
      default: null
    },
    fList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      fieldList: []
    };
  },
  watch: {
    fList(val, oldVal) {
      this.fieldList = val;
    }
  },
  mounted() {
    this.fieldList = this.fList;
  },
  methods: {
    change(item) {
      const linkVal = this.$store.getters.fflist.filter(res => {
        return res.name === item;
      });
      this.fieldList = linkVal[0].child.map(res => {
        return res.name;
      });
      this.$set(this.detail, 'fieldName', '');
    },
    testName() {
      this.detail.testName = `${this.detail.farmName},${this.detail.fieldName}`;
    }
  }
};
