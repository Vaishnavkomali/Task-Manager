const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tasks', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Task schema and model
const taskSchema = new mongoose.Schema({
    name: String,
    isCompleted: Boolean
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});

app.get('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.send(task);
});

app.post('/api/tasks', async (req, res) => {
    const task = new Task({
        name: req.body.name,
        isCompleted: req.body.isCompleted
    });
    await task.save();
    res.send(task);
});

app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isCompleted: req.body.isCompleted
    }, { new: true });

    if (!task) return res.status(404).send('Task not found');
    res.send(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.send(task);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
