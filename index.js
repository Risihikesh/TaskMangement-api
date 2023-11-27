const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/routes.js')

const app = express();
const PORT = 6000;
// const MONGO_URI = process.env.MONGO_URI;

const db = require('./config/db');




app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log('server has started'));