<script>
import ConfigList from '../components/ConfigList.vue'
import Preview from '../components/Preview.vue'
import { SELECT_COLLOCATION } from '../../../utils/constant'

let configCache = ''

export default {
  components: {
    ConfigList,
    Preview,
  },

  props: {
    arrow: Boolean,
    brandType: Number,
  },

  data: () => ({
    drag: false,
    tabIndex: 0,
    configIndex: 0,
    config: [],
    fileMap: {},
    devStateActive: 0,
    showTime: false,
    startTime: '',
    endTime: '',
    formatterStartTime: '',
    formatterEndTime: '',
    nowSelectTimeId: 0,
    // -----
    minDate: new Date().getTime(),
    maxDate: new Date(new Date().getFullYear() + 3, new Date().getMonth() + 1, new Date().getDate()).getTime(),
  }),
  watch: {
    startTime() {
      // this.endTime = this.startTime
      // this.endTime = this.formatter(new Date(this.startTime.getFullYear(), this.startTime.getMonth() + 1, this.startTime.getDate(), 0, 0))
    },
  },
  methods: {
    startInput(e) {
      this.startTime = e.detail
      this.formatterStartTime = this.formatter(e.detail)
      this.showTime = false
    },
    endInput(e) {
      if (e.detail < this.startTime) {
        this.$toast.fail('结束时间不能小于开始时间')
        return
      }
      this.endTime = e.detail
      this.formatterEndTime = this.formatter(e.detail)
      this.showTime = false
    },
    formatter(value) {
      value = new Date(value)
      const month = value.getMonth() + 1 > 10 ? value.getMonth() + 1 : `0${value.getMonth() + 1}`
      const day = value.getDate() > 10 ? value.getDate() : `0${value.getDate()}`
      const hours = value.getHours() > 10 ? value.getHours() : `0${value.getHours()}`
      const minute = value.getMinutes() > 10 ? value.getMinutes() : `0${value.getMinutes()}`
      return `${value.getFullYear()}-${month}-${day} ${hours}:${minute}`
    },
    ShowPop(id) {
      this.nowSelectTimeId = id
      this.showTime = true
    },
    selectCollocation() {
      const list = Object.keys(this.fileMap)
      uni.navigateTo({
        url: `/pages/index/collocation?list=${JSON.stringify(list)}`,
      })
      uni.$once(SELECT_COLLOCATION, (res) => {
        const max = 15
        for (const item of Object.values(res)) {
          if (this.config.length >= max) {
            this.$toast(`最多添加${max}个搭配图`)
            return
          }
          this.$set(this.fileMap, item.id, item)
          this.config.push({
            _tempId: Math.random(),
            items: [
              {
                srcId: item.id,
                type: 'image',
                fit: 'cover',
              },
            ],
            divider: 1,
            duration: 8000,
          })
        }
      })
    },
    getConfig() {
      const id = []
      const goodsIds = []
      const config = this.config.map((item) => {
        item = { ...item }
        delete item._tempId
        item.items.forEach(({ srcId }) => {
          id.push(srcId)
        })
        item.goods && item.goods.forEach((item) => {
          item && goodsIds.push(item)
        })
        return item
      })

      return {
        config,
        id: [...new Set(id)],
        goods: [...new Set(goodsIds)],
      }
    },
    setConfig(config, cache = true) {
      const configParsed = typeof config === 'string' ? JSON.parse(config) : config
      this.config = configParsed.map(item => ({
        _tempId: Math.random(),
        ...item,
      }))
      cache && this.saveConfigCache()
    },
    saveConfigCache() {
      configCache = JSON.stringify(this.config)
    },
    async checkConfig() {
      const check = this.config.length > 0
      if (!check) {
        this.$toast('未添加任何内容')
        return Promise.reject(check)
      }
      return check
    },
    remove($event) {
      this.config.splice($event, 1)
      this.$refs.swiper.swipeTo(0)
      this.$emit('change-keep')
    },
    setFileMap(map) {
      this.fileMap = map
    },
    checkSaved() {
      return JSON.stringify(this.config) === configCache
    },
    swipeTo(index) {
      if (this.$refs.swiper)
        this.$refs.swiper.swipeTo(index)
    },
    setGoods(imgs) {
      const list = []
      Object.keys(imgs).forEach((item) => {
        list.push(Number(item))
      })
      this.config[this.configIndex].goods = list
    },
    clickView() {
      uni.$off('goods-list', this.setGoods)
      uni.$once('goods-list', this.setGoods)
      const goods = this.config[this.configIndex].goods
      uni.navigateTo({
        url: `/pages/index/goodsList?id=${JSON.stringify(goods)}`,
      })
    },
    // 修改位置
    changePlace(e) {
      if (e.detail) {
        const index = e.detail - 1
        if (index < 0 || e.detail > this.config.length)
          this.$toast(`不能大于${this.config.length},重新输入`)
        else this.config.splice(index, 1, ...this.config.splice(this.configIndex, 1, this.config[index]))
      }
    },
  },
}
</script>

