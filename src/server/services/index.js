import './env';
import logger from './logger';
import { createDb } from './database';
import { createRepo } from './repo';
import verifyToken, { createToken } from './verifyToken';
import requestHandler from './requestHandler';

import UserService from '../users/service';
import ResourceService from '../resources/service';
import RequestService from '../requests/service';

const db = createDb(
  process.env.MONGO_URL,
  process.env.MONGO_DB,
);
const dataRepository = (name) => createRepo(db, name);

const sharedServices = {
  dataRepository,
  logger,
  verifyToken,
  createToken,
  requestHandler,
};

export default {
  ...sharedServices,
  // authService: AuthService({ ...sharedServices }),
  userService: UserService({ ...sharedServices }),
  resourceService: ResourceService({ ...sharedServices }),
  requestService: RequestService({ ...sharedServices }),
};
