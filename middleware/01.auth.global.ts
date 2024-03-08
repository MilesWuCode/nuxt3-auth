export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    console.log('server', Date.now())
  }

  if (process.client) {
    console.log('client', Date.now())

    const { status, data } = useAuth()

    if (status.value === 'authenticated') {
      if (Date.now() > data.value?.user.token.expiredAt) {
        console.log('call api/token')
        await $fetch('/api/token')
      }
    }
  }
})
