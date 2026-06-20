class MongoWorkflowRepository {
  constructor(options) {
    this.uri = options.uri;
    this.dbName = options.dbName;
    this.client = null;
  }

  async collection() {
    if (!this.client) {
      const { MongoClient } = require("mongodb");
      this.client = new MongoClient(this.uri);
      await this.client.connect();
    }
    return this.client.db(this.dbName).collection("workflow_records");
  }

  async save(record) {
    const collection = await this.collection();
    await collection.insertOne(record);
    return record;
  }

  async findById(id) {
    const collection = await this.collection();
    return collection.findOne({ id }, { projection: { _id: 0 } });
  }
}

module.exports = { MongoWorkflowRepository };
