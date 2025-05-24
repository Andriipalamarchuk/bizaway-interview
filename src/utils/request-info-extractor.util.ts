import { LoginResultModel } from '../modules/auth/models/login-result.model';

export function requestInfoExtractor(req: any): LoginResultModel {
  const authHeader = req.headers.authorization.replace('Bearer ', '');
  const authBuffer = Buffer.from(authHeader.split('.')[1], 'base64');
  return JSON.parse(authBuffer.toString());
}