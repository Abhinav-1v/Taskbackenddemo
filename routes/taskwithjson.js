const { Router } = require('express');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

const router = Router();
const filePath = path.join(__dirname, '../tasks.json');

//FUNCTION TO READ DATA FROM Task.json FILE
const readTasksFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Error reading tasks file');
    }
};

//FUNCTION TO WRITE DATA TO Task.json FILE
const writeTasksToFile = (tasks) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (err) {
        throw new Error('Error writing tasks to file');
    }
};

// ADD NEW TASK ROUTE
router.post('/', (req, res) => {
    const { title, description } = req.body;
    const id = nanoid(5);

    try {
        const tasks = readTasksFromFile();
        const newTask = { id, title, description, status: 'pending' };
        tasks.push(newTask);
        writeTasksToFile(tasks);
        return res.status(201).json(newTask);
    } catch (e) {
        return res.status(400).send('Cant post request: ', e.message);
    }
});

// GET ALL TASKS ROUTE
router.get('/', (req, res) => {
    try {
        const tasks = readTasksFromFile();
        return res.status(200).json(tasks);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

// GET TASK BY ID ROUTE
router.get('/:id', (req, res) => {
    const id = req.params.id;

    try {
        const tasks = readTasksFromFile();
        const task = tasks.find((task) => task.id === id);

        if (task) {
            return res.status(200).json(task);
        } else {
            return res.status(404).json({ error: 'Task not found' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Error fetching task' });
    }
});

// UPDATE TASK STATUS ROUTE
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Valid statuses are pending, in-progress, or completed.' });
    }

    try {
        const tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        tasks[taskIndex].status = status;
        writeTasksToFile(tasks);
        res.json(tasks[taskIndex]);
    } catch (e) {
        res.status(500).json({ error: 'Error updating task status' });
    }
});

// DELETE TASK BY ID ROUTE
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    try {
        const tasks = readTasksFromFile();
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        tasks.splice(taskIndex, 1);
        writeTasksToFile(tasks);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
