import app from './app';
import { initialiseDatabase } from './database';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 4000;

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialise database
initialiseDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`HMCTS Task Manager API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api/tasks`);
});
