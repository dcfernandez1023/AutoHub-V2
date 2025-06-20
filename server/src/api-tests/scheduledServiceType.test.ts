import request from 'supertest';

import AutoHubServer from '../index';
import {
  createVehicleTestData,
  updateVehicleTestData,
  createTestUser,
  deleteTestUser,
  getAccessToken,
  createScheduledServiceTypeTestData,
} from './test.utils';
import { User } from '@prisma/client';
import { Server } from 'http';
import { createScheduledServiceType } from '../services/scheduledServiceTypeService';

jest.setTimeout(100 * 1000);

describe('Scheduled Service Type Routes', () => {
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

  it('Can create scheduled service type', async () => {
    const res = await request(AutoHubServer.getApp())
      .post(`/api/users/${user.id}/scheduledServiceTypes`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createScheduledServiceTypeTestData);
    expect(res.ok).toEqual(true);
    expect(res.body.id).toBeDefined();
    expect(res.body.userId).toEqual(user.id);
    expect(res.body.name).toEqual(createScheduledServiceTypeTestData.name);
  });

  it('Can update scheduled service type', async () => {
    const scheduledServiceType = await createScheduledServiceType(user.id, 'Oil Change 2');
    const res = await request(AutoHubServer.getApp())
      .put(`/api/users/${user.id}/scheduledServiceTypes/${scheduledServiceType.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Oil Change (updated)' });
    expect(res.ok).toEqual(true);
    expect(res.body.id).toBeDefined();
    expect(res.body.userId).toEqual(user.id);
    expect(res.body.name).toEqual('Oil Change (updated)');
  });

  it('Can get scheduled service types', async () => {
    await createScheduledServiceType(user.id, 'Oil Change 3');
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/scheduledServiceTypes`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Can delete scheduled service type', async () => {
    const scheduledServiceType = await createScheduledServiceType(user.id, 'Oil Change 4');
    const res = await request(AutoHubServer.getApp())
      .delete(`/api/users/${user.id}/scheduledServiceTypes/${scheduledServiceType.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
  });
});
