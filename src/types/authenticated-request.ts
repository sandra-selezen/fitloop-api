import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface LocalUser {
  _id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface LocalAuthRequest extends Request {
  user: LocalUser;
}
