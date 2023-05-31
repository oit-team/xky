<script>
import ConfigItem from './ConfigItem.vue'

export default {
  components: {
    ConfigItem,
  },

  props: {
    config: {
      type: Array,
      default: () => [],
    },
    fileMap: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    current: '',
    background: ['color1', 'color2', 'color3'],
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 500,
  }),

  mounted() {
    // 修复滑动失效
    // setTimeout(this.$refs.swiper.resize, 500)
  },

  methods: {
    swipeTo(index) {
      this.current = index
    },
  },
}
</script>

<template>
  <swiper
    ref="swiper"
    class="shadow-lg rounded w-210px h-373px overflow-hidden"
    circular
    :indicator-dots="indicatorDots"
    :autoplay="autoplay"
    :duration="duration"
    :current="current"
    @change="$emit('change', $event)"
  >
    <swiper-item v-for="(item, index) of config" :key="index">
      <view class="flex flex-col h-full">
        <config-item
          v-if="item.items[0]"
          :item="item.items[0]"
          :file-map="fileMap"
          image-size="x"
          :style="{ flexBasis: `${item.divider * 100}%` }"
        />
        <config-item
          v-if="item.items[1]"
          :item="item.items[1]"
          :file-map="fileMap"
          image-size="x"
          class="flex-1"
        />
      </view>
    </swiper-item>
  </swiper>
</template>

<style>
</style>
