import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerAttributifyJsx, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        icons: FileSystemIconLoader('./src/icons'),
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerAttributifyJsx(),
  ],
})
