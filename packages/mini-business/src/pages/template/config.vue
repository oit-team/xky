<script>
import keyBy from 'lodash-es/keyBy'
import Config from '../index/components/Config'
import { addAdvertsShop, getAdvertsShopById, updateAdvertsShop } from '../../api/largeScreen'

export default {
  components: {
    Config,
  },

  data: () => ({
    templateName: '',
    editId: '',
  }),

  onLoad(option) {
    this.isEdit = !!option.id
    if (this.isEdit) {
      this.editId = option.id
      this.loadData()
    }
  },
  onReady() {
    if (this.isEdit) {
      uni.setNavigationBarTitle({
        title: '修改模板',
      })
    }
  },
  created() {
    this.useVantModel(['templateName'])
  },
  methods: {
    async loadData() {
      const res = await getAdvertsShopById({
        advertsShopId: this.editId,
      })

      this.templateName = res.body.describe
      this.$refs.config.setFileMap(keyBy(res.body.resEntityList, 'id'))
      this.$refs.config.setConfig(res.body.rotationRules, false)
    },
    async save() {
      if (this.templateName === '')
        return this.$toast('模板名称不能为空')

      const {
        id,
        config,
        goods,
      } = this.$refs.config.getConfig()
      if (!config.length)
        return this.$toast('请先添加内容')

      this.isEdit
        ? await updateAdvertsShop({
          advertsShopId: this.editId,
          describe: this.templateName,
          advertsShopStyles: goods,
          rotationRules: JSON.stringify(config),
          resId: id,
        })
        : await addAdvertsShop({
          describe: this.templateName,
          advertsShopStyles: goods,
          rotationRules: JSON.stringify(config),
          resId: id,
        })

      this.$toast('保存成功')
      uni.navigateBack()

      // @deprecated 本应该直接销毁页面
      // 重置数据
      this.templateName = ''
      this.$refs.config.setFileMap({})
      this.$refs.config.setConfig([])
    },
  },
}
</script>

<template>
  <container classes="flex flex-col bg-gray-100">
    <config ref="config" class="flex-1 flex">
      <template #after>
        <view class="h-full overflow-auto">
          <van-cell-group inset>
            <van-field v-model.trim="templateName" label="模板名称" placeholder="请输入模板名称" />
          </van-cell-group>
        </view>
      </template>
      <template #actions>
        <van-button class="!h-10" type="info" block round @click="save()">
          保存
        </van-button>
      </template>
    </config>
  </container>
</template>

<style lang="scss" scoped>
::v-deep .van-tabs__wrap {
  border-bottom: 3px solid rgb(25, 137, 250) !important;
}

::v-deep .van-tab--active {
  color: rgb(25, 137, 250) !important;
}

::v-deep .van-image {
  width: 100%;
  height: 100%;
}
</style>
