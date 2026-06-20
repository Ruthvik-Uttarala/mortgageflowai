const http = require("http");
const { URL } = require("url");
const { createWorkflowEngine } = require("./workflowEngine");
const { createRepository } = require("./repositories");

const repository = createRepository();
const engine = createWorkflowEngine({ repository });

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function send(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") return send(response, 204, {});
    const url = new URL(request.url, "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      return send(response, 200, { ok: true, service: "mortgageflowai-backend" });
    }

    if (request.method === "POST" && url.pathname === "/workflows") {
      const body = await readJson(request);
      const result = await engine.createWorkflow(body);
      return send(response, 201, result);
    }

    if (request.method === "GET" && url.pathname.startsWith("/workflows/")) {
      const id = url.pathname.split("/").pop();
      const record = await repository.findById(id);
      return record ? send(response, 200, record) : send(response, 404, { error: "workflow_not_found" });
    }

    return send(response, 404, { error: "not_found" });
  } catch (error) {
    return send(response, 500, { error: "internal_error", detail: error.message });
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT || 4000);
  server.listen(port, () => {
    console.log(`MortgageFlowAI backend listening on ${port}`);
  });
}

module.exports = { server };
