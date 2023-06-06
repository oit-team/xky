<script>
export default {
  options: {
    virtualHost: true,
  },
  props: {
    load: Function,
    refresh: Function,
    immediate: {
      type: Boolean,
      default: true,
    },
    scope: {
      type: String,
      validator: value => ['root', 'parent'].includes(value),
      default: 'root',
    },
  },
  data() {
    return {
      pageData: {
        pageNum: 1,
        pageSize: 20,
      },
      state: {
        loading: false,
        finished: false,
      },
    }
  },
  computed: {
    refresherEnabled() {
      return !!this.refresh
    },
  },
  created() {
    this.immediate && this.callLoad()
    console.log(this)
  },
  methods: {
    callLoad() {
      if (typeof this.load === 'function')
        return this.load.call(this.getScope(), this.pageData)
    },
    callRefresh() {
      if (typeof this.refresh === 'function')
        return this.refresh.call(this.getScope(), typeof this.load === 'function' ? this.pageData : undefined)
    },
    getScope() {
      return this.scope === 'root' ? this.$root : this.$parent
    },
    async scrolltolower() {
      if (this.state.loading || this.state.finished || typeof this.load !== 'function')
        return

      try {
        this.loading(true)
        await this.callLoad()
        this.pageData.pageNum++
      }
      finally {
        this.loading(false)
      }
    },
    async refresherrefresh() {
      if (this.state.loading || typeof this.refresh !== 'function')
        return

      try {
        this.reset()
        this.loading(true)
        await this.callRefresh()
      }
      finally {
        this.loading(false)
      }
    },
    loading(loading) {
      this.state.loading = loading
    },
    finished(finished = true) {
      this.state.finished = finished
    },
    reset() {
      this.pageData = {
        pageNum: 1,
        pageSize: 20,
      }
      this.state = {
        loading: false,
        finished: false,
      }
    },
  },
}
</script>

<template>
  <scroll-view
    class="vc-list"
    :class="[classes]"
    scroll-y
    enable-back-to-top
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="state.loading"
    @scrolltolower="scrolltolower"
    @refresherrefresh="refresherrefresh"
  >
    <slot />
    <slot name="load-more" :loading="state.loading" :finished="state.finished">
      <div class="flex items-center justify-center py-2">
        <van-loading v-if="state.loading" size="16px">
          加载中...
        </van-loading>
        <div v-else-if="state.finished">
          没有更多了
        </div>
      </div>
    </slot>
  </scroll-view>
</template>

<style>
.vc-list {
  height: 100%;
}
</style>
