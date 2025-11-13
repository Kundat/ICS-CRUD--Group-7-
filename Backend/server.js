const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Get all lineup items
app.get('/api/lineup', (req, res) => {
  db.query('SELECT * FROM lineup', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Get single item by ID
app.get('/api/lineup/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM lineup WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

// ✅ Create a new item
app.post('/api/lineup', (req, res) => {
  const { festival_name } = req.body;
  db.query('INSERT INTO lineup (festival_name) VALUES (?)', [festival_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, festival_name });
  });
});

// ✅ Update an item
app.put('/api/lineup/:id', (req, res) => {
  const id = req.params.id;
  const { festival_name } = req.body;
  db.query('UPDATE lineup SET festival_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
    [festival_name, id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, festival_name });
    });
});

// ✅ Delete an item
app.delete('/api/lineup/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM lineup WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(204).send();
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
