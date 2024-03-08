<script lang="ts" setup>
console.log('profile')
definePageMeta({ middleware: 'auth' })

const { data } = useAuth()
</script>

<template>
  <div>
    <div class="text-3xl">Page: Profile</div>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped></style>
