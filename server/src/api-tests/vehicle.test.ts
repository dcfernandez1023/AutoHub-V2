import request from 'supertest';

import AutoHubServer from '../index';
import {
  createVehicleTestData,
  updateVehicleTestData,
  createTestUser,
  deleteTestUser,
  getAccessToken,
} from './test.utils';
import { User } from '@prisma/client';
import { Server } from 'http';
import { createVehicle, updateVehicle } from '../services/vehicleService';

jest.setTimeout(100 * 1000);

describe('Vehicle routes', () => {
  let user: User;
  let sharedUser: User;
  let accessToken: string | null;
  let sharedUserAccessToken: string | null;
  let server: Server | null = null;

  beforeAll(async () => {
    server = AutoHubServer.getServer();
    user = await createTestUser('autohub-tester', 'autohub-tester@email.com');
    sharedUser = await createTestUser('vehicle-share-user', 'vehicle-share-user@email.com');
    accessToken = await getAccessToken(user.id, user.email, user.username);
    sharedUserAccessToken = await getAccessToken(sharedUser.id, sharedUser.email, user.username);
  });

  afterAll(async () => {
    try {
      await deleteTestUser(user.id);
      await deleteTestUser(sharedUser.id);
    } catch (error) {
      console.error(error);
    }
    server?.close(() => {
      server?.closeAllConnections();
    });
  });

  it('Can create vehicle', async () => {
    const res = await request(AutoHubServer.getApp())
      .post(`/api/users/${user.id}/vehicles`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createVehicleTestData);
    expect(res.ok).toEqual(true);
    expect(res.body).toEqual(expect.objectContaining(createVehicleTestData));
  });

  it('Can update vehicle', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const res = await request(AutoHubServer.getApp())
      .put(`/api/users/${user.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateVehicleTestData);
    expect(res.ok).toEqual(true);
    expect(res.body).toEqual(expect.objectContaining(updateVehicleTestData));
  });

  it('Can get user vehicles', async () => {
    await createVehicle(user.id, createVehicleTestData);
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Can get vehicle', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body).toEqual(expect.objectContaining(createVehicleTestData));
  });

  it('Cannot get vehicle that is not shared', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${sharedUser.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${sharedUserAccessToken}`);
    expect(res.status).toEqual(403);
  });

  it('Can share vehicle', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const createShareRes = await request(AutoHubServer.getApp())
      .post(`/api/users/${user.id}/vehicles/${vehicle.id}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userId: sharedUser.id });
    expect(createShareRes.ok).toEqual(true);
    expect(createShareRes.body.id).toBeDefined();
    expect(createShareRes.body.userId).toEqual(sharedUser.id);
    expect(createShareRes.body.vehicleId).toEqual(vehicle.id);

    const getShareRes = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles/${vehicle.id}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userId: sharedUser.id });
    expect(getShareRes.ok).toEqual(true);
    expect(getShareRes.body.id).toBeDefined();
    expect(getShareRes.body.userId).toEqual(sharedUser.id);
    expect(getShareRes.body.vehicleId).toEqual(vehicle.id);

    const getVehicleRes = await request(AutoHubServer.getApp())
      .get(`/api/users/${sharedUser.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${sharedUserAccessToken}`);
    expect(getVehicleRes.ok).toEqual(true);
    expect(getVehicleRes.body).toEqual(expect.objectContaining(createVehicleTestData));

    const getSharedVehiclesRes = await request(AutoHubServer.getApp())
      .get(`/api/users/${sharedUser.id}/vehicles`)
      .query({ shared: 'true' })
      .set('Authorization', `Bearer ${sharedUserAccessToken}`);
    console.log(getSharedVehiclesRes.status);
    console.log(getSharedVehiclesRes.body);
    expect(getSharedVehiclesRes.ok).toEqual(true);
    expect(getSharedVehiclesRes.body.length).toBeGreaterThan(0);

    const deleteShareRes = await request(AutoHubServer.getApp())
      .delete(`/api/users/${user.id}/vehicles/${vehicle.id}/share`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ userId: sharedUser.id });
    expect(deleteShareRes.ok).toEqual(true);

    const getSharedVehicleRes = await request(AutoHubServer.getApp())
      .get(`/api/users/${sharedUser.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${sharedUserAccessToken}`);
    expect(getSharedVehicleRes.status).toEqual(403);
  });

  it('Can get vehicle changelog', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const updatedVehicle = await updateVehicle(vehicle.id, user.id, updateVehicleTestData);
    expect(updatedVehicle).toEqual(expect.objectContaining(updateVehicleTestData));
    const res = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles/${vehicle.id}/changelog`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.ok).toEqual(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Can delete vehicle', async () => {
    const vehicle = await createVehicle(user.id, createVehicleTestData);
    const deleteVehicleRes = await request(AutoHubServer.getApp())
      .delete(`/api/users/${user.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(deleteVehicleRes.status);
    console.log(deleteVehicleRes.body);
    expect(deleteVehicleRes.ok).toEqual(true);

    const getVehicleRes = await request(AutoHubServer.getApp())
      .get(`/api/users/${user.id}/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(getVehicleRes.status).toEqual(404);
  });
});
