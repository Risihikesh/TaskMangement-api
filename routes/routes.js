const { registerAdmin, loginAdmin, createTask, assignTask, fetchAllTasks, fetchById, updateTask, deleteTask, analytics } = require('../controllers/admin');
const { registerUser, loginUser } = require('../controllers/user');
const { isAuth, isAdmin } = require('../config/middleware');

const app = require('express')();

// Admin routes
app.post('/admin/register', registerAdmin);
app.post('/admin/login', loginAdmin);

// Task routes, only admin can access
app.post('/task/create', isAuth, isAdmin, createTask)
app.post('/task/assign', isAuth, isAdmin, assignTask);
app.put('/task/update', isAuth, isAdmin, updateTask);
app.delete('/task/delete', isAuth, isAdmin, deleteTask);

app.get('/task/fetchAll', isAuth, isAdmin, fetchAllTasks);
app.get('/task/fetch', isAuth, isAdmin, fetchById);

app.get('/task/analytics', isAuth, isAdmin, analytics);

// User routes
app.post('/user/register', registerUser);
app.post('/user/login', loginUser);

module.exports = app;