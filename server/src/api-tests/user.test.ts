import request from 'supertest';

import AutoHubServer from '../index';
import { createTestUser, deleteTestUser, getAccessToken } from './test.utils';
import { User } from '@prisma/client';
import { Server } from 'http';

jest.setTimeout(70 * 1000);

describe('User routes', () => {
  let user: User;
  let accessToken: string | null;
  let server: Server | null = null;

  beforeAll(async () => {
    server = AutoHubServer.getServer();
    user = await createTestUser('autohub-tester', 'autohub-tester@email.com');
    accessToken = await getAccessToken(user.id, user.email);
  });

  afterAll(async () => {
    try {
      await deleteTestUser(user.id);
    } catch (error) {
      console.error(error);
    }
    server?.close(() => {
      server?.closeAllConnections();
    });
  });

  it('Can login', async () => {
    const res = await request(AutoHubServer.getApp()).post('/api/users/login').send({
      email: user.email,
      password: 'test123',
    });
    expect(res.ok).toEqual(true);
  });

  it('Can logout', async () => {
    const res = await request(AutoHubServer.getApp()).post('/api/users/logout').send({});
    expect(res.ok).toEqual(true);
  });

  it('Can get user info', async () => {
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/info`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body.email).toEqual(user.email);
    expect(res.body.username).toEqual(user.username);
    expect(res.body.registered).toEqual(user.registered);
  });
});
