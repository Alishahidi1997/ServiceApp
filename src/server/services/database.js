import { MongoClient } from 'mongodb';



class Database {
  constructor(mongoUrl, dbName) {
    this.dbName = dbName;
    this.mongoUrl = decodeURI(mongoUrl);
  }

  async getDb() {
    try {
      if (!this.db) {
        const client = await MongoClient.connect(
          this.mongoUrl,
          { useNewUrlParser: true, useUnifiedTopology: true },
        );
        this.db = client.db(this.dbName);
      }
      console.log("dbbbb is connected");
      return this.db;
    } catch (err) {
      throw new Error(`Error connecting to database:: ${err.message} -- ${this.mongoUrl}`);
    }
  }
}


export const createDb = (mongoUrl, dbName) => new Database(mongoUrl, dbName);

export default Database;
