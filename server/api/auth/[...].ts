import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

interface Credentials {
  username: string
  password: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
}

interface Token extends TokenResponse {
  expiredAt: number
}

interface UserResponse {
  id: number
  name: string
  email: string
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
    jwt: async ({ token, user }) => {
      if (user) {
        console.log('jwt user:', user)

        token.user = user
      }

      if (
        token.user.token.expiredAt &&
        Date.now() > token.user.token.expiredAt
      ) {
        console.log('jwt refreshToken')

        const newToken = await refreshToken(token.user.token.refresh_token)

        token.user.token = newToken
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

async function fetchToken(credentials: Credentials): Promise<Token> {
  const runtimeConfig = useRuntimeConfig()

  const data = await $fetch<TokenResponse>(
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

  return {
    ...data,
    // expiredAt: Date.now() + 15 * 86400 * 1000,
    expiredAt: Date.now() + 10 * 1000,
  }
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

async function refreshToken(token: string) {
  const runtimeConfig = useRuntimeConfig()

  const data = await $fetch<TokenResponse>(
    `${runtimeConfig.apiUrl}/auth/refreshToken`,
    {
      method: 'POST',
      body: {
        'client-id': runtimeConfig.passwordClientId,
        'client-secret': runtimeConfig.passwordClientSecret,
        'refresh-token': token,
      },
    },
  ).catch((error) => {
    console.log(error)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  })

  return {
    ...data,
    // expiredAt: Date.now() + 15 * 86400 * 1000,
    expiredAt: Date.now() + 10 * 1000,
  }
}
