<script>
export default {
  props: {
    list: Array,
  },
  data() {
    return {
      tabIndex: 0,
    }
  },
  methods: {
    clickTab(index) {
      this.$emit('select-tab', index)
      this.tabIndex = index
    },
  },
}
</script>

<template>
  <view class="flex">
    <view
      v-for="(item, index) in list"
      :key="index"
      class=" p-1 mx-1 rounded-full"
      :class="tabIndex === index ? 'bg-[#CBE0FF]' : 'bg-white'"
      @click="clickTab(index)"
    >
      <view class="flex items-center justify-start text-sm truncate px-1">
        <view
          class="devStateCircle mx-1 inline-block"
          :class="item.devState === '0' ? 'devOffLine' : 'devOnLine'"
        />
        {{ item.devSerialNum }}
      </view>
    </view>
  </view>
</template>

<style scoped>
.devStateCircle {
  width: 8px;
  height: 8px;
  border-radius: 50px;
}

.devOffLine {
  background-color: gray;
}

.devOnLine {
  background-color: #a0f377;
}
</style>
