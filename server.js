
const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- MongoDB ---------- */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const Card = mongoose.model('Card', {
  suit: String,
  value: String,
  collection: String
});

/* ---------- Redis ---------- */
const redis = createClient({
  url: process.env.REDIS_URL
});
redis.connect();

/* ---------- EXP 4.1 (Employee) ---------- */
let employees = [];

app.post('/api/employees', (req, res) => {
  const emp = { id: Date.now(), ...req.body };
  employees.push(emp);
  res.json(emp);
});

app.get('/api/employees', (req, res) => {
  res.json(employees);
});

/* ---------- EXP 4.2 (Cards MongoDB) ---------- */
app.get('/api/cards', async (req, res) => {
  res.json(await Card.find());
});

app.post('/api/cards', async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.json(card);
});

/* ---------- EXP 4.3 (Redis Booking) ---------- */
app.post('/api/book', async (req, res) => {
  let seats = await redis.get('seats');

  if (!seats) {
    await redis.set('seats', 100);
    seats = 100;
  }

  if (seats <= 0) {
    return res.json({ success: false });
  }

  await redis.decr('seats');

  res.json({
    success: true,
    remaining: seats - 1
  });
});

/* ---------- ROOT ---------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
