<script>
import product from '../mixins/product'
import { previewImg } from '@/utils/helper'

export default {
  mixins: [product],
  methods: { previewImg },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <swiper
      class="h-250px"
      circular
      indicator-dots
    >
      <swiper-item v-for="file of data.videoList" :key="file">
        <video class="w-full h-full" :src="file" :enable-progress-gesture="false" />
      </swiper-item>
      <swiper-item v-for="file of data.imgList" :key="file">
        <image class="w-full h-full" mode="aspectFit" :src="file" @click="previewImg(data.imgList)" />
      </swiper-item>
    </swiper>

    <div class="flex flex-col gap-3 p-3">
      <div class="bg-white p-2 rounded">
        <div class="flex justify-between">
          <div>
            <span class="color-red-500 text-sm">￥{{ getValue('productPrice') }}</span>
            <span v-if="getValue('originalPrice')" class="line-through color-gray-400 text-xs ml-2">￥{{ getValue('originalPrice') }}</span>
          </div>
          <span class="text-xs color-gray-500">库存:{{ getValue('productInventory') }}</span>
        </div>
        <div class="flex gap-2">
          <van-tag v-for="tag of getValue('productLabel')" :key="tag" plain type="danger" size="14">
            {{ tag }}
          </van-tag>
        </div>
        <div class="text-sm">
          {{ getValue('productName') }}
        </div>
      </div>

      <van-cell-group>
        <van-cell :title="getLabel('productNo')" :value="getValue('productNo')" />
        <van-cell :title="getLabel('productFabric')" :value="getValue('productFabric')" />
        <van-cell :title="getLabel('productTypeName')" :value="getValue('productTypeName')" />
        <van-cell :title="getLabel('wearSellingPoint')">
          <template>
            <rich-text :nodes="getValue('wearSellingPoint')" />
          </template>
        </van-cell>
        <van-cell :title="getLabel('styleInfo')" :value="getValue('styleInfo')" />
      </van-cell-group>

      <div class="flex flex-col">
        <image
          v-for="img of data.detailsImgList"
          :key="img"
          class="w-full"
          mode="widthFix"
          :src="img"
        />
      </div>
    </div>
  </container>
</template>
