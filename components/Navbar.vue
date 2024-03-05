<script lang="ts" setup>
const { status, signOut } = useAuth()
</script>

<template>
  <div>
    <ul class="flex space-x-4 text-2xl">
      <li><NuxtLink to="/">index</NuxtLink></li>
      <li><NuxtLink to="/login">login</NuxtLink></li>
      <li><NuxtLink to="/protected">protected</NuxtLink></li>
      <li><NuxtLink to="/guest">guest</NuxtLink></li>
      <li v-if="status === 'authenticated'">
        <a href="#" @click="signOut()">signOut</a>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
