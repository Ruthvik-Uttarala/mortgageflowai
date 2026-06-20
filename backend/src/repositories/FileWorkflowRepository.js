const fs = require("fs/promises");
const path = require("path");

class FileWorkflowRepository {
  constructor(options) {
    this.path = options.path;
  }

  async readAll() {
    try {
      return JSON.parse(await fs.readFile(this.path, "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async writeAll(records) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(records, null, 2));
  }

  async save(record) {
    const records = await this.readAll();
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async findById(id) {
    const records = await this.readAll();
    return records.find((record) => record.id === id) || null;
  }
}

module.exports = { FileWorkflowRepository };
