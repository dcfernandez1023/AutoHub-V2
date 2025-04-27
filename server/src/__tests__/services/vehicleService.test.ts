import { db } from '../../database/database';
import { buildStorageFileUrl, getSupabaseClient } from '../../supabase/supabase';
import { CreateOrUpdateVehicleRequest } from '../../types/vehicle';
import { createVehicle, findVehicle, findVehicles, removeVehicle, updateVehicle } from '../../services/vehicleService';
import { Vehicle, VehicleShare } from '@prisma/client';
import APIError from '../../errors/APIError';

const mockUserId = '5282fc15-73f1-422d-ac21-045a7470c201';
const mockVehicleId = 'acbec8b1-f65b-49b2-80e1-424dd1d688bd';
const mockVehicle: Vehicle = {
  id: mockVehicleId,
  userId: mockUserId,
  name: 'name',
  mileage: 1000,
  year: 2025,
  make: 'make',
  model: 'model',
  licensePlate: 'licensePlate',
  vin: 'vin',
  notes: 'notes',
  // @ts-ignore
  dateCreated: new Date().getTime(),
  base64Image: 'base64Image',
};

// Mock the db module
jest.mock('../../database/database', () => ({
  db: {
    vehicle: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    vehicleShare: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    vehicleChhangelog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    vehicleAttachment: {
      findMany: jest.fn(),
    },
  },
}));

// Mock Supabase Client
jest.mock('../../supabase/supabase', () => ({
  getSupabaseClient: jest.fn().mockReturnValue({
    storage: {
      from: jest.fn().mockReturnValue({
        remove: jest.fn().mockReturnValue({ error: null }),
      }),
    },
  }),
  buildStorageFileUrl: jest.fn().mockReturnValue('some/mock/storage/url'),
}));

