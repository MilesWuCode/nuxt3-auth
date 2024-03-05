<script lang="ts" setup>
definePageMeta({
  middleware: 'auth', // Only required if globalAppMiddleware is disabled
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/profile',
  },
})
</script>

<template>
  <div class="text-3xl">Page: guest</div>
</template>

<style scoped></style>
