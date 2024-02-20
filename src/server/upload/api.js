import { Router } from 'express';
import multer from 'multer';
import controller from './controller';

const router = Router({ mergeParams: true });
const upload = multer({ dest: 'www/uploads', preservePath: true, limits: { fieldSize: 100 * 1024 * 1024 } });

export default ({ requestHandler: handler, verifyToken, ...services }) => {
  const {
    uploadController,
  } = controller(services);

  router.post('/', upload.any(), handler(uploadController)); // tested

  return router;
};
