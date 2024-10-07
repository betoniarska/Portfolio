
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';




require('dotenv').config();


const morgan = require('morgan');
app.use(morgan('dev'));
app.use(cors());

// In production, serve the frontend build
if (isProduction) {
  // Serve the static files from the frontend build folder

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../frontend')));

  

  // Serve the frontend index.html file on any route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
} else {
  // In development mode, just serve the backend API and let Vite handle the frontend
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
}

// API routes (add your API routes here)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
