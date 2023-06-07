<script>
import { isImage, isVideo } from '@/utils/helper'

export default {
  data: () => ({
    list: [
      'http://res.gaodanyi.com:8102/upload/0/2022/11/fce217c476a8e57693d633563c5f47c3.mp4',
      'http://res.gaodanyi.com:8102/upload/0/2022/11/1027aa11dc9368bfb9796c5159d4b6ae.mp4',
      'http://res.gaodanyi.com:8102/upload/0/2022/11/1691c8a86955445e9a0a929686c4e8f8_x.jpg',
      'http://res.gaodanyi.com:8102/upload/0/2022/11/074e7b45b8834f54afe709fed5df8b49_x.jpg',
    ],
  }),
  created() {
  },
  methods: {
    isVideo,
    isImage,
  },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <swiper
      class="h-250px"
      circular
      indicator-dots
    >
      <swiper-item v-for="file of list" :key="file">
        <video v-if="isVideo(file)" class="w-full h-full" :src="file" :enable-progress-gesture="false" />
        <image v-else-if="isImage(file)" class="w-full h-full" mode="aspectFit" :src="file" />
      </swiper-item>
    </swiper>

    <div class="flex flex-col gap-3 p-3">
      <div class="bg-white p-2 rounded">
        <div class="flex justify-between">
          <div>
            <span class="color-red-500">￥180</span>
            <span class="line-through color-gray-400 text-sm ml-2">￥180</span>
          </div>
          <span class="text-xs color-gray-500">库存:20</span>
        </div>
        <div class="flex gap-2">
          <van-tag plain type="danger">
            标签
          </van-tag>
          <van-tag plain type="danger">
            标签
          </van-tag>
          <van-tag plain type="danger">
            标签
          </van-tag>
        </div>
        <div>
          Bettychow 百搭打底！羊毛反织条纹针织衫低圆领套头通勤上衣
        </div>
      </div>

      <van-cell-group>
        <van-cell title="商品编号" value="内容" />
        <van-cell title="商品材质" value="内容" />
        <van-cell title="商品类别" value="内容" />
        <van-cell title="穿着卖点" value="内容" />
        <van-cell title="适用场合" value="内容" />
      </van-cell-group>

      <div class="flex flex-col">
        <image
          v-for="img of 5"
          :key="img"
          class="w-full"
          mode="widthFix"
          src="http://res.gaodanyi.com:8102/upload/0/2022/11/04970c0ab56f485c89da41dc48b75815_x.jpg"
        />
      </div>
    </div>
  </container>
</template>
