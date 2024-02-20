/* eslint-disable no-underscore-dangle */
const controller = ({
  logger, resourceService, requestService, userService,
}) => ({
  browseResources: async (req) => {
    try {
      const { userId } = req.query;

      let resources;
      if (userId) {
        logger.info(`Getting all resources of userId: ${userId}.`);
        resources = await resourceService.findUserResources(userId);
      } else {
        logger.info(`Browse resources for ${req.userId}.`);
        resources = await resourceService.findResources(req.userId);
      }

      return resources;
    } catch (err) {
      logger.error(`Getting resources failed. ${err.message}`);
      throw err;
    }
  },

  getMyResources: async (req) => {
    try {
      const { userId } = req;

      logger.info(`Getting all resources of userId: ${userId}.`);
      const resources = await resourceService.findUserResources(req.userId);

      return resources;
    } catch (err) {
      logger.error(`Getting resources failed. ${err.message}`);
      throw err;
    }
  },

  getRecommendations: async (req) => {
    try {
      const { userId } = req;

      logger.info(`Getting recommendations for userId: ${userId}.`);

      const ids = await requestService.getRecommendation(userId);
      const resources = await resourceService.findManyById(ids);

      return resources;
    } catch (err) {
      logger.error(`Getting recommendatinos failed. ${err.message}`);
      throw err;
    }
  },

  getRequestedFromMe: async (req) => {
    try {
      const { userId } = req;

      logger.info(`Getting requested resources from userId: ${userId}.`);
      const resources = await requestService.findRequested(userId);

      return resources;
    } catch (err) {
      logger.error(`Getting requested resources failed. ${err.message}`);
      throw err;
    }
  },

  getResourceTypes: async () => {
    try {
      const resources = await resourceService.getResourceTypes();

      return resources;
    } catch (err) {
      logger.error(`Getting resource types failed. ${err.message}`);
      throw err;
    }
  },

  getResourceDetails: async (req) => {
    try {
      const { resourceId } = req.params;

      logger.info(`Gettting resource details ${resourceId}`);

      const resource = await resourceService.findResourceById(resourceId);

      return resource;
    } catch (err) {
      logger.error(`Getting resource details failed. ${err.message}`);
      throw err;
    }
  },

  createResource: async (req) => {
    try {
      const { userId } = req;

      logger.info('Creating resource...');

      const resource = await resourceService.createResource(userId, req.body);

      return resource;
    } catch (err) {
      logger.error(`Creating resource failed. ${err.message}`);
      throw err;
    }
  },

  deactivateResource: async (req) => {
    try {
      const { resourceId } = req.params;
      const { userId } = req;

      logger.info(`Deactivating resource ${resourceId}`);

      const resource = await resourceService.setResourceStatus(userId, resourceId, false);

      return resource;
    } catch (err) {
      logger.error(`Deactivating resource failed. ${err.message}`);
      throw err;
    }
  },

  activateResource: async (req) => {
    try {
      const { resourceId } = req.params;
      const { userId } = req;

      logger.info(`Activating resource ${resourceId}`);

      const resource = await resourceService.setResourceStatus(userId, resourceId, true);

      return resource;
    } catch (err) {
      logger.error(`Activating resource failed. ${err.message}`);
      throw err;
    }
  },

  requestResource: async (req) => {
    try {
      const { userId: consumerId } = req;
      const { resourceId } = req.params;

      const resource = await resourceService.findResourceById(resourceId);
      if (!resource || !resource.isActive || (consumerId === resource.userId)) throw new Error('ERR_INVALID_RESOURCE');
      const { title } = resource;

      const resources = await requestService.createRequest(consumerId, { resourceId, title });

      return resources;
    } catch (err) {
      logger.error(`Requesting resource failed. ${err.message}`);
      throw err;
    }
  },

  addComment: async (req) => {
    try {
      const { resourceId } = req.params;
      const { userId: consumerId } = req;

      logger.info(`Commenting on request ${resourceId}`);

      await requestService.addComment(consumerId, resourceId, req.body);
      const consumer = await userService.findUserById(consumerId);

      const resource = await resourceService.addComment(resourceId, consumer, req.body);

      return resource;
    } catch (err) {
      logger.error(`Commenting on resource failed. ${err.message}`);
      throw err;
    }
  },

  approveRequest: async (req) => {
    try {
      const { resourceId, consumerId } = req.params;
      const { userId: clientId } = req;

      logger.info(`Approving request for resource ${resourceId} and consumer: ${consumerId}`);

      const resource = await requestService.approveRequest(clientId, resourceId, consumerId);

      return resource;
    } catch (err) {
      logger.error(`Approving request failed. ${err.message}`);
      throw err;
    }
  },
});

export default controller;
