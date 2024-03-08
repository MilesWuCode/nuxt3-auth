<script lang="ts" setup>
console.log('protected')
definePageMeta({ middleware: 'auth' })

const { data } = useAuth()
</script>

<template>
  <div>
    <div class="text-3xl">Page: protected</div>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped></style>