describe('vehicleService tests', () => {
  describe('createVehicle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can create vehicle', async () => {
      const mockRequest: CreateOrUpdateVehicleRequest = {
        name: 'name',
        mileage: 1000,
        year: 2025,
        make: 'make',
        model: 'model',
        licensePlate: 'licensePlate',
        vin: 'vin',
        notes: 'notes',
        dateCreated: new Date().getTime(),
        base64Image: 'base64Image',
      };

      (db.vehicle.create as jest.Mock).mockResolvedValue(mockVehicle);

      const vehicle = await createVehicle(mockUserId, mockRequest);
      expect(vehicle).toEqual(mockVehicle);
    });
  });

  describe('updateVehicle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can update vehicle', async () => {
      const mockRequest: CreateOrUpdateVehicleRequest = {
        name: 'updated name',
        mileage: 1000,
        year: 2025,
        make: 'make',
        model: 'model',
        licensePlate: 'licensePlate',
        vin: 'vin',
        notes: 'notes',
        dateCreated: new Date().getTime(),
        base64Image: 'base64Image',
      };
      // @ts-ignore ignoring bigint conversion
      const mockUpdatedVehicle: Vehicle = {
        ...mockRequest,
        id: mockVehicleId,
        userId: mockUserId,
      };

      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicle.update as jest.Mock).mockResolvedValue(mockUpdatedVehicle);

      const vehicle = await updateVehicle(mockVehicleId, mockUserId, mockRequest);
      expect(vehicle).toEqual(mockUpdatedVehicle);
    });

    test('can update vehicle that is shared', async () => {
      const mockRequest: CreateOrUpdateVehicleRequest = {
        name: 'updated name',
        mileage: 1000,
        year: 2025,
        make: 'make',
        model: 'model',
        licensePlate: 'licensePlate',
        vin: 'vin',
        notes: 'notes',
        dateCreated: new Date().getTime(),
        base64Image: 'base64Image',
      };
      const mockUserSharedWithVehicle = '5282fc15-73f1-422d-ac21-045a7470c201-some-user-with-permission';

      // @ts-ignore ignoring bigint conversion
      const mockUpdatedVehicle: Vehicle = {
        ...mockRequest,
        id: mockVehicleId,
        userId: mockUserSharedWithVehicle,
      };
      const mockVehicleShare: VehicleShare = {
        id: 'a7e00100-cb28-4584-93cc-7bf5daf0f0bd',
        userId: mockUserSharedWithVehicle,
        vehicleId: mockVehicleId,
      };

      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicle.update as jest.Mock).mockResolvedValue(mockUpdatedVehicle);
      (db.vehicleShare.findFirst as jest.Mock).mockResolvedValue(mockVehicleShare); // Mock that there's no vehicle shared for the user

      const vehicle = await updateVehicle(mockVehicleId, mockUserSharedWithVehicle, mockRequest);
      expect(vehicle).toEqual(mockUpdatedVehicle);
    });

    test('throws error if user cannot access vehicle', async () => {
      const mockRequest: CreateOrUpdateVehicleRequest = {
        name: 'updated name',
        mileage: 1000,
        year: 2025,
        make: 'make',
        model: 'model',
        licensePlate: 'licensePlate',
        vin: 'vin',
        notes: 'notes',
        dateCreated: new Date().getTime(),
        base64Image: 'base64Image',
      };
      const mockUserIdWithoutPermission = '5282fc15-73f1-422d-ac21-045a7470c201-some-user-without-permission';

      // @ts-ignore ignoring bigint conversion
      const mockUpdatedVehicle: Vehicle = {
        ...mockRequest,
        id: mockVehicleId,
        userId: mockUserIdWithoutPermission,
      };

      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicle.update as jest.Mock).mockResolvedValue(mockUpdatedVehicle);
      (db.vehicleShare.findFirst as jest.Mock).mockResolvedValue(null); // Mock that there's no vehicle shared for the user

      const testFunc = async () => await updateVehicle(mockVehicleId, mockUserIdWithoutPermission, mockRequest);
      await expect(testFunc()).rejects.toThrow(APIError);
    });
  });

  describe('findVehicles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can find vehicles', async () => {
      const mockedVehicles = [
        '3b6d3512-095d-4cae-b862-9a84714bdab2',
        'bf6a5431-17f9-410f-9834-b2ae4d2319d6',
        '21dfb586-423f-4a70-9a1c-65179f409abf',
      ].map((mockId) => {
        const vehicle = JSON.parse(JSON.stringify(mockVehicle));
        vehicle.id = mockId;
        return vehicle;
      });

      (db.vehicle.findMany as jest.Mock).mockResolvedValue(mockedVehicles);

      const vehicles = await findVehicles(mockUserId);
      expect(vehicles).toEqual(mockedVehicles);
    });
  });

  describe('findVehicle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can find vehicle', async () => {
      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);

      const vehicle = await findVehicle(mockVehicleId, mockUserId);
      expect(vehicle).toEqual(mockVehicle);
    });

    test('throws error if user cannot access vehicle', async () => {
      const mockUserIdWithoutPermission = '5282fc15-73f1-422d-ac21-045a7470c201-some-user-without-permission';

      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicleShare.findFirst as jest.Mock).mockResolvedValue(null); // Mock that there's no vehicle shared for the user

      const testFunc = async () => await findVehicle(mockVehicleId, mockUserIdWithoutPermission);
      await expect(testFunc()).rejects.toThrow(APIError);
    });
  });

  describe('removeVehicle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can remove vehicle', async () => {
      (db.vehicle.findFirst as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicle.delete as jest.Mock).mockResolvedValue(mockVehicle);
      (db.vehicleAttachment.findMany as jest.Mock).mockResolvedValue([]);

      const vehicle = await removeVehicle(mockVehicleId, mockUserId);
      expect(vehicle).toEqual(mockVehicle);
    });
  });

  describe('findSharedVehicles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('can find shared vehicles', async () => {
      const mockedVehicles = [
        '3b6d3512-095d-4cae-b862-9a84714bdab2',
        'bf6a5431-17f9-410f-9834-b2ae4d2319d6',
        '21dfb586-423f-4a70-9a1c-65179f409abf',
      ].map((mockId) => {
        const vehicle = JSON.parse(JSON.stringify(mockVehicle));
        vehicle.id = mockId;
        return vehicle;
      });

      (db.vehicle.findMany as jest.Mock).mockResolvedValue(mockedVehicles);

      const vehicles = await findVehicles(mockUserId);
      expect(vehicles).toEqual(mockedVehicles);
    });
  });
});
