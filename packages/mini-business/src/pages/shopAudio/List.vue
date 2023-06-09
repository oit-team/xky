<script>
import { addOrModifyShopAudioInfo, getShopAudioList } from '@/api/shopAudio'
export default {
  components: {
  },
  data() {
    return {
      show: false,
      showEmpty: true,
      shopAudioList: [],
      textContent: 123,
      currentItem: {},
    }
  },
  async onShow() {
    if (this.logged) {
      await this.$store.state.userPromise
      this.textContent = ''
      this.getData()
    }
  },
  computed: {
    logged() {
      return this.$store.getters.logged
    },
  },
  methods: {
    async getData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      const res = await this.$loading(getShopAudioList()).finally(() => this.$toast.clear())
      this.shopAudioList = res.body.resultList
      this.showEmpty = this.shopAudioList.length <= 0
    },

    updateAudioContent(item) {
      this.show = true
      this.currentItem = item
      this.textContent = item.textContent
    },

    async addOrModifyShopAudioInfo() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      await this.addOrModifyShopAudioInfo({
        shopAudioId: this.currentItem.shopAudioId || '',
        textContent: this.textContent,
        textType: this.currentItem.textType,
      }).finally(() => this.$toast.clear())
      this.$toast.success('编辑成功')
    },

    onClose() {
      this.show = false
    },

    updateCancel() {
      this.show = false
      this.textContent = ''
    },

    async updateConfirm() {
      await this.addOrModifyShopAudioInfo()
      this.show = false
      this.textContent = ''
      await this.getData()
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <scroll-view
      class="w-full"
      style="{ height: 100% }"
      scroll-y="true"
    >
      <view v-if="!showEmpty" class="px-2 mt-2">
        <view v-for="(item, index) in shopAudioList" :key="index" class="p-2 bg-white rounded-md flex items-center mb-2" @click="updateAudioContent(item)">
          <view class="flex flex-col text-sm">
            <view class="text-base font-bold">
              {{ item.remark }}
            </view>
            <view class="text-gray-500">
              {{ item.textContent || '暂无' }}
            </view>
          </view>
        </view>
        <view v-if="serviceOrderInfoList.length > 10" class="text-xs text-gray-500 pb-2 flex justify-center">
          没有更多了~
        </view>
      </view>
      <van-empty v-else description="暂无数据" />
    </scroll-view>
    <van-popup
      position="bottom"
      round
      class="p-2"
      custom-style="height: 50%;"
      :show="show"
      @close="onClose"
    >
      <van-field
        :value="textContent"
        type="textarea"
        placeholder="请输入文本内容"
        :autosize="{ minHeight: 200 }"
        :maxlength="30"
        @change="textContent = $event.detail"
      />
      <view class="flex justify-end text-gray-500 text-xs mr-4">
        *最多30字
      </view>
      <view class="flex mb-8 items-center">
        <van-button
          plain
          class="ml-20"
          size="small"
          round
          type="default"
          @click="updateCancel"
        >
          取消
        </van-button>
        <van-button size="small" round type="info" @click="updateConfirm()">
          保存
        </van-button>
      </view>
    </van-popup>
  </container>
</template>

<style lang="scss" scoped>
</style>
