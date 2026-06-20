db.createCollection("workflow_records", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "createdAt", "input", "recommendation"],
      properties: {
        id: { bsonType: "string" },
        createdAt: { bsonType: "string" },
        input: {
          bsonType: "object",
          required: ["role", "loanType", "documentState", "emotion"],
          properties: {
            role: { enum: ["borrower", "loan_officer", "realtor"] },
            loanType: { bsonType: "string" },
            documentState: { enum: ["complete", "incomplete"] },
            emotion: { enum: ["anxious", "confused", "urgent", "confident", "frustrated"] }
          }
        },
        recommendation: {
          bsonType: "object",
          required: ["decided", "why", "dataUsed", "dataMissing", "nextAction", "humanEscalation", "fairnessRule"]
        }
      }
    }
  }
});

db.workflow_records.createIndex({ id: 1 }, { unique: true });
db.workflow_records.createIndex({ createdAt: -1 });
db.workflow_records.createIndex({ "input.role": 1, "input.loanType": 1 });
