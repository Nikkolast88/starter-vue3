import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

/**
 * @type { Record<string, () => Promise<{ default: Record<string, string>}>>}
 */
const modules = import.meta.glob('../../locales/*.yml')

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
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

/**
 *
 * @type {import('~/types').UserModule}
 */
export function install({ app }) {
  app.use(i18n)
  loadLanguageAsync('en')
}
