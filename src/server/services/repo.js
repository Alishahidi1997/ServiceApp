import { ObjectId } from 'mongodb';

const getObjectId = () => {
  const objectId = new ObjectId();
  return objectId.toHexString();
};

class Repository {
  constructor(data, collection) {
    this.data = data;
    this.collection = collection;
  }

  async db() {
    if (!this.database) {
      this.database = await this.data.getDb();
    }
    return this.database.collection(this.collection);
  }

  // tested
  async create(item) {
    const newItem = {
      ...item,
      _id: getObjectId(),
    };
    const db = await this.db();
    const result = await db.insertOne(newItem);
    return result;
  }

  // tested
  async createIfNotExist(filter, item) {
    const existing = await this.findOne(filter, {});
    if (existing) return existing;
    const newItem = {
      ...item,
      _id: getObjectId(),
    };
    const db = await this.db();
    await db.insertOne(newItem);
    return newItem;
  }

  // tested
  async createOrUpdate(filter, item) {
    const existing = await this.findOne(filter, {});
    if (existing) {
      await this.update(filter, item);
      return existing;
    }
    const newItem = {
      ...item,
      _id: getObjectId(),
    };
    const db = await this.db();
    await db.insertOne(newItem);
    return newItem;
  }

  // tested
  async createMany(items) {
    if (items.length === 0) return null;
    const newItems = items.map((item) => ({
      ...item,
      _id: getObjectId(),
    }));

    const db = await this.db();
    const result = await db.insertMany(newItems);
    return result;
  }

  // tested
  async find(filter, project) {
    const db = await this.db();
    const result = await db.find(filter).project(project).toArray();
    return result;
  }

  // tested
  async distinct(field, filter) {
    const db = await this.db();
    const result = await db.distinct(field, filter);
    return result;
  }

  // tested
  async findOne(filter, project) {
    const db = await this.db();
    const result = await db.findOne(filter, { projection: project });
    return result;
  }

  // tested
  async findN(filter, project, sort, n) {
    const db = await this.db();
    const result = await db
      .find(filter)
      .project(project)
      .sort(sort)
      .limit(n)
      .toArray();
    return result;
  }

  async aggregate(filter, project, lookups) {
    const db = await this.db();
    const result = await db
      .aggregate([
        ...lookups,
        {
          $match: filter,
        },
      ])
      .project(project || { fakeField: false })
      .toArray();
    return result;
  }

  // tested
  async update(filter, update) {
    const db = await this.db();
    const result = await db.updateMany(filter, { $set: update });
    return result;
  }

  // tested
  async push(filter, update) {
    const db = await this.db();
    const result = await db.updateMany(filter, { $push: update });
    return result;
  }

  async pushMany(filter, update) {
    const db = await this.db();
    const result = await db.updateMany(filter, { $push: update });
    return result;
  }

  // tested
  async pull(filter, update) {
    const db = await this.db();
    const result = await db.updateMany(filter, { $pull: update });
    return result;
  }

  // tested
  async delete(filter) {
    const db = await this.db();
    const result = await db.deleteOne(filter);
    return result;
  }

  // tested
  async deleteMany(filter) {
    const db = await this.db();
    const result = await db.deleteMany(filter);
    return result;
  }

  // tested
  async disconnect() {
    if (this.data && this.data.disconnect) {
      const result = await this.data.disconnect();
      return result;
    }
    return true;
  }
}

export const createRepo = (db, collection) => new Repository(db, collection);

export default Repository;
