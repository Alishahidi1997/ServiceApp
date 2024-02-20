import { FPGrowth } from 'node-fpgrowth';
import _ from 'lodash';

/* eslint-disable no-underscore-dangle */
const requestService = ({ dataRepository, logger }) => {
  const repo = dataRepository('requests');
  const rulesRepo = dataRepository('rules');

  const findRequested = async (clientId) => {
    const filter = { 'resource.userId': clientId };

    const lookups = [
      {
        $lookup: {
          from: 'users', localField: 'consumerId', foreignField: '_id', as: 'consumer',
        },
      },
      {
        $unwind: '$consumer',
      },
      {
        $lookup: {
          from: 'resources', localField: 'resourceId', foreignField: '_id', as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
    ];

    const project = { 'consumer.hashedPassword': false };

    const result = await repo.aggregate(filter, project, lookups);

    return result;
  };

  const createRequest = async (consumerId, { resourceId, title }) => {
    logger.info('Checking for duplicate request..');
    const match = await repo.findOne({ consumerId, resourceId, status: 'pending' });
    if (match) throw new Error('ERR_DUPLICATE_REQUEST');

    if (!(consumerId && resourceId && title)) throw new Error('ERR_INVALID_INPUT');

    const newRequest = {
      consumerId,
      resourceId,
      title,
      status: 'pending',
      createDate: new Date().getTime(),
    };

    const { insertedId } = await repo.create(newRequest);

    const result = {
      _id: insertedId,
      ...newRequest,
    };

    return result;
  };

  const approveRequest = async (clientId, resourceId, consumerId) => {
    const filter = {
      resourceId, consumerId, 'resource.userId': clientId, status: { $ne: 'approved' },
    };
    logger.info('Checking permission to approve..');

    const lookups = [
      {
        $lookup: {
          from: 'resources', localField: 'resourceId', foreignField: '_id', as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
    ];

    const permit = await repo.aggregate(filter, null, lookups);
    if (!(permit && permit[0])) throw new Error('ERR_PERMISSION_DENIED');

    const update = { status: 'approved', approveDate: new Date().getTime() };

    const result = await repo.update({ _id: permit[0]._id }, update);
    const { matchedCount } = result;
    if (matchedCount === 0) throw new Error('ERR_UPDATE_FAILED');
  };

  const addComment = async (consumerId, resourceId, { comment, rate }) => {
    const filter = {
      resourceId,
      consumerId,
      status: 'approved',
      comment: { $exists: false },
      rate: { $exists: false },
    };
    logger.info('Checking permission to comment..');

    const permit = await repo.findOne(filter, { _id: true });
    if (!permit) throw new Error('ERR_PERMISSION_DENIED');

    if (!(comment && rate) || (rate > 10) || (rate < 0)) throw new Error('ERR_INVALID_INPUT');
    const update = { comment, rate, commentDate: new Date().getTime() };

    const result = await repo.update({ _id: permit._id }, update);
    const { matchedCount } = result;
    if (matchedCount === 0) throw new Error('ERR_UPDATE_FAILED');
  };

  const generateRules = async () => {
    logger.info('Generating rules...');
    const groups = [
      {
        $group: {
          _id: '$consumerId',
          resources: { $addToSet: '$resourceId' },
          // resourceTypes: { $addToSet: '$title' },
        },
      },
      // {
      //   $match: { rate: { $gte: 8 } },
      // },
    ];

    const result = await repo.aggregate({}, null, groups);
    const transactions = result.map((i) => (i.resources));
    const fpgrowth = new FPGrowth(0.4);
    const itemsets = await fpgrowth.exec(transactions);

    const rules = [];
    itemsets.forEach(({ items, support }) => {
      items.forEach((_item, index) => {
        if (index > items.length - 2) return;
        const x = items.slice(0, index + 1);
        const y = items.slice(index + 1);

        let supportX = 0;
        let supportY = 0;
        transactions.forEach((t) => {
          if (x.every((val) => t.includes(val))) supportX += 1;
          if (y.every((val) => t.includes(val))) supportY += 1;
        });
        supportX /= transactions.length;
        supportY /= transactions.length;

        const rule1 = {
          x,
          y,
          support,
          confidence: support / supportX,
        };
        const rule2 = {
          x: y,
          y: x,
          support,
          confidence: support / supportY,
        };
        if (rule1.confidence >= 0.4) rules.push(rule1);
        if (rule2.confidence >= 0.4) rules.push(rule2);
      });
    });
    rules.sort((a, b) => a.support - b.support);
    if (rules.length !== 0) {
      const newItem = { createDate: new Date().getTime(), rules };
      await rulesRepo.create(newItem);
    }
    return rules;
  };

  const getRecommendation = async (consumerId) => {
    let rules;
    let latest = await rulesRepo.aggregate({}, null, [{ $group: { _id: null, latestDate: { $max: '$createDate' } } }]);
    latest = latest && latest[0];
    if (latest) {
      if ((new Date().getTime() - latest.latestDate) > 24 * 60 * 60 * 1000) {
        generateRules()
          .then(() => logger.info('rules updated successfully'))
          .catch((err) => logger.info(`updating rules failed: ${err.message}`));
      }
      latest = await rulesRepo.findOne({ createDate: latest.latestDate });
      rules = latest.rules || [];
    } else {
      rules = await generateRules();
    }
    const result2 = await repo.distinct('resourceId', { consumerId });
    const recommendations = [];

    rules.forEach((rule) => {
      if (_.difference(rule.x, result2).length === 0) {
        recommendations.push(...rule.y);
      }
    });

    return _.uniq(recommendations);

    // Object.values(itemsets).forEach((i) => {
    //   const diff = _.difference(i.items, result2) || [];
    //   if (diff.length === 1) {
    //     missing.push(...diff);
    //   }
    // });

    // const itemsets2 = result2.reduce((r, e) => {
    //   // eslint-disable-next-line no-param-reassign
    //   r[e.resourceId] = (r[e.resourceId] || 0) + 1;
    //   return r;
    // }, {});
    // const itemsets2 = _.groupBy(result2, 'resourceId');
    // return missing;
  };

  return {
    findRequested,
    createRequest,
    approveRequest,
    addComment,
    getRecommendation,
  };
};

export default requestService;
