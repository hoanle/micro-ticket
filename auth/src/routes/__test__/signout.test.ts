import request from "supertest";
import { app } from "../../app";

it('clears the cookies after siging out ', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send()
    .expect(200);
})

