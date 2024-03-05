<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { signIn } = useAuth()

const onSignIn = async () => {
  const { error, url }: any = await signIn('credentials', {
    username: 'jsmith',
    password: 'hunter2',
    redirect: false,
  })

  if (error) {
    // Do your custom error handling here
    alert('You have made a terrible mistake while entering your credentials')
  } else {
    // No error, continue with the sign in, e.g., by following the returned redirect:
    return navigateTo(url, { external: true })
  }
}
</script>

<template>
  <div class="text-3xl">Page: login</div>
  <button class="" @click="onSignIn">signIn</button>
</template>

<style scoped></style>
