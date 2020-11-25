import request from "supertest";
import { app } from "../../app";

it('fails when a email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'lehoan@gmail.com',
      password: 'password'
    })
    .expect(400)
})

it('fails when a incorrect is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'lehoan@gmail.com',
      password: 'password'
    })
    .expect(201)
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'lehoan@gmail.com',
      password: '1234456'
    })
    .expect(400)
})

it('Response with a cookie when given a valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'lehoan@gmail.com',
      password: 'password'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'lehoan@gmail.com',
      password: 'password'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined();
})