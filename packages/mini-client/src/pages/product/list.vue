<script>
import { getProductAll } from '@/api/shop'
export default {
  props: {
    brandId: Number || String,
  },
  data() {
    return {
      list: [],
      searchValue: '',
    }
  },

  watch: {
    searchValue() {
      this.search()
    },
  },

  mounted() {
  },

  methods: {
    loadData({ page, next, done, fail }) {
      this.getProducts(page)
        .then(isDone => isDone ? done() : next())
        .catch(fail)
    },
    async getProducts(pageNum) {
      const res = await getProductAll({
        productName: this.searchValue,
        pageNum,
        pageSize: 20,
        brandId: this.brandId,
      })
      this.list = pageNum === 1 ? res.body.resultList : [...this.list, ...res.body.resultList]

      return res.body.count <= this.list.length
    },
    search() {
      this.$refs.list.reset().load()
    },
    toProductPage(item) {
      const routeMap = {
        clothing: '/pages/template/clothing/detail',
        catering: '/pages/template/catering/detail',
        jewellery: '/pages/template/jewelry/detail',
        education: '/pages/template/education/detail',
      }
      const path = routeMap[item.industryIdKey]
      if (!path)
        return console.warn('未匹配到商品详情页')

      uni.navigateTo({
        url: `${path}?productId=${item.productId}&brandId=${this.brandId}`,
      })
    },
  },
}
</script>

<template>
  <div classes="bg-gray-100 h-screen overflow-hidden flex">
    <div>
      <van-search
        :value="searchValue"
        placeholder="请输入搜索关键词"
        @search="searchValue = $event.detail"
        @clear="searchValue = $event.detail"
      />
    </div>
    <div class="flex-1 overflow-hidden">
      <vc-list
        ref="list"
        pull-refresh
        load-more
        :immediate="true"
        @load="loadData"
        @refresh="loadData"
      >
        <div class="py-3">
          <vc-waterfall :data="list" :columns="2" gap="12px" item-key="productId">
            <template #default="{ item }">
              <div class="bg-white rounded-lg overflow-hidden" @click="toProductPage(item)">
                <image :src="item.productUrl" class="w-full" mode="widthFix" />
                <div class="line-clamp-2 text-sm m-2">
                  {{ item.productName }}
                </div>
              </div>
            </template>
          </vc-waterfall>
        </div>
        <!-- <div class="grid grid-cols-2 gap-2 p-2">
          <div v-for="item of list" :key="item.productId" class="bg-white rounded-lg overflow-hidden">
            <div class="aspect-4/3 flex">
              <image :src="item.productUrl" class="h-full w-full" mode="aspectFit" />
            </div>
            <div class="line-clamp-2 text-sm m-2">
              {{ item.productName }}
            </div>
          </div>
        </div> -->
      </vc-list>
    </div>
  </div>
</template>
