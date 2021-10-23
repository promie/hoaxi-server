import request from 'supertest'
import app from './app'
import { User } from './models'
import sequelize from './config/database'

beforeAll(() => {
  return sequelize.sync()
})

beforeEach(() => {
  return User.destroy({ truncate: true })
})

describe('Integration Tests', () => {
  describe('User Registration', () => {
    it('returns 200 OK when signup request is valid', async () => {
      await request(app)
        .post('/api/1.0/users')
        .send({
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        })
        .expect(200)
    })

    it('returns success message when signup request is valid', async () => {
      const response = await request(app).post('/api/1.0/users').send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      expect(response.body.message).toBe('User created')
    })

    it('saves the user to database', async () => {
      await request(app).post('/api/1.0/users').send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      const userList = await User.findAll()

      expect(userList.length).toBe(1)
    })

    it('saves the username and email to database', async () => {
      await request(app).post('/api/1.0/users').send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      const userList = await User.findAll()
      const savedUser = userList[0]

      // @ts-ignore
      expect(savedUser.username).toBe('user1')
      // @ts-ignore
      expect(savedUser.email).toBe('user1@mail.com')
    })

    it('hashes the password in the database', async () => {
      await request(app).post('/api/1.0/users').send({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })

      const userList = await User.findAll()
      const savedUser = userList[0]

      // @ts-ignore
      expect(savedUser.password).not.toBe('P4ssword')
    })
  })
})
