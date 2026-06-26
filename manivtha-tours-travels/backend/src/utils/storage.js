const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const memoryDb = {};

const getFilePath = (collection) => {
  return path.join(DATA_DIR, `${collection}.json`);
};

const readJSONFile = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return memoryDb[collection] || [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${collection}.json:`, error);
    return memoryDb[collection] || [];
  }
};

const writeJSONFile = (collection, data) => {
  memoryDb[collection] = data;
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not write to disk (${error.message}). Using in-memory storage fallback.`);
  }
};

const storage = {
  save: (collection, data) => {
    const records = readJSONFile(collection);
    const newRecord = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...data,
    };
    records.push(newRecord);
    writeJSONFile(collection, records);
    return newRecord;
  },

  find: (collection, query = {}) => {
    const records = readJSONFile(collection);
    return records.filter(record => {
      for (const key in query) {
        if (record[key] !== query[key]) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findAll: (collection) => {
    const records = readJSONFile(collection);
    return records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  update: (collection, id, updatedData) => {
    const records = readJSONFile(collection);
    const index = records.findIndex(record => record._id === id);
    if (index === -1) return null;
    records[index] = {
      ...records[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    writeJSONFile(collection, records);
    return records[index];
  }
};

module.exports = storage;
