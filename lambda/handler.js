const { createWorkflowEngine } = require("../backend/src/workflowEngine");

const memory = [];
const repository = {
  async save(record) {
    memory.push(record);
    return record;
  },
  async findById(id) {
    return memory.find((record) => record.id === id) || null;
  }
};

const engine = createWorkflowEngine({ repository });

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body || "{}") : event.body || {};
    const record = await engine.createWorkflow(body);
    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record)
    };
  } catch (error) {
    const statusCode = error.code === "VALIDATION_ERROR" ? 400 : 500;
    return {
      statusCode,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: error.code || "LAMBDA_ERROR", detail: error.message })
    };
  }
};
