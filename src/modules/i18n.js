import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en', // 设置默认语言
  messages: {}, // 预先加载的语言包
})

/**
 * @type { Record<string, () => Promise<{ default: Record<string, string>}>>}
 */
const modules = import.meta.glob('/locales/*.yml')

const localesMap = Object.fromEntries(
  Object.entries(modules)
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]),
)
export const availableLocales = Object.keys(localesMap)

/**
 * @type {string[]}
 */
const loadedLanguages = []

/**
 *
 * @param {import('vue-i18n').Locale} lang
 */
function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)

  return lang
}

/**
 *
 * @param {string} lang
 * @returns {Promise<import('vue-i18n').Locale>} 当前设置的语言
 */
export async function loadLanguageAsync(lang) {
  if (i18n.global.locale.value === lang || loadedLanguages.includes(lang))
    return setI18nLanguage(lang)
  try {
    const messages = await import(`../../locales/${lang}.yml`).then(mod => mod.default)
    i18n.global.setLocaleMessage(lang, messages)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  }
  catch (error) {
    console.error(`Failed to load language: ${lang}, error: ${error}`)
    return setI18nLanguage(i18n.global.locale.value) // 尝试恢复到先前的语言
  }
}

/**
 *
 * @type {import('~/types').UserModule}
 */
export async function install({ app }) {
  app.use(i18n)
  await loadLanguageAsync('en') // 首先加载默认语言
}
