<script>
export default {
  props: {
    data: { type: Array, required: true },
    itemKey: { type: String, required: true },
    // 列数
    columns: { type: Number, required: true },
    // 间距
    gap: String,
  },
  computed: {
    transformData() {
      const arr = this.data
      const resultArr = Array.from({ length: this.columns }, () => [])
      for (let i = 0; i < arr.length; i += this.columns) {
        for (let j = 0; j < this.columns; j++) {
          if (arr[i + j])
            resultArr[j].push(arr[i + j])
        }
      }
      return resultArr
    },
  },
}
</script>

<template>
  <div class="vc-waterfall" :style="{ gap }">
    <div
      v-for="(group, index) of transformData"
      :key="index"
      class="vc-waterfall-columns"
      :style="{ gap }"
    >
      <div v-for="item of group" :key="item[itemKey]" class="vc-waterfall-item">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<style>
.vc-waterfall {
  display: flex;
  align-items: flex-start;
}

.vc-waterfall-columns {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
