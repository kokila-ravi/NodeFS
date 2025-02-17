const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Path to data.json file
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from data.json
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Function to write data to data.json
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// GET /users → Return the list of users
app.get('/users', (req, res) => {
  const users = readData();
  res.json(users);
});

// GET /users/:id → Return a user by ID
app.get('/users/:id', (req, res) => {
  const users = readData();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// POST /users → Add a new user
app.post('/users', (req, res) => {
  const users = readData();
  const newUser = req.body;  // Assuming user data is in the request body
  if (!newUser.name || !newUser.email) {
    return res.status(400).send('Name and email are required');
  }

  // Set a new id (increment last id in the file)
  const lastId = users.length > 0 ? users[users.length - 1].id : 0;
  newUser.id = lastId + 1;

  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// DELETE /users/:id → Remove a user by ID
app.delete('/users/:id', (req, res) => {
  const users = readData();
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  users.splice(userIndex, 1); // Remove the user
  writeData(users);
  res.status(200).send('User deleted');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
