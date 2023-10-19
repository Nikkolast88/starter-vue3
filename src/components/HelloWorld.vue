<script setup>
import { postLamps } from '~/services/api'

postLamps({}).then((res) => {
  console.log(res)
})
</script>

<template>
  <div>Hello World</div>
</template>
