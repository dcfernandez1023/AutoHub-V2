import APIError from '../errors/APIError';

type Config = {
  throwIfInvalid?: boolean;
  propertyName?: string;
  statusCode?: number;
};
type NumberConfig = Config & {
  maxSize?: number;
};

export const stringHasValue = (s: string, config?: Config) => {
  const result = typeof s === 'string' && Boolean(s?.trim().length);

  if (!result && config?.throwIfInvalid) {
    const errorMsg = config?.propertyName ? `Invalid value for ${config.propertyName}` : 'Invalid value provided';
    const statusCode = !isNaN(config?.statusCode as number) ? (config.statusCode as number) : 400;
    throw new APIError(errorMsg, statusCode);
  }

  return result;
};

export const isValidNumber = (n: number, config?: NumberConfig) => {
  const isNumber = !isNaN(n);
  const fitsMaxSizeConstraint = config?.maxSize ? n > config.maxSize : true;

  if (!isNumber && config?.throwIfInvalid) {
    const errorMsg = config?.propertyName ? `${config.propertyName} is not a number` : 'Invalid value provided';
    const statusCode = !isNaN(config?.statusCode as number) ? (config.statusCode as number) : 400;
    throw new APIError(errorMsg, statusCode);
  }

  if (!fitsMaxSizeConstraint && config?.throwIfInvalid) {
    const errorMsg = config?.propertyName
      ? `${config.propertyName} exceeds size limit ${config?.maxSize}`
      : 'Value exceeds size limit';
    const statusCode = !isNaN(config?.statusCode as number) ? (config.statusCode as number) : 400;
    throw new APIError(errorMsg, statusCode);
  }

  return isNumber && fitsMaxSizeConstraint;
};
