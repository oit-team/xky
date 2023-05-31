<script>
import ConfigItem from './ConfigItem.vue'

export default {
  components: {
    ConfigItem,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    fileMap: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    drag: false,
  }),

  methods: {
  },
}
</script>

<template>
  <view class="flex flex-col items-center w-full box-border relative">
    <view class="grid-cols-2 gap-x-3 grid px-2">
      <view
        v-for="(item, index) in value"
        :key="item._tempId"
        class="flex flex-col items-center item mt-2 relative w-12 flex-shrink-0"
        @click="$emit('select', index)"
      >
        <van-icon
          class="!absolute -right-1.5 -top-1.5 !text-xs bg-red-500 w-3 h-3 !leading-3 rounded-1/2 text-white border border-white p-0.5 z-10"
          name="cross"
          @click.native.stop="$emit('remove', index)"
        />
        <view class="flex flex-col rounded overflow-hidden pointer-events-none w-48px h-85px">
          <config-item
            v-if="item.items[0]"
            :item="item.items[0]"
            :file-map="fileMap"
            image-size="s"
            :style="{ flexBasis: `${item.divider * 100}%` }"
            placeholder
          />
          <config-item
            v-if="item.items[1]"
            :item="item.items[1]"
            :file-map="fileMap"
            placeholder
            image-size="s"
            class="flex-1"
          />
        </view>
        <view class="text-xs">
          {{ index + 1 }}
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
</style>
