import fs from "node:fs";
import path from "node:path";

const DEFAULT_STORE_PATH = path.join(process.cwd(), ".data", "completions.json");

export class CompletionStore {
  constructor(filePath = process.env.NIMQUEST_COMPLETION_STORE || DEFAULT_STORE_PATH) {
    this.filePath = filePath;
    this.records = new Map();
    this.load();
  }

  has(key) {
    return this.records.has(key);
  }

  get(key) {
    return this.records.get(key);
  }

  set(key, value) {
    this.records.set(key, value);
    this.save();
  }

  clear() {
    this.records.clear();
    this.save();
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      return;
    }

    const raw = fs.readFileSync(this.filePath, "utf8");

    if (!raw.trim()) {
      return;
    }

    const parsed = JSON.parse(raw);
    this.records = new Map(Object.entries(parsed.completions || {}));
  }

  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });

    const payload = JSON.stringify(
      {
        version: 1,
        updatedAt: new Date().toISOString(),
        completions: Object.fromEntries(this.records)
      },
      null,
      2
    );

    const tempPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tempPath, payload);
    fs.renameSync(tempPath, this.filePath);
  }
}
