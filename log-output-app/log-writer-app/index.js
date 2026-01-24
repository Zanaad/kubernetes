const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const LOG_FILE = process.env.LOG_FILE || "/var/log/shared/log.txt";
const WRITE_INTERVAL_MS = 5000;
const randomString = uuidv4();

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function appendLogLine() {
  const timestamp = new Date().toISOString();
  const line = `${timestamp}: ${randomString}\n`;
  try {
    await ensureDirectoryExists(LOG_FILE);
    await fs.appendFile(LOG_FILE, line, "utf8");
    console.log(`wrote -> ${line.trim()}`);
  } catch (err) {
    console.error("Failed to write log line", err);
  }
}

console.log(`Log writer starting. Random string: ${randomString}`);
console.log(`Writing every ${WRITE_INTERVAL_MS / 1000}s to ${LOG_FILE}`);

appendLogLine();
setInterval(appendLogLine, WRITE_INTERVAL_MS);