<template>
  <view class="flex-1 flex flex-col overflow-hidden">
    <!--    轮播 + 选择图片 -->
    <view class="relative min-h-356px">
      <view class="flex relative my-2">
        <view class="aspect-9-16 px-2 overflow-hidden" @click="clickView()">
          <preview ref="swiper" :config="config" :file-map="fileMap" class="w-full h-full flex" @change="configIndex = $event.target.current" />
        </view>

        <view class="minWidth box-border">
          <view class="flex pb-3 box-border h-full absolute top-0 right-3 overflow-hidden overflow-y-auto box-border">
            <config-list
              v-model="config"
              :file-map="fileMap"
              @select="(e) => $refs.swiper.swipeTo(e)"
              @remove="remove($event)"
            />
          </view>
        </view>
      </view>

      <van-empty v-if="config.length === 0" description="暂无内容" class="absolute inset-0 bg-gray-100" />

      <!--    保存草稿  -->
      <view class="flex justify-between items-center w-full absolute bg-white bg-opacity-50 bottom-[8px] left-0 z-10 py-1 px-3 box-border">
        <view class="width-3-5">
          <slot name="top-actions" />
        </view>
        <van-button
          class="w-100px"
          icon="plus"
          size="small"
          block
          round
          type="info"
          plain
          @click="selectCollocation()"
        />
      </view>
    </view>

    <view class="bottom-info flex-1 min-h-175px flex flex-col pb-3 bg-white box-border z-20">
      <van-tabs v-model="tabIndex" class="flex-1 flex flex-col overflow-hidden px-2" line-width="0px">
        <van-tab name="config" title="配置">
          <van-cell-group v-if="config[configIndex]" inset>
            <van-field
              :value="config[configIndex].duration / 1000"
              type="digit"
              label="停留时间"
              @input="config[configIndex].duration = $event.detail * 1000"
            >
              <span slot="right-icon">秒</span>
            </van-field>
            <van-field
              :value="configIndex + 1"
              type="digit"
              label="位置调整"
              @input="changePlace($event)"
            />

            <van-field
              v-if="brandType === 1"
              :value="formatterStartTime"
              label="选择开始时间"
              readonly
              @click-input="ShowPop(1)"
            />
            <van-field
              v-if="brandType === 1"
              :value="formatterEndTime"
              label="选择结束时间"
              readonly
              @click-input="ShowPop(2)"
            />
          </van-cell-group>
          <view v-else class="h-full grid place-content-center text-gray-500">
            暂无内容
          </view>
        </van-tab>

        <van-tab title="信息">
          <slot name="after" />
        </van-tab>
      </van-tabs>

      <slot name="actions" />
    </view>

    <van-popup
      :show="showTime"
      position="bottom"
      round
      title="选择时间"
      @close="showTime = false"
    >
      <van-datetime-picker
        v-if="nowSelectTimeId === 1"
        type="datetime"
        :value="startTime"
        :min-date="minDate"
        @confirm="startInput()"
      />
      <van-datetime-picker
        v-if="nowSelectTimeId === 2"
        type="datetime"
        :value="endTime"
        :min-date="minDate"
        @confirm="endInput()"
      />
    </van-popup>
  </view>
</template>

<style scoped>
.minWidth{
  width: 35%;
}
</style>
