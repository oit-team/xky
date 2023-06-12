<script>
import { hasToken } from '@/utils/token'
import { getDictItemList } from '@/api/system'
import * as api from '@/api/goods'
import NotLogged from '@/components/business/notLogged/notLogged'

export default {
  components: {
    NotLogged,
  },
  data() {
    return {
      data: {},
      active: 0,
      industryAll: [], // 行业列表
      services: [], // 服务列表
      products: [], // 商品列表
      showEmpty: true,
      current: 0,
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  watch: {
    active() {
      this.$refs.list.reset().load()
    },
  },
  async mounted() {
    if (!hasToken())
      return

    await this.$store.state.userPromise
    this.getDictItemList()
  },
  methods: {
    loadData({ page, next, done, fail }) {
      this.getProducts(page)
        .then(isDone => isDone ? done() : next())
        .catch(fail)
    },
    async getDictItemList() {
      const res = await getDictItemList({
        dictCode: 'INDUSTRY_CATEGORY',
        code: 1,
      })
      this.industryAll = res.body.resultList
      this.industryAll.forEach((item) => {
        item.url = 'https://picsum.photos/200/200'
      })
      this.active = this.industryAll?.[0]?.id
    },
    async getProducts(pageNum = 1) {
      if (pageNum === 1)
        this.products = []
      const res = await this.$post('/goods/product/getProductAllForC', {
        pageNum,
        pageSize: 20,
        industryCategory: this.active,
      })
      this.showEmpty = res.body.count === 0
      this.products = pageNum === 1 ? res.body.resultList : [...this.products, ...res.body.resultList]

      return res.body.count <= this.products.length
    },
    change(e) {
      this.current = e.detail.current
    },
    toProductPage(item) {
      const routeMap = {
        clothing: '/pages/template/clothing/detail',
        catering: '/pages/template/catering/detail',
        jewellery: '/pages/template/jewelry/detail',
        education: '/pages/template/education/detail',
      }
      const path = routeMap[item.industryType]
      if (!path)
        return console.warn('未匹配到商品详情页')

      uni.navigateTo({
        url: `${path}?productId=${item.productId}&brandId=${item.brandId}`,
      })
    },
  },
}
</script>

<template>
  <container classes="bg-neutral-100 h-screen" flex>
    <view v-if="!logged" class="flex-1 rounded-xl w-full">
      <not-logged class="w-full h-full" @login="getDictItemList()" />
    </view>
    <view v-if="logged" class="content flex-1 box-border flex flex-col overflow-hidden pb-50px">
      <van-tabs :active="active" color="#6FA7FF" @change="active = $event.detail.name">
        <van-tab v-for="item in industryAll" :key="item.id" :title="item.name" :name="item.id" />
      </van-tabs>

      <vc-list
        ref="list"
        pull-refresh
        load-more
        :immediate="false"
        @load="loadData"
        @refresh="loadData"
      >
        <div class="p-3">
          <vc-waterfall :data="products" :columns="2" gap="12px" item-key="productId">
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
      </vc-list>
    </view>
  </container>
</template>

<style scoped>
::v-deep van-image{
  display: flex;
}
</style>
