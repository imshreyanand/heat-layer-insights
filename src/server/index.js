
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DATA_FILE = path.join(DATA_DIR, 'simulations.json');

// Initialize empty data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ simulations: [] }), 'utf8');
}

/**
 * Get all saved simulations
 */
app.get('/api/simulations', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data.simulations);
  } catch (error) {
    console.error('Error reading simulations:', error);
    res.status(500).json({ error: 'Failed to fetch simulations' });
  }
});

/**
 * Save a new simulation
 */
app.post('/api/simulations', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    const newSimulation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...req.body
    };
    
    data.simulations.push(newSimulation);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    
    res.status(201).json(newSimulation);
  } catch (error) {
    console.error('Error saving simulation:', error);
    res.status(500).json({ error: 'Failed to save simulation' });
  }
});

/**
 * Delete a simulation
 */
app.delete('/api/simulations/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const simulationIndex = data.simulations.findIndex(sim => sim.id === req.params.id);
    
    if (simulationIndex === -1) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    
    data.simulations.splice(simulationIndex, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    
    res.json({ message: 'Simulation deleted successfully' });
  } catch (error) {
    console.error('Error deleting simulation:', error);
    res.status(500).json({ error: 'Failed to delete simulation' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Heat transfer simulation server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/simulations`);
});

/**
 * To run this server:
 * 1. Install dependencies: npm install express cors uuid
 * 2. Run with: node server/index.js
 */
