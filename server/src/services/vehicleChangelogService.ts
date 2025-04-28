import * as vehicleChangelogModel from '../models/vehicleChangelog';
import APIError from '../errors/APIError';
import { ACTION, ChangelogPayload, ChangelogPayloadWithUser, SUBJECT, UpdatedProperty } from '../types/changelog';
import { checkIfCanAccessVehicle } from './vehicleService';
import { getUser } from './userService';
import { Vehicle } from '@prisma/client';

export const createVehicleChangelog = async (vehicle: Vehicle, userId: string, payload: ChangelogPayload) => {
  try {
    const { action, subject, subjectName } = payload;
    if (!userId || !vehicle || !action || !subject || !subjectName) {
      return;
    }

    const user = await getUser({ id: userId });

    if (!user) {
      throw new APIError('No user found', 404);
    }

    const description = formatChangelog({ user: user.username, ...payload });
    await vehicleChangelogModel.default.createVehicleChangelog(vehicle.id, userId, description);

    console.log(description);
  } catch (error) {
    // TODO: Log this error
  }
};

export const findVehicleChangelog = async (vehicleId: string, userId: string) => {
  if (!userId) {
    throw new APIError('No userId provided', 400);
  }
  if (!vehicleId) {
    throw new APIError('No vehicleId provided', 400);
  }

  const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);
  const changelog = await vehicleChangelogModel.default.getVehicleChangelog(vehicle.id);

  return changelog;
};

// The 'user' parameter should be the name of the user
export const formatChangelog = (payload: ChangelogPayloadWithUser): string => {
  const { user, action, subject, subjectName } = payload;
  const defaultDescription = `${user} ${action} ${subject} ${subjectName}`;

  switch (action) {
    case ACTION.SHARED:
      return `${user} ${action} ${subject} ${subjectName} with ${payload.targetName}`;
    case ACTION.APPLIED:
      return `${user} ${action} ${subject} ${subjectName} to ${payload.targetName}`;
    case ACTION.UPDATED:
      const { updatedProperties } = payload;
      if (!Array.isArray(updatedProperties) || updatedProperties.length === 0) {
        return defaultDescription;
      }

      let i = 0;
      let updatedDescription = `${formatUpdatedProperty(updatedProperties[i++])}`;
      for (i; i < updatedProperties.length; i++) {
        const formatted = formatUpdatedProperty(updatedProperties[i]);
        if (formatted) {
          updatedDescription = `${updatedDescription}, ${formatted}`;
        }
      }
      return `${defaultDescription}. Updated values = ${updatedDescription}`;
    default:
      return defaultDescription;
  }
};

const formatUpdatedProperty = (property: UpdatedProperty) => {
  const propertyName = property.property;
  const value = property.value;

  if (!propertyName || !value) {
    return '';
  }

  return `${propertyName}: ${value}`;
};
