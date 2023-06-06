<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  methods: {
    async getProducts(params) {
      const res = await this.$post('/goods/product/getProductAll', params)
      if (params.pageNum === 1)
        this.list = res.body.resultList
      else
        this.list = [...this.list, ...res.body.resultList]
      this.$refs.list.finished(res.body.count <= this.list.length)
    },
  },
}
</script>

<template>
  <container classes="bg-gray-100 h-screen overflow-hidden" flex>
    <div class="flex-1 overflow-hidden">
      <vc-list ref="list" :load="getProducts" :refresh="getProducts">
        <div class="grid grid-cols-2 gap-2 p-2">
          <div v-for="item of list" :key="item.productId" class="bg-white rounded-lg overflow-hidden">
            <div class="aspect-4/3 flex">
              <image :src="item.productUrl" class="h-full w-full" mode="aspectFit" />
            </div>
            <div class="line-clamp-2 text-sm p-2">
              {{ item.productName }}
            </div>
          </div>
        </div>
      </vc-list>
    </div>
  </container>
</template>
