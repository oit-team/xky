<script>
import { SELECT_TEMPLATE } from '@/utils/constant'
import { deleteAdvertsShop, getAdvertsShopAll } from '@/api/largeScreen'
import { convertImageSize } from '@/utils/helper'

export default {
  components: {},
  data() {
    return {
      formData: {
        pageSize: 20,
        pageNum: 1,
      },
      indexData: [],
      showEmpty: false,
      finished: false,
      isLoading: false,
      loading: false,
      error: false,
    }
  },
  onShow() {
    this.getData()
  },
  async onPullDownRefresh() {
    await this.getData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.formData.pageNum++
    await this.getData()
  },
  methods: {
    convertImageSize,
    async getData() {
      const res = await this.$loading(getAdvertsShopAll({
        ...this.formData,
      }))
      this.indexData = res.body.resultList
      this.showEmpty = res.body.resultList.length === 0
      this.$toast.success('加载完成')
    },
    async reload() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      const res = await getAdvertsShopAll({
        ...this.formData,
      })
      this.$toast.clear()
      this.indexData = [...this.indexData, ...res.body.result]
      if (res.body.result.length === 0)
        this.$toast('加载完毕')
    },

    onClose(event) {
      const {
        instance,
      } = event.detail
      instance.close()
    },
    toEdit(id) {
      uni.navigateTo({
        url: `/pages/template-ad/config?id=${id}`,
      })
    },
    toConfig() {
      uni.navigateTo({
        url: '/pages/template-ad/config',
      })
    },
    async deleteMould(id) {
      await this.$dialog.confirm({
        title: '提示',
        message: '是否确定删除该模板？',
      })

      await deleteAdvertsShop({
        advertsShopId: id,
      })

      await this.getData()
    },
    select(item) {
      uni.$emit(SELECT_TEMPLATE, item.advId)
      uni.navigateBack()
    },
  },
}
</script>

<template>
  <container classes="flex flex-col justify-between">
    <!--    模板列表 -->

    <view class="content w-full flex-1">
      <view v-if="showEmpty" class="w-full flex flex-col items-center">
        <van-empty
          description="暂无数据"
        />
      </view>
      <view v-else class="w-full flex-1 h-full">
        <van-swipe-cell
          v-for="item in indexData"
          :key="item.advId"
          async-close
          :right-width="130"
          @close="onClose()"
        >
          <van-cell-group>
            <view class="card-left w-full h-full flex items-center text-base bg-white py-2" @click="select(item)">
              <van-image
                width="80"
                height="80"
                fit="contain"
                :src="convertImageSize(item.resImgUrl, 's')"
                class="mx-2"
              />
              <view class="leading-loose">
                <view>
                  {{ item.describe }}
                </view>
                <view class="text-gray-500 text-sm">
                  {{ item.updateTime ? item.updateTime : item.createTime }}
                </view>
              </view>
            </view>
          </van-cell-group>
          <template #right>
            <view class="flex h-full">
              <view>
                <van-button type="primary" @click="toEdit(item.advId)">
                  编辑
                </van-button>
              </view>
              <view>
                <van-button
                  type="danger"
                  @click="deleteMould(item.advId)"
                >
                  删除
                </van-button>
              </view>
            </view>
          </template>
        </van-swipe-cell>
      </view>
    </view>

    <view class="w-full flex justify-center px-3 py-2 bg-white box-border">
      <van-button
        type="info"
        round
        block
        class="w-full h-10"
        @click="toConfig()"
      >
        去新增
      </van-button>
    </view>
  </container>
</template>

<style scoped>
.page {
  height: 100%;
  background-color: #f5f5f5;
}

.headBox {
  height: 1.4rem;
}

.content {
  background-color: #f5f5f5;
}

.ub-refresh {
  min-height: calc(100vh - 1.4rem);
}

::v-deep .van-swipe-cell__wrapper {
  height: 100% !important;
  background-color: #ffffff;
}

::v-deep .van-button {
  height: 100%;
}

::v-deep .van-swipe-cell {
  margin-bottom: 10px;
}
</style>
