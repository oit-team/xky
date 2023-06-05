<script>
export default {
  data: () => ({
    imageList: [
      'https://picsum.photos/500?random=1',
      'https://picsum.photos/500?random=2',
      'https://picsum.photos/500?random=3',
    ],
  }),
  created() {
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
        <swiper-item v-for="img of imageList" :key="img">
          <image :src="img" class="w-full h-full" />
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
                value="内容"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="联系电话"
                value="1818181818"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="从业时间"
                value="50"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="所获荣誉"
                value="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="个性签名"
                value="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="详情介绍"
                value="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
              />
            </van-cell-group>
            <van-cell-group inset>
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="联系电话"
                value="暂无"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="联系地址"
                value="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
              />
              <van-cell
                title-class="title-class"
                value-class="value-class"
                title="介绍"
                value="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
              />
            </van-cell-group>
          </div>
        </van-tab>
        <van-tab title="案例与课程">
          <div class="grid grid-cols-2 gap-3 p-3">
            <div v-for="img of 20" :key="img" class="aspect-3/4 bg-gray-50 rounded-lg overflow-hidden">
              <image src="https://picsum.photos/300" class="h-full w-full" />
            </div>
          </div>
        </van-tab>
        <van-tab title="精彩瞬间">
          <div class="grid grid-cols-2 gap-3 p-3">
            <div v-for="img of 20" :key="img" class="aspect-3/4 bg-gray-50 rounded-lg overflow-hidden">
              <image src="https://picsum.photos/300" class="h-full w-full" />
            </div>
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
