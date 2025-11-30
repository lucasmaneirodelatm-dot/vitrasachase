// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// API: devolver paradas.json / buses.json (si no existen se devuelven ejemplos)
app.get('/api/paradas', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'data', 'paradas.json'));
  } catch(e) {
    res.json({});
  }
});
app.get('/api/buses', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'data', 'buses.json'));
  } catch(e) {
    res.json([]);
  }
});

// Página raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, ()=> console.log(`Server listening http://localhost:${PORT}`));
