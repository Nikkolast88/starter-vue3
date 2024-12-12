<script setup>
import { postLamps } from '~/services/api'

postLamps({}).then(() => {})
</script>

<template>
  <div class="class" font-bold>
    hello world
  </div>
  <div class="i-icons-logo" text-red-500 />
</template>
