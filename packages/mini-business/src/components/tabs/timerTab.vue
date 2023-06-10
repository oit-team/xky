<script>
const date = new Date()

export default {
  props: {
  },
  data() {
    return {
      list: [],
      date,
      idList: [3, 2, 1, 0, -1, -2, -3],
      activeIndex: 3,
    }
  },
  methods: {
    form(data) {
      return {
        week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][data.getDay()],
        time: `${data.getMonth() + 1}-${data.getDate()}`,
        date: `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`,
      }
    },
    getData() {
      this.list = []
      // const newTime = this.today ? new Date(this.today).getTime() : new Date().getTime()
      this.idList.forEach((item) => {
        this.list.push(this.form(new Date(new Date().getTime() - item * 24 * 3600 * 1000)))
      })
    },
    changeToday(date) {
      this.list = []
      this.activeIndex = 3
      this.idList.forEach((item) => {
        this.list.push(this.form(new Date(new Date(date).getTime() - item * 24 * 3600 * 1000)))
      })
    },
    activeChange(item, index) {
      this.activeIndex = index
      this.$emit('change-data', item.date)
    },
  },
}
</script>

<template>
  <view class="flex w-full">
    <view class="flex-1 flex items-center overflow-hidden overflow-x-auto text-sm">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="text-center px-2 py-1 box-border rounded-md m-1"
        :class="[activeIndex === index ? 'bg-[#0ea5e9] text-white' : '']"
        @click="activeChange(item, index)"
      >
        <view class="my-1 truncate">
          {{ item.week }}
        </view>
        <view class="font-semibold truncate">
          {{ item.time }}
        </view>
      </view>
    </view>
    <view class="flex justify-center w-10 items-center rounded-l-md shadow-md shadow-gray-500" @click="$emit('show-calendar')">
      <van-icon name="calendar-o" size="18" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
