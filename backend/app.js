const express = require('express');
const router =require('./routes');

require('dotenv').config();
const sanitize = require('sanitize');
const cors = require('cors');
const db = require('./config/db.config');
const port = process.env.PORT;
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow all origins, adjust as necessary for security
    optionsSuccessStatus: 200, // For legacy browser support
}));
//Add express json middlewware to application
app.use(express.json());
//add sanitizer to the express middleware
app.use(sanitize.middleware);
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//check fot database connection
db.query('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
    
module.exports = app;