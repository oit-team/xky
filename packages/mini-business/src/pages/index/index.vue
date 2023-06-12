<script>
import keyBy from 'lodash-es/keyBy'
import { sendCommandToDevice } from '../../api/largeScreen'
import notLogged from '../../components/business/notLogged/notLogged'
import Tabs from '../../components/tabs/tabs'
import { hasToken } from '../../utils/token'
import Config from './components/Config'
import { SELECT_TEMPLATE } from '@/utils/constant'
import {
  addAdvertsTemp,
  addAppPublishDeviceAds,
  getAdvertsShopById,
  getAppDevInfo,
  getAppDevList,
  getDevState,
  getRollbackAdverts,
} from '@/api/largeScreen'

const HAS_DRAFT = 2

export default {
  components: {
    Config,
    Tabs,
    NotLogged: notLogged,
  },
  data() {
    return {
      devIndex: 0,
      devState: {},
      devList: [],
      config: [],
      devId: null,
      hasDraft: false, // 是否显示回退按钮
      modulesTitle: '',
      goodsList: [],
      showPicker: false,
      columns: ['广告', '交互'],
      iStatusBarHeight: 0,
      topHeight: 0,
      showSwitch: false, // 左上角切换按钮
      times: {},
      // formatterStartTime: '',
      // formatterEndTime: '',
      show: false,
      // showMore: true,
    }
  },

  computed: {
    devInfo() {
      return this.devList[this.devIndex] || []
    },
    logged() {
      return this.$store.getters.logged
    },
    showMore() {
      return !this.showPicker
    },
  },
  watch: {
    devList() {
      if (this.devList.length === 0)
        return
      const index = this.devList.findIndex(item => item.devId === this.devId)
      this.devId = this.devList[index === -1 ? 0 : index].devId
    },
    devIndex() {
      this.devId = this.devList[this.devIndex].devId
    },
    devId: 'getAppDevInfo',
  },

  onLoad() {
    // this.iStatusBarHeight = uni.getMenuButtonBoundingClientRect().top
    // this.topHeight = uni.getMenuButtonBoundingClientRect().height
  },
  async onShow() {
    await this.$store.state.userPromise

    uni.setNavigationBarTitle({
      title: this.$store.state.userInfo.shopName,
    })

    this.showSwitch = hasToken()
    if (hasToken()) {
      await this.getDevState()
      await this.getAppDevList()
      this.$toast.clear()
    }
  },
  methods: {
    async getDevState(check = false) {
      check && await this.checkNotSaved()
      const res = await this.$loading(getDevState())
      this.devState = res.body
      if (res.body.resultList.length > 0)
        this.devList = res.body.resultList
      this.$toast.success('探测完成')
    },
    async getAppDevList() {
      const res = await getAppDevList()
      this.devList = res.body.resultList
    },
    async getAppDevInfo() {
      const res = await getAppDevInfo(this.devId)
      const {
        advertsRes,
        isDraft,
      } = res.body
      this.modulesTitle = ''
      this.hasDraft = isDraft === HAS_DRAFT
      this.$refs.config.swipeTo(0)
      this.setConfig(advertsRes?.rotationRules || [])
      this.setFileMap(advertsRes?.resEntityMap || {})
      this.$toast.success('加载完成')
    },
    async addAdvertsTemp() {
      await this.$refs.config.checkConfig()
      const {
        id,
        config,
      } = this.getConfig()
      await addAdvertsTemp({
        devId: this.devId,
        rotationRules: JSON.stringify(config),
        describe: '',
        resId: id,
      })
      this.hasDraft = true
      this.modulesTitle = ''

      this.saveConfigCache()

      this.$toast.success('成功')
    },
    async addAppPublishDeviceAds() {
      await this.$dialog.confirm({
        title: '提示',
        message: '确定要发布吗？',
      })
      const {
        id,
        config,
        goods,
      } = this.getConfig()
      await addAppPublishDeviceAds({
        devId: this.devId,
        describe: 'APP',
        advertsType: 0,
        defaults: '0',
        state: 0,
        advertsStyle: goods,
        rotationRules: JSON.stringify(config),
        resId: id,
        startTime: `${this.$refs.config.formatterStartTime} 00:00`,
        endTime: `${this.$refs.config.formatterEndTime} 00:00`,
      })

      this.hasDraft = false
      this.saveConfigCache()

      this.$toast.success('发布成功')
    },
    async selectTab(index) {
      await this.checkNotSaved()
      this.devIndex = index
    },
    async getRollbackAdverts() {
      await this.$dialog.confirm({
        title: '提示',
        message: '是否要回退为上一次发布的配置？',
      })

      const res = await getRollbackAdverts(this.devId)
      const data = res.body.advertsRes
      this.hasDraft = false
      this.setFileMap(data.resEntityMap)
      this.setConfig(data.rotationRules)
    },
    async checkNotSaved() {
      if (!this.$refs.config.checkSaved()) {
        const confirm = await this.$dialog.confirm({
          title: '提示',
          message: '是否要保存当前配置？',
        }).then(() => true)
          .catch(() => false)
        confirm && await this.addAdvertsTemp()
      }
    },
    selectTemplate() {
      uni.navigateTo({
        url: '/pages/template-ad/list',
      })
      uni.$on(SELECT_TEMPLATE, async (id) => {
        const res = await getAdvertsShopById({
          advertsShopId: id,
        })
        this.modulesTitle = res.body.describe
        this.setFileMap(keyBy(res.body.resEntityList, 'id'))
        this.setConfig(res.body.rotationRules, false)
      })
    },
    setFileMap(map) {
      this.$refs.config.setFileMap(map)
    },
    setConfig(config, cache) {
      this.$refs.config.setConfig(config, cache)
    },
    getConfig() {
      return this.$refs.config.getConfig()
    },
    saveConfigCache() {
      this.$refs.config.saveConfigCache()
    },

    // 切换模式
    onCancel() {
      this.showPicker = false
    },
    onConfirm(val) {
      this.showPicker = false
      this.$dialog.confirm({
        title: '提示',
        message: '是否确认该操作？',
      }).then(async () => {
        const value = val.target.index
        await sendCommandToDevice({
          devId: this.devId,
          cmd: value === 0 ? 9 : 10,
          mod: 1, // 来源：1（小程序）
        })
        this.$toast.success('切换成功')
      }).catch()
    },
  },
}
</script>

