import request from 'supertest'
import app from './app'

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
