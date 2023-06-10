export default {
  props: {
    productId: String,
    brandId: String,
  },
  data: () => ({
    data: {},
  }),
  mounted() {
    this.getDetailData()
  },
  methods: {
    getDetailData() {
      this.$post('/liveBroadcast/adverts/getProductById', {
        productId: this.productId,
        brandId: this.brandId,
      }).then((res) => {
        this.data = res.body
      })
    },
    getLabel(key, defaultValue = '') {
      return this.data?.[key]?.indexDescrip ?? defaultValue
    },
    getValue(key, defaultValue = '暂无') {
      return this.data?.[key]?.indexValue ?? defaultValue
    },
  },
}
