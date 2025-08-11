import { User } from '@prisma/client';
import { completeRegistration, getUser, register, removeUser } from '../services/userService';
import { generateJwtToken } from '../services/authService';
import { ROLES } from '../constants';
import { CreateOrUpdateVehicleRequest } from '../types/vehicle';
import { createVehicle } from '../services/vehicleService';
import { createScheduledServiceType } from '../services/scheduledServiceTypeService';
import { CreateScheduledServiceInstanceRequest } from '../types/scheduledServiceInstance';

const testData = {
  password: 'test123', // TODO: Read this from environment var
  baseUrl: 'http://localhost:5000',
};

export const createVehicleTestData: CreateOrUpdateVehicleRequest = {
  name: 'Test Vehicle',
  mileage: 20000,
  year: 2023,
  make: 'Test Make',
  model: 'Test Model',
  licensePlate: 'Test License Plate',
  vin: 'Test Vin',
  notes: 'Test Notes',
};

export const updateVehicleTestData: CreateOrUpdateVehicleRequest = {
  name: 'Test Vehicle (update)',
  mileage: 20000,
  year: 2023,
  make: 'Test Make (update)',
  model: 'Test Model (update)',
  licensePlate: 'Test License Plate (update)',
  vin: 'Test Vin (update)',
  notes: 'Test Notes (update)',
};

export const createScheduledServiceTypeTestData = {
  name: 'Oil Change (test)',
};

export const createScheduledServiceInstanceTestData: CreateScheduledServiceInstanceRequest = {
  mileInterval: 5000,
  timeInterval: 8,
  timeUnits: 'MONTH',
  scheduledServiceTypeId: '',
};

export const createTestUser = async (username: string, email: string): Promise<User> => {
  const { password, baseUrl } = testData;
  const user = await execute(async () => {
    return await getUser({ email });
  });
  console.log('Queried user:', user);

  if (user) return user;

  console.log('No user exists, creating...');
  const newUser = await execute(async () => {
    console.log('Registering user:', email);
    const url = await register({
      username,
      email,
      password,
      baseUrl,
      doNotSendEmail: true,
    });
    console.log('Registered user. Registration link', url);
    const user = await getUser({ email });
    await completeRegistration({ userId: user?.id!, email });
    const registeredUser = await getUser({ email });
    console.log('Completed registration', registeredUser);
    return registeredUser;
  });

  if (newUser) return newUser;

  throw new Error('Failed to create or retrieve existing user');
};

export const deleteTestUser = async (userId: string): Promise<User | null> => {
  const user = await execute<User>(async () => {
    return await removeUser(userId);
  });
  return user;
};

export const createTestVehice = async (userId: string, payload: CreateOrUpdateVehicleRequest) => {
  return await execute(async () => {
    return await createVehicle(userId, payload);
  });
};

export const createTestScheduledServiceType = async (userId: string, payload: string) => {
  return await execute(async () => {
    return await createScheduledServiceType(userId, payload);
  });
};

export const getAccessToken = async (userId: string, email: string, username: string) => {
  const accessToken = await execute<string>(async () => {
    return generateJwtToken(userId, email, username, ROLES.USER_ROLE);
  });
  return accessToken;
};

async function execute<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error('Error executing request:', error);
    return null;
  }
}