<template>
  <container classes="flex flex-col items-center bg-gray-100">
    <!--    bg-[#6FA7FF] -->
    <!-- <view class="navHeight w-full" :style="{ height: `${iStatusBarHeight}px` }" />
    <view class="w-full flex justify-start flex py-1 items-center" :style="{ height: `${topHeight}px` }">
      <van-button
        v-if="showSwitch"
        icon="sort"
        type="default"
        class="mx-2"
        color="#6FA7FF"
        round
        plain
        size="small"
      >
        切换模式
      </van-button>
    </view> -->
    <view class="w-full">
      <view v-if="logged" class="flex flex-col w-full flex-1">
        <view class="w-full py-2 flex items-center">
          <!-- <view
            class="flex text-sm bg-[#3490dc] text-white px-2 py-1 rounded-full mx-1 truncate"
            @click="getDevState(true)"
          >
            <van-icon name="aim" />
            <span class="ml-1">探测</span>
          </view> -->
          <tabs :list="devList" class="w-full flex-1 overflow-hidden overflow-x-auto mr-1" @select-tab="selectTab()" />
        </view>

        <config
          ref="config"
          arrow
          :goods="goodsList"
          class="config w-full flex-1 flex flex-col"
          :dev-state="devInfo.devState"
          :brand-type="devInfo.brandType"
          @addAdvertsTemp="addAdvertsTemp()"
          @getRollbackAdverts="getRollbackAdverts()"
        >
          <template #top-actions>
            <view class="w-full flex justify-around">
              <van-button
                size="small"
                type="info"
                color="#6FA7FF"
                round
                @click="addAdvertsTemp()"
              >
                保存草稿{{ hasDraft ? '(1)' : '' }}
              </van-button>
              <van-button
                v-if="hasDraft"
                type="info"
                size="small"
                color="#6FA7FF"
                round
                plain
                @click="getRollbackAdverts()"
              >
                回退
              </van-button>
            </view>
          </template>

          <template #after>
            <view class="h-full overflow-auto">
              <van-cell-group inset>
                <van-cell title="发布时间" :value="devInfo.releaseTime" />
                <van-cell title="探测时间" :value="devInfo.detecTime" />
              </van-cell-group>
            </view>
          </template>
          <template #actions>
            <view class="flex gap-3 px-3">
              <van-button
                class="!h-10 w-full"
                type="info"
                block
                color="#6FA7FF"
                round
                plain
                @click="selectTemplate()"
              >
                {{ modulesTitle ? `模板(${modulesTitle})` : '选择模板' }}
              </van-button>
              <van-button
                round
                block
                color="#6FA7FF"
                type="info"
                class="!h-10 w-full"
                @click="addAppPublishDeviceAds()"
              >
                发布
              </van-button>
            </view>
          </template>
        </config>
      </view>

      <view v-if="!logged" class="flex-1 rounded-xl w-full">
        <not-logged />
      </view>
    </view>

    <view v-show="showMore" class="fixed bottom-4 right-4 p-2 rounded-full bg-gray-100 z-101 leading-4 text-center shadow">
      <view class="">
        <van-transition :show="show" custom-class="block" name="fade-up">
          <view class="grid gird-cols-1 gap-2 mb-2">
            <van-icon name="exchange" color="#6FA7FF" size="20px" @click="showPicker = true" />
            <van-icon name="replay" color="#6FA7FF" size="20px" @click="getDevState(true)" />
          </view>
        </van-transition>
        <van-icon :name="show ? 'arrow-up' : 'arrow-down'" color="#6FA7FF" size="20px" @click="show = !show" />
      </view>
    </view>

    <van-popup
      :show="showPicker"
      position="bottom"
      round
      custom-style="height: 40%"
      @close="showPicker = false"
      @click-overlay="showPicker = false"
    >
      <van-picker
        show-toolbar
        confirm-button-text="提交"
        :columns="columns"
        @cancel="onCancel()"
        @confirm="onConfirm()"
      />
    </van-popup>
  </container>
</template>

<style scoped>
.navHeight{
  width: 100%;
}
::v-deep .van-tabs__content {
  flex: 1;
  overflow: hidden;
}

::v-deep .van-tab__pane {
  height: 100%;
  padding: 8px 0;
}

::v-deep .van-tab__text {
  flex: 1;
  text-align: center;
}

.config {
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.16);
}

::v-deep .van-tabs__wrap {
  border-bottom: 3px solid #6FA7FF !important;
}

::v-deep .van-tab--active {
  color: #6FA7FF !important;
}

::v-deep .van-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
