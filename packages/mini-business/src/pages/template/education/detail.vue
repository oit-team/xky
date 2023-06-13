<script>
import product from '../mixins/product'
import { getVideoFrame, isVideo, previewImg } from '@/utils/helper'

export default {
  mixins: [product],
  onShow() {
  },
  methods: {
    previewImg,
    isVideo,
    getVideoFrame,
    getImageUrl(item) {
      return this.isVideo(item) ? this.getVideoFrame(item) : item
    },
    transformImageList(list) {
      console.log(list)
      return list?.map((item) => {
        return {
          type: this.isVideo(item) ? 'video' : 'image',
          image: this.getImageUrl(item),
          url: item,
        }
      })
    },
    preview({ item }) {
      this.previewImg([item])
    },
    loge({ item }) {
      console.log(item)
    },
  },
}
</script>

<template>
  <container classes="flex flex-col">
    <div class="flex">
      <swiper
        class="h-250px w-full flex-shrink-0"
        circular
        indicator-dots
      >
        <swiper-item v-for="img of data.imgList" :key="img">
          <image :src="img" class="w-full h-full" mode="aspectFit" @click="previewImg(data.imgList)" />
        </swiper-item>
      </swiper>
    </div>
    <div class="bg-gray-100 flex-1">
      <van-tabs>
        <van-tab title="详细">
          <div class="py-3 flex flex-col gap-2">
            <van-cell-group inset>
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="姓名"
                :value="getValue('productName')"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                :title="getLabel('contactPhone')"
                :value="getValue('contactPhone', '暂无')"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                :title="getLabel('employmentTime')"
                :value="getValue('employmentTime', '暂无')"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                :title="getLabel('honor')"
              >
                <rich-text :nodes="getValue('honor', '暂无')" />
              </van-cell>
              <van-cell
                title-class="title-class"
                value-class="value-class"
                :title="getLabel('personalSignature')"
              >
                <rich-text :nodes="getValue('personalSignature', '暂无')" />
              </van-cell>
              <van-cell
                title-class="title-class"
                value-class="value-class"
                :title="getLabel('detailedIntroduction')"
              >
                <rich-text :nodes="getValue('detailedIntroduction', '暂无')" />
              </van-cell>
            </van-cell-group>
          </div>
        </van-tab>
        <van-tab title="案例与课程">
          <div v-if="data.detailsImgList" class="p-3">
            <vc-waterfall :data="data.detailsImgList" gap="12px" @click-item="preview">
              <template #default="{ item }">
                <div class="bg-gray-50 rounded-lg overflow-hidden flex">
                  <image :src="item" class="w-full" mode="widthFix" />
                </div>
              </template>
            </vc-waterfall>
          </div>
        </van-tab>
        <van-tab title="精彩瞬间">
          <div class="p-3">
            <vc-waterfall :data="transformImageList(data.videoList)" item-key="url" gap="12px">
              <template #default="{ item }">
                {{ { item } }}
                <!-- <div class="bg-gray-50 rounded-lg overflow-hidden flex" @click-item="loge">
                  {{ JSON.stringify(item) }} -->
                <!-- <image :src="item.image" mode="widthFix" />
                  <video :src="item.url" class="w-full" /> -->
                <!-- </div> -->
              </template>
            </vc-waterfall>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </container>
</template>

<style>
.title-class {
  flex: 0!important;
  white-space: nowrap;
  padding-right: 16px;
  min-width: 4em;
}

.value-class {
  text-align: left!important;
}
</style>
