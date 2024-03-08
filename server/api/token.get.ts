import { encode } from 'next-auth/jwt'
import { getToken } from '#auth'

export default eventHandler(async (event) => {
  const token = await getToken({ event })

  if (Date.now() > token.user.token.expiredAt) {
    console.log('refresh_token')

    const { expiredAt, refresh_token, access_token } = token.user?.token

    const newToken = {
      ...token,
      user: {
        id: token.user.id,
        name: token.user.name,
        email: token.user.email,
        token: {
          expiredAt,
          refresh_token,
          access_token,
        },
      },
    }

    const newSessionToken = await encode({
      secret: '12345678901234567890123456789012',
      token: newToken,
      maxAge: 30 * 86400,
    })

    setCookie(event, 'next-auth.session-token', newSessionToken, {
      httpOnly: true,
      maxAge: 30 * 86400,
      secure: false,
      sameSite: 'lax',
    })
  }

  return 'done'
})
