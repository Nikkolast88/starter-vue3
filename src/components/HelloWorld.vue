<script setup>
import { useI18n } from 'vue-i18n'
import { postLamps } from '~/services/api'

const { t } = useI18n()
postLamps({}).then(() => {})
</script>

<template>
  <div>{{ t("hello world") }}</div>
</template>
