import request from 'supertest'
import app from './app'
import { User } from './models'
import sequelize from './config/database'
import httpStatus from 'http-status'
const SMTPServer = require('smtp-server').SMTPServer

type UserType = {
  email: string | null
  password: string | null
  username: string | null
}

let lastMail: string, server: any
let simulateSmtpFailure = false

beforeAll(async () => {
  server = new SMTPServer({
    authOptional: true,
    onData(stream: any, session: any, callback: any) {
      let mailBody: string

      stream.on('data', (data: any) => {
        mailBody += data
      })
      stream.on('end', () => {
        if (simulateSmtpFailure) {
          const err: any = new Error('invalid mailbox')
          err.responseCode = 553

          return callback(err)
        }

        lastMail = mailBody
        callback()
      })
    },
  })

  await server.listen(8587, 'localhost')

  return sequelize.sync()
})

beforeEach(() => {
  simulateSmtpFailure = false
  return User.destroy({ truncate: true })
})

afterAll(async () => {
  await server.close()
})

const validUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
}

const postUser = (user: UserType = validUser, options: any = {}) => {
  const agent = request(app).post('/api/1.0/users')

  if (options.language) {
    agent.set('Accept-Language', options.language)
  }

  return agent.send(user)
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
      const savedUser: any = userList[0]

      expect(savedUser.username).toBe('user1')
      expect(savedUser.email).toBe('user1@mail.com')
    })

    it('hashes the password in the database', async () => {
      await postUser()

      const userList = await User.findAll()
      const savedUser: any = userList[0]

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
    const passwordPattern =
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'
    const emailInUse = 'E-mail in use'

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
      ${'password'} | ${'alllowercase'}  | ${passwordPattern}
      ${'password'} | ${'ALLUPPERCASE'}  | ${passwordPattern}
      ${'password'} | ${'123456789'}     | ${passwordPattern}
      ${'password'} | ${'lowerUPPER'}    | ${passwordPattern}
      ${'password'} | ${'lower123456'}   | ${passwordPattern}
      ${'password'} | ${'UPPER123456'}   | ${passwordPattern}
    `(
      'returns $expectedMessage when $field is $value',
      async ({ field, expectedMessage, value }) => {
        const user: any = {
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        }

        user[field] = value
        const response = await postUser(user)
        const body = response.body
        expect(body.validationErrors[field]).toBe(expectedMessage)
      },
    )

    it(`returns ${emailInUse} when same email is already in use`, async () => {
      await User.create({ ...validUser })

      const response = await postUser()

      expect(response.body.validationErrors.email).toBe(emailInUse)
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

    it('creates user in inactive mode', async () => {
      await postUser()
      const users = await User.findAll()
      const savedUser: any = users[0]

      expect(savedUser.inactive).toBe(true)
    })

    it('creates user in inactive mode even the request body contains inactive as false', async () => {
      const newUser = { ...validUser, inactive: false }

      await postUser(newUser)
      const users = await User.findAll()
      const savedUser: any = users[0]

      expect(savedUser.inactive).toBe(true)
    })

    it('creates an activationToken for user', async () => {
      await postUser()
      const users = await User.findAll()
      const savedUser: any = users[0]

      expect(savedUser.activationToken).toBeTruthy()
    })

    it('sends an Account activation email with activationToken', async () => {
      await postUser()

      const users = await User.findAll()
      const savedUser: any = users[0]

      expect(lastMail).toContain('user1@mail.com')
      expect(lastMail).toContain(savedUser.activationToken)
    })

    it('returns 502 Bad Gateway when sending email fails', async () => {
      simulateSmtpFailure = true

      const response = await postUser()

      expect(response.status).toBe(httpStatus.BAD_GATEWAY)
    })

    it('returns Email failure message when sending email fails', async () => {
      simulateSmtpFailure = true
      const response = await postUser()

      expect(response.body.message).toBe('E-mail Failure')
    })

    it('does not save user to database if activation email fails', async () => {
      simulateSmtpFailure = true
      await postUser()

      const users = await User.findAll()
      expect(users.length).toBe(0)
    })

    describe('Internationalisation', () => {
      const usernameNull = 'กรุณาใส่ Username'
      const usernameSize = 'Username ต้องมีอย่างต่ำ 4 และมากสุด 32 ตัว'
      const emailNull = 'กรุณาใส่อีเมล'
      const emailInvalid = 'อีเมลไม่ถูกต้อง'
      const passwordNull = 'กรุณาใส่ Password'
      const passwordSize = 'Password ต้องมีอย่างต่ำ 6 ตัว'
      const passwordPattern =
        'Password อย่างต่ำต้องมี 1 ตัวใหญ่, 1 ตัวเล็ก และ 1 ตัวเลข'
      const emailInUse = 'อีเอลนี้ถูกใช้แล้ว'
      const userCreateSuccess = 'User ได้ถูกสร้างเรียบร้อยแล้ว'
      const emailFailure = 'มีปัญหาส่ง E-mail'

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
        ${'password'} | ${'alllowercase'}  | ${passwordPattern}
        ${'password'} | ${'ALLUPPERCASE'}  | ${passwordPattern}
        ${'password'} | ${'123456789'}     | ${passwordPattern}
        ${'password'} | ${'lowerUPPER'}    | ${passwordPattern}
        ${'password'} | ${'lower123456'}   | ${passwordPattern}
        ${'password'} | ${'UPPER123456'}   | ${passwordPattern}
      `(
        'returns $expectedMessage when $field is $value when language is set as Thai',
        async ({ field, expectedMessage, value }) => {
          const user: any = {
            username: 'user1',
            email: 'user1@mail.com',
            password: 'P4ssword',
          }

          user[field] = value
          const response = await postUser(user, { language: 'th' })
          const body = response.body
          expect(body.validationErrors[field]).toBe(expectedMessage)
        },
      )

      it(`returns ${emailInUse} when same email is already in use when language is set as Thai`, async () => {
        await User.create({ ...validUser })

        const response = await postUser({ ...validUser }, { language: 'th' })

        expect(response.body.validationErrors.email).toBe(emailInUse)
      })

      it(`returns success message of ${userCreateSuccess} when signup request is valid when language is set as Thai`, async () => {
        const response = await postUser({ ...validUser }, { language: 'th' })

        expect(response.body.message).toBe(userCreateSuccess)
      })

      it(`returns ${emailFailure} message when sending email fails when language is set as Thai`, async () => {
        simulateSmtpFailure = true

        const response = await postUser({ ...validUser }, { language: 'th' })

        expect(response.body.message).toBe(emailFailure)
      })
    })

    describe('Account activation', () => {
      it('activates the account when correct token is sent', async () => {
        await postUser()

        let users: any = await User.findAll()
        const token = users[0].activationToken

        await request(app).post(`/api/1.0/users/token/${token}`).send()
        users = await User.findAll()

        expect(users[0].inactive).toBe(false)
      })

      it('removes the token from user table after successful activation', async () => {
        await postUser()

        let users: any = await User.findAll()
        const token = users[0].activationToken

        await request(app).post(`/api/1.0/users/token/${token}`).send()
        users = await User.findAll()
        expect(users[0].activationToken).toBeFalsy()
      })
    })
  })

  describe('Listing Users', () => {
    const getUsers = () => {
      return request(app).get('/api/1.0/users')
    }

    const addUsers = async (
      activeUserCount: number = 0,
      inactiveUserCount: number = 0,
    ) => {
      for (let i = 0; i < activeUserCount + inactiveUserCount; i++) {
        await User.create({
          username: `user${i + 1}`,
          email: `user${i + 1}@mail.com`,
          password: 'HelloWorld123!@#',
          inactive: i >= activeUserCount,
        })
      }
    }

    it('returns 200 ok when they are no user in the database', async () => {
      const response = await getUsers()

      expect(response.status).toBe(200)
    })

    it('returns page object as response body', async () => {
      const response = await request(app).get('/api/1.0/users')

      expect(response.body).toEqual({
        content: [],
        page: 0,
        size: 10,
        totalPages: 0,
      })
    })

    it('returns 10 users in page content when there are 11 users in database', async () => {
      await addUsers(11)

      const response = await getUsers()
      expect(response.body.content.length).toBe(10)
    })

    it('returns 6 users in page content when there are active 6 users and inactive users in database', async () => {
      await addUsers(6, 5)

      const response = await getUsers()

      expect(response.body.content.length).toBe(6)
    })

    it('returns only id, username, and email in content array for each user', async () => {
      await addUsers(11)

      const response = await getUsers()

      const user = response.body.content[0]

      expect(Object.keys(user)).toEqual(['id', 'username', 'email'])
    })

    it('returns 2 as totalPages when there are 15 active and 7 inactive users', async () => {
      await addUsers(15, 7)

      const response = await getUsers()

      expect(response.body.totalPages).toBe(2)
    })

    it('returns second page users and page indicator when page is set as 1 in request parameter', async () => {
      await addUsers(11)

      // Can be written like request(app).get('/api/1.0/users?page=1')
      const response = await getUsers().query({ page: 1 })

      expect(response.body.content[0].username).toBe('user11')
      expect(response.body.page).toBe(1)
    })

    it('returns first page when page is set below zero as request parameter', async () => {
      await addUsers(11)
      const response = await getUsers().query({ page: -5 })

      expect(response.body.page).toBe(0)
    })

    it('returns 5 users and corresponding size indicator when size is set as 5 in request pararameter', async () => {
      await addUsers(11)
      const response = await getUsers().query({ size: 5 })

      expect(response.body.content.length).toBe(5)
    })

    it('returns 10 users and corresponding size indicator when size is set as 1000', async () => {
      await addUsers(11)
      const response = await getUsers().query({ size: 1000 })

      expect(response.body.content.length).toBe(10)
      expect(response.body.size).toBe(10)
    })

    it('returns 10 users and corresponding size indicator when size is set as 0', async () => {
      await addUsers(11)
      const response = await getUsers().query({ size: 0 })

      expect(response.body.content.length).toBe(10)
      expect(response.body.size).toBe(10)
    })

    it('returns page as zero and size as 10 when non numeric query params provided for both', async () => {
      await addUsers(11)
      const response = await getUsers().query({ size: 'size', page: 'page' })

      expect(response.body.content.length).toBe(10)
      expect(response.body.page).toBe(0)
    })
  })
})
