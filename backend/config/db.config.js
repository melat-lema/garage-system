// import mysql
require('dotenv').config();
const mysql=require('mysql2/promise');
//prepare the connection parameters
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    port: process.env.DB_PORT
};

const pool=mysql.createPool(dbConfig);
async function query(sql, params){
    const [rows, fields] = await pool.query(sql, params);
    return rows;                                        
}

module.exports = {
    query,
    
};
