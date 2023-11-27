const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const routes = require('./routes.js')

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
        .then(res => console.log('Database connected'))
        .catch(err => console.log(err));

app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log('server has started'));