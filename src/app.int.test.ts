import request from 'supertest'
import app from './app'
import { User } from './models'
import sequelize from './config/database'

type UserType = {
  email: string | null
  password: string | null
  username: string | null
}

beforeAll(() => {
  return sequelize.sync()
})

beforeEach(() => {
  return User.destroy({ truncate: true })
})

const validUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
}

const postUser = (user: UserType = validUser) => {
  return request(app).post('/api/1.0/users').send(user)
}

describe('Integration Tests', () => {
  describe('User Registration', () => {
    it('returns 200 OK when signup request is valid', async () => {
      const response = await postUser()

      expect(response.status).toBe(200)
    })

    it('returns success message when signup request is valid', async () => {
      const response = await postUser()

      expect(response.body.message).toBe('User created')
    })

    it('saves the user to database', async () => {
      await postUser()

      const userList = await User.findAll()

      expect(userList.length).toBe(1)
    })

    it('saves the username and email to database', async () => {
      await postUser()

      const userList = await User.findAll()
      const savedUser = userList[0]

      // @ts-ignore
      expect(savedUser.username).toBe('user1')
      // @ts-ignore
      expect(savedUser.email).toBe('user1@mail.com')
    })

    it('hashes the password in the database', async () => {
      await postUser()

      const userList = await User.findAll()
      const savedUser = userList[0]

      // @ts-ignore
      expect(savedUser.password).not.toBe('P4ssword')
    })

    it('returns 400 when username is null', async () => {
      const response = await postUser({
        username: null,
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      expect(response.status).toBe(400)
    })

    it('returns validationErrors field in response body when validation error occurs', async () => {
      const response = await postUser({
        username: null,
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      const body = response.body

      expect(body.validationErrors).not.toBeUndefined()
    })

    it('returns errors for both when  username and email is null', async () => {
      const response = await postUser({
        username: null,
        email: null,
        password: 'P4ssword',
      })

      const body = response.body

      expect(Object.keys(body.validationErrors)).toEqual(['username', 'email'])
    })

    const usernameNull = 'Username cannot be null'
    const usernameSize = 'Must have min 4 and max 32 characters'
    const emailNull = 'E-mail cannot be null'
    const emailInvalid = 'E-mail is not valid'
    const passwordNull = 'Password cannot be null'
    const passwordSize = 'Password must be at least 6 characters'
    const password_pattern =
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'
    const email_inuse = 'E-mail in use'

    it.each`
      field         | value              | expectedMessage
      ${'username'} | ${null}            | ${usernameNull}
      ${'username'} | ${'usr'}           | ${usernameSize}
      ${'username'} | ${'a'.repeat(33)}  | ${usernameSize}
      ${'email'}    | ${null}            | ${emailNull}
      ${'email'}    | ${'mail.com'}      | ${emailInvalid}
      ${'email'}    | ${'user.mail.com'} | ${emailInvalid}
      ${'email'}    | ${'user@mail'}     | ${emailInvalid}
      ${'password'} | ${null}            | ${passwordNull}
      ${'password'} | ${'P4ssw'}         | ${passwordSize}
      ${'password'} | ${'alllowercase'}  | ${password_pattern}
      ${'password'} | ${'ALLUPPERCASE'}  | ${password_pattern}
      ${'password'} | ${'123456789'}     | ${password_pattern}
      ${'password'} | ${'lowerUPPER'}    | ${password_pattern}
      ${'password'} | ${'lower123456'}   | ${password_pattern}
      ${'password'} | ${'UPPER123456'}   | ${password_pattern}
    `(
      'returns $expectedMessage when $field is $value',
      async ({ field, expectedMessage, value }) => {
        const user = {
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        }

        // @ts-ignore
        user[field] = value
        const response = await postUser(user)
        const body = response.body
        expect(body.validationErrors[field]).toBe(expectedMessage)
      },
    )

    it('returns E-mail in use when same email is already in use', async () => {
      await User.create({ ...validUser })

      const response = await postUser()

      expect(response.body.validationErrors.email).toBe(email_inuse)
    })

    it('returns errors for both username is null and email is in use', async () => {
      await User.create({ ...validUser })

      const response = await postUser({
        username: null,
        email: validUser.email,
        password: 'P4ssword',
      })

      const body = response.body

      expect(Object.keys(body.validationErrors)).toEqual(['username', 'email'])
    })
  })
})
