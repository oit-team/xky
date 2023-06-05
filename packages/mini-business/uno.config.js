import { defineConfig, presetUno } from 'unocss'
import presetWeapp from 'unocss-preset-weapp'
import { transformerClass } from 'unocss-preset-weapp/transformer'

export default defineConfig({
  presets: [
    presetUno({
      preflight: false,
    }),
    presetWeapp({
      whRpx: false,
    }),
  ],
  transformers: [
    transformerClass(),
  ],
})
