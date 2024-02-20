import { Router } from 'express';
import controller from './controller';

const router = Router({ mergeParams: true });

export default ({ requestHandler: handler, ...services }) => {
  const {
    browseResources,
    getMyResources,
    getRecommendations,
    getRequestedFromMe,
    getResourceTypes,
    // getResourceDetails,
    createResource,

    deactivateResource,
    activateResource,

    requestResource,
    addComment,
    approveRequest,
  } = controller(services);

  router.get('/', handler(browseResources));
  router.get('/mine', handler(getMyResources));
  router.get('/recommendations', handler(getRecommendations));
  router.get('/requested', handler(getRequestedFromMe));
  router.get('/types', handler(getResourceTypes));

  // router.get('/:resourceId', handler(getResourceDetails));

  router.post('/', handler(createResource));

  router.put('/:resourceId/deactivate', handler(deactivateResource));
  router.put('/:resourceId/activate', handler(activateResource));

  router.post('/:resourceId/request', handler(requestResource));
  router.put('/:resourceId/comment', handler(addComment));

  router.put('/:resourceId/:consumerId/approve', handler(approveRequest));

  return router;
};
