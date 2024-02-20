import { Router } from 'express';
import controller from './controller';

const router = Router({ mergeParams: true });

export default ({ requestHandler: handler, verifyToken, ...services }) => {
  const {
    login,
    register,
    deleteUser,
  } = controller(services);

  router.post('/login', handler(login)); // tested
  router.post('/register', handler(register)); // tested

  router.delete('/delete-account', verifyToken, handler(deleteUser)); // tested

  return router;
};
