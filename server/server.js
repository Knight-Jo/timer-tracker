import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const CONFIG_DIR = path.join(os.homedir(), '.config', 'time-tracker');
const DATA_FILE = path.join(CONFIG_DIR, 'data.json');

// Ensure directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Helper to read data
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { categories: [], projects: [], timeEntries: [] };
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    console.log('Data successfully read from file:', data);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { categories: [], projects: [], timeEntries: [] };
  }
};

// Helper to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Data successfully written to file:', data);
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

app.get('/api/data', (req, res) => {
  console.log('GET /api/data called');
  const data = readData();
  res.json(data);
});

app.post('/api/data', (req, res) => {
  console.log('POST /api/data called with body:', req.body);
  const data = req.body;
  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data file location: ${DATA_FILE}`);
});
