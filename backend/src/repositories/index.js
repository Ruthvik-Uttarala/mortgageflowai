const { FileWorkflowRepository } = require("./FileWorkflowRepository");
const { MongoWorkflowRepository } = require("./MongoWorkflowRepository");

function createRepository() {
  if (process.env.MONGODB_URI) {
    return new MongoWorkflowRepository({
      uri: process.env.MONGODB_URI,
      dbName: process.env.MONGODB_DB || "mortgageflowai"
    });
  }

  return new FileWorkflowRepository({
    path: process.env.WORKFLOW_STORAGE_PATH || "backend/data/workflows.local.json"
  });
}

module.exports = { createRepository };
