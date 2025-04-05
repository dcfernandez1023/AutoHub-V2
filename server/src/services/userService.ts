import { ROLES } from '../constants';
import APIError from '../errors/APIError';
import * as userModel from '../models/user';
import { CompleteRegistrationRequest, LoginRequest, RegisterRequest } from '../types/auth';
import { GetUserRequest } from '../types/user';
import { generateRegistrationToken, verifyPassword } from './authService';
import { sendRegistrationEmail } from './emailService';

export const getUser = async (request: GetUserRequest) => {
  const { id, email } = request;
  let user;
  if (id && email) {
    user = await userModel.default.getUserByEmailAndId(id, email);
  } else if (id) {
    user = await userModel.default.getUserById(id);
  } else if (email) {
    user = await userModel.default.getUserByEmail(email);
  } else {
    throw new APIError('No identifier provided to get user', 400);
  }

  return user;
};

export const getRegisteredUser = async (request: GetUserRequest) => {
  const user = await getUser(request);

  if (!user) {
    throw new APIError('User not found', 404);
  }
  if (user.registered !== 1) {
    throw new APIError('User not registered', 400);
  }

  return user;
};

export const register = async (request: RegisterRequest): Promise<string> => {
  const { email, password, baseUrl } = request;

  if (!email?.trim().length || !password?.trim().length) {
    throw new APIError('Email and password not provided', 400);
  }

  const existingUser = await getUser({ email });
  if (existingUser?.registered === 1) {
    throw new APIError('An account under this email is already registered', 400);
  }

  const user = existingUser ?? (await userModel.default.createUser(email, password, ROLES.USER_ROLE));
  const registrationToken = generateRegistrationToken(user.id, email);
  const completeLink = `${baseUrl}/api/users/register/complete?token=${registrationToken}`;

  await sendRegistrationEmail(email, completeLink);
  return completeLink;
};

export const completeRegistration = async (request: CompleteRegistrationRequest) => {
  const { userId, email } = request;

  if (!userId || !email) {
    throw new APIError('UserId or email not supplied', 400);
  }

  const user = await getUser({ id: userId, email });

  if (!user) {
    throw new APIError('User not found', 404);
  }
  if (user.registered === 1) {
    throw new APIError('User is already registered', 400);
  }

  await userModel.default.registerUser(userId, email);
};

export const login = async (request: LoginRequest) => {
  const { email, password } = request;

  if (!email || !password) {
    throw new APIError('Email or password not supplied', 400);
  }

  const user = await getRegisteredUser({ email });
  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new APIError('Invalid email or password', 400);
  }

  return user;
};
