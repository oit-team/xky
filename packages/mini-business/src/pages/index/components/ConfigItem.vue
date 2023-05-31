<script>
import { convertImageSize } from '../../../utils/helper'

export default {
  props: {
    item: Object,
    fileMap: Object,
    placeholder: Boolean,
    imageSize: String,
  },

  computed: {
    src() {
      return this.fileMap[this.item.srcId] ? this.fileMap[this.item.srcId].resUrl : ''
    },
  },

  methods: {
    convertImageSize,
  },
}
</script>

<template>
  <view class="flex-shrink-0 w-full h-full">
    <van-image
      v-if="item.type === 'image'"
      class="h-full w-full"
      fit="cover"
      :src="convertImageSize(src, imageSize)"
    />
    <video
      v-else-if="item.type === 'video' && !placeholder"
      class="h-full w-full"
      :src="src"
      controls
      controlslist="nodownload"
    />
    <view
      v-else
      class="bg-white grid place-content-center h-full"
    >
      <van-icon name="play" size="20" />
    </view>
  </view>
</template>

<style scoped>
::v-deep .van-image{
  display: block;
}
</style>
