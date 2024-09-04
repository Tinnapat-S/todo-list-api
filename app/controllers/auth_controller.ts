import type { HttpContext } from '@adonisjs/core/http'
import { createError } from '@adonisjs/core/exceptions'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['student_id', 'email'],
  passwordColumnName: 'password',
})
export default class AuthController {
  async getMe({ auth }: HttpContext) {
    await auth.check()
    return { user: auth.user }
  }
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    // if (!email || !password) {
    //   throw createError('Email and password are required', '1190', 400)
    // }
    // const user = await User.query().where('email', email).first()

    // if (!user) {
    //   throw createError('Login failed (User not found)', '1190', 400)
    // }
    // const isValid = await hash.verify(user.password, password)
    // if (isValid) {
    //   throw createError('Invalid credentials', '1190', 403)
    // }
    const user = await User.verifyCredentials(email, password)

    // const user = await User.verifyCredentials(email, password)
    const accessToken = await User.accessTokens.create(user)
    // user.merge({ accessToken })
    const token = accessToken.toJSON().token
    return { user, token }
  }
  async register({ request, response }: HttpContext) {
    const { fullName, email, password, confirmPassword, studentId } = request.only([
      'fullName',
      'email',
      'password',
      'confirmPassword',
      'studentId',
    ])

    if (!fullName || !email || !studentId || !password || !confirmPassword) {
      throw createError('All fields are required', '1190', 400)
    }
    if (password !== confirmPassword) {
      throw createError('Passwords do not match', '1190', 400)
    }

    const userExists = await User.query().where('student_id', studentId).first()
    if (userExists) {
      throw createError('User already exists', '1190', 400)
    }

    const user = await User.create({
      fullName,
      studentId,
      email,
      password,
    })

    const accessToken = await User.accessTokens.create(user)
    const token = accessToken.toJSON().token
    return { user, token }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'Logged out successfully' }
  }
}
