import * as vehicleChangelogModel from '../models/vehicleChangelog';
import APIError from '../errors/APIError';
import { ACTION, ChangelogPayload, SUBJECT, UpdatedProperty } from '../types/changelog';
import { checkIfCanAccessVehicle } from './vehicleService';

// <User> <action> <subject> <
export const createVehicleChangelog = async (vehicleId: string, userId: string, payload: ChangelogPayload) => {
  try {
    const { user, action, subject, subjectName } = payload;
    if (!userId || !vehicleId || !user || !action || !subject || !subjectName) {
      return;
    }

    const vehicle = await checkIfCanAccessVehicle(vehicleId, userId);

    const description = formatChangelog(payload);
    await vehicleChangelogModel.default.createVehicleChangelog(vehicle.id, userId, description);
  } catch (error) {
    // TODO: Log this error
  }
};

// The 'user' parameter should be the name of the user
const formatChangelog = (payload: ChangelogPayload): string => {
  const { user, action, subject, subjectName } = payload;
  const defaultDescription = `${user} ${action} ${subject} ${subjectName}`;

  switch (action) {
    case ACTION.SHARED:
      const { targetName } = payload;
      return `${user} ${action} ${subject} with ${targetName}`;
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
          updatedDescription = `, ${formatted}`;
        }
      }
      return `${defaultDescription}. Updated values: ${updatedDescription}`;
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
