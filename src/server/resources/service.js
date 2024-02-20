/* eslint-disable no-underscore-dangle */
import resourceList, { professionalResourceList } from './resourceTypes';

const ResourceService = ({ dataRepository, logger }) => {
  const repo = dataRepository('resources');

  const getResourceTypes = () => ([...resourceList]);

  const getAverage = (comments) => {
    let sum = 0;
    comments.forEach((c) => { sum += c.rate; });
    return comments.length === 0 ? null : sum / comments.length;
  };

  const findResources = async (userId) => {
    const filter = { isActive: true, userId: { $ne: userId } };
    const lookups = [
      {
        $lookup: {
          from: 'users', localField: 'userId', foreignField: '_id', as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
    ];

    const projection = { 'client.hashedPassword': false };

    let result = await repo.aggregate(filter, projection, lookups);
    result = result.map((i) => ({ ...i, avgRate: getAverage(i.comments || []) }));
    return result;
  };

  const findManyById = async (ids) => {
    const filter = { isActive: true, _id: { $in: ids } };
    const lookups = [
      {
        $lookup: {
          from: 'users', localField: 'userId', foreignField: '_id', as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
    ];

    const projection = { 'client.hashedPassword': false };

    let result = await repo.aggregate(filter, projection, lookups);
    result = result.map((i) => ({ ...i, avgRate: getAverage(i.comments || []) }));
    return result;
  };

  const findUserResources = async (userId, projection = {}) => {
    const filter = { userId };
    const result = await repo.find(filter, projection);
    return result;
  };

  const findResourceById = async (resourceId, projection = {}) => {
    const filter = { _id: resourceId };
    const result = await repo.findOne(filter, projection);
    return result;
  };

  const createResource = async (userId, resource) => {
    const {
      title, description, isProfessional, cost, location,
      thumbnail,
    } = resource;

    logger.info('Checking for duplicate resources..');
    const match = await repo.findOne({ userId, title });
    if (match) throw new Error('ERR_DUPLICATE_RESOURCE');

    if (!(title && description
      && cost && location
      && (isProfessional !== undefined)
      && (location.lat !== undefined)
      && (location.long !== undefined))) throw new Error('ERR_INVALID_INPUT');

    if (resourceList.indexOf(title) === -1) throw new Error('ERR_INVALID_TITLE');

    if (professionalResourceList.indexOf(title) !== -1
      && isProfessional === false) {
      throw new Error('ERR_PROFESSIONAL_REQUIRED');
    }
    const newResourcce = {
      userId,
      title,
      description,
      cost,
      location,
      isProfessional: Boolean(isProfessional),
      isActive: true,
      thumbnail: thumbnail || process.env.NO_IMAGE_URL,
      createDate: new Date().getTime(),
    };
    const { insertedId } = await repo.create(newResourcce);
    const result = {
      _id: insertedId,
      ...newResourcce,
    };

    return result;
  };

  const setResourceStatus = async (userId, resourceId, isActive) => {
    const update = { isActive: Boolean(isActive), updateDate: new Date().getTime() };
    const filter = { _id: resourceId, userId };
    const result = await repo.update(filter, update);
    const { matchedCount } = result;
    if (matchedCount === 0) throw new Error('ERR_UPDATE_FAILED');

    const newResource = await findResourceById(resourceId);
    return newResource;
  };

  const addComment = async (resourceId, consumer, { comment, rate }) => {
    const update = {
      comments: {
        consumer, comment, rate, commentDate: new Date().getTime(),
      },
    };

    const result = await repo.push({ _id: resourceId }, update);
    const { matchedCount } = result;
    if (matchedCount === 0) throw new Error('ERR_UPDATE_FAILED');
  };

  return {
    getResourceTypes,
    findManyById,
    findResources,
    findUserResources,
    findResourceById,
    createResource,
    setResourceStatus,
    addComment,
  };
};

export default ResourceService;
