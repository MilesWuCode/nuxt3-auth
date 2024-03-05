// auth.ts
import 'next-auth'

// Declare your framework library
declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: number | string
    name: string
    email: string
    token: {
      access_token: string
      expires_in: number
      refresh_token: string
      expiredAt: number
    }
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {}
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string

    user: {
      id: number | string
      name: string
      email: string
      token: {
        access_token: string
        expires_in: number
        refresh_token: string
        expiredAt: number
      }
    }
  }
}
