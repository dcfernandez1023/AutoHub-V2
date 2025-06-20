import request from 'supertest';

import AutoHubServer from '../index';
import {
  createVehicleTestData,
  updateVehicleTestData,
  createTestUser,
  deleteTestUser,
  getAccessToken,
  createTestVehice,
  createTestScheduledServiceType,
  createScheduledServiceInstanceTestData,
} from './test.utils';
import { User } from '@prisma/client';
import { Server } from 'http';
import {
  createScheduledServiceInstances,
  findVehicleScheduledServiceInstances,
} from '../services/scheduledServiceInstanceService';

jest.setTimeout(100 * 1000);

const createScheduledServiceTypeTestData = {
  name: 'Oil Change (test)',
};

describe('Scheduled Service Instance Routes', () => {
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

  it('Can create scheduled service instance', async () => {
    const vehicle = await createTestVehice(user.id, createVehicleTestData);
    const scheduledServiceType1 = await createTestScheduledServiceType(
      user.id,
      createScheduledServiceTypeTestData.name
    );
    const scheduledServiceType2 = await createTestScheduledServiceType(
      user.id,
      `${createScheduledServiceTypeTestData.name} 2`
    );
    const payload = [
      { ...createScheduledServiceInstanceTestData, scheduledServiceTypeId: scheduledServiceType1?.id },
      { ...createScheduledServiceInstanceTestData, scheduledServiceTypeId: scheduledServiceType2?.id },
    ];
    const res = await request(AutoHubServer.getApp())
      .post(`/api/users/${user.id}/vehicles/${vehicle?.id}/scheduledServiceInstances`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload);
    expect(res.ok).toEqual(true);
    expect(res.body.length).toEqual(2);
  });

  it('Can update scheduled service instance', async () => {
    const vehicle = await createTestVehice(user.id, createVehicleTestData);
    const scheduledServiceType = await createTestScheduledServiceType(
      user.id,
      `${createScheduledServiceTypeTestData.name} 3`
    );
    const payload = {
      ...createScheduledServiceInstanceTestData,
      scheduledServiceTypeId: scheduledServiceType?.id as string,
    };
    await createScheduledServiceInstances(vehicle?.id as string, user.id, [payload]);
    const scheduledServiceInstances = await findVehicleScheduledServiceInstances(vehicle?.id as string, user.id);
    const scheduledServiceInstance = scheduledServiceInstances.find((s) => s.vehicleId === vehicle?.id);
    payload.mileInterval = 7000;
    payload.timeInterval = 7;
    payload.scheduledServiceTypeId = 'blah';
    const res = await request(AutoHubServer.getApp())
      .put(`/api/users/${user.id}/vehicles/${vehicle?.id}/scheduledServiceInstances/${scheduledServiceInstance?.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload);
    expect(res.ok).toEqual(true);
    expect(res.body.mileInterval).toEqual(7000);
    expect(res.body.timeInterval).toEqual(7);
    expect(res.body.timeUnits).toEqual('MONTH');
    expect(res.body.scheduledServiceTypeId).toEqual(scheduledServiceType?.id);
  });

  it('Can get scheduled service instances', async () => {
    const vehicle = await createTestVehice(user.id, createVehicleTestData);
    const scheduledServiceType = await createTestScheduledServiceType(
      user.id,
      `${createScheduledServiceTypeTestData.name} 4`
    );
    const payload = {
      ...createScheduledServiceInstanceTestData,
      scheduledServiceTypeId: scheduledServiceType?.id as string,
    };
    await createScheduledServiceInstances(vehicle?.id as string, user.id, [payload]);
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles/${vehicle?.id}/scheduledServiceInstances`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Can delete scheduled service instance', async () => {
    const vehicle = await createTestVehice(user.id, createVehicleTestData);
    const scheduledServiceType = await createTestScheduledServiceType(
      user.id,
      `${createScheduledServiceTypeTestData.name} 5`
    );
    const payload = {
      ...createScheduledServiceInstanceTestData,
      scheduledServiceTypeId: scheduledServiceType?.id as string,
    };
    await createScheduledServiceInstances(vehicle?.id as string, user.id, [payload]);
    let scheduledServiceInstances = await findVehicleScheduledServiceInstances(vehicle?.id as string, user.id);
    const scheduledServiceInstance = scheduledServiceInstances.find((s) => s.vehicleId === vehicle?.id);
    const res = await request(AutoHubServer.getApp())
      .delete(`/api/users/${user.id}/vehicles/${vehicle?.id}/scheduledServiceInstances/${scheduledServiceInstance?.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    scheduledServiceInstances = await findVehicleScheduledServiceInstances(vehicle?.id as string, user.id);
    const deletedScheduledServiceInstance = scheduledServiceInstances.find(
      (s) => s.id === scheduledServiceInstance?.id
    );
    expect(deletedScheduledServiceInstance).toBeUndefined();
  });
});
