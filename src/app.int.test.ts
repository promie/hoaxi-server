import request from 'supertest'
import app from './app'

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
      const response = await request(app).post('/api/1.0/users')

      expect(response.body.message).toBe('User created')
    })
  })
})
