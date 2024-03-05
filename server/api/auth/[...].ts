import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

interface Credentials {
  username: string
  password: string
}

interface TokenResponse {
  access_token: string
  expires_in: string
  refresh_token: string
}

interface UserResponse {
  id: number
  name: string
  email: string
}
interface User extends UserResponse {
  token: TokenResponse
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: '/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: '(hint: jsmith)',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '(hint: hunter2)',
        },
      },
      async authorize(credentials: Credentials) {
        try {
          const token = await fetchToken(credentials)

          const data = await fetchUser(token.access_token)

          const user = {
            id: data.id,
            name: data.name,
            email: data.email,
            token: {
              ...token,
            },
          }

          console.log('Authorize User:', user)

          return user
        } catch (error) {
          console.warn('Authorize Error:', error)

          return null
        }
      },
    }),
  ],
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user
      }

      return Promise.resolve(token)
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: ({ session, token }) => {
      ;(session as any).user = token.user

      return Promise.resolve(session)
    },
  },
})

async function fetchToken(credentials: Credentials) {
  const runtimeConfig = useRuntimeConfig()

  return await $fetch<TokenResponse>(
    `${runtimeConfig.apiUrl}/auth/requestToken`,
    {
      method: 'POST',
      body: {
        'client-id': runtimeConfig.passwordClientId,
        'client-secret': runtimeConfig.passwordClientSecret,
        login: credentials.username,
        password: credentials.password,
      },
    },
  ).catch(() => {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  })
}

async function fetchUser(accessToken: String) {
  const runtimeConfig = useRuntimeConfig()

  const { data } = await $fetch<{ data: UserResponse }>(
    `${runtimeConfig.apiUrl}/api/a/owner/own`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).catch(() => {
    throw createError({ statusCode: 400, statusMessage: 'Unauthorized' })
  })

  return data
}
