import { Request, Response } from 'express';
import { handleError } from './utils';
import { getRegisteredUser, login } from '../services/userService';
import { generateJwtToken } from '../services/authService';
import { ROLES } from '../constants';

export const getToken = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await login({ email, password });
    const token = generateJwtToken(user.id, user.email, ROLES.USER_ROLE);
    res.status(200).json({ accessToken: token });
  } catch (error) {
    handleError(res, error as Error);
  }
};
