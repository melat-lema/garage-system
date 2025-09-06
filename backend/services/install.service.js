//import the query functon from the db.config.js
const conn=require('../config/db.config');

//import fs module to read files
const fs=require('fs');
// write a function to write a adatabase table
async function install(){
    const queryFile=__dirname + '/sql/initial-queries.sql';
    let queries=[];
    let finalMessage={};
    let templine='';
    //read sql file
    const lines= await fs.readFileSync(queryFile, 'utf8').split('\n');
    //create a promise handle the asynchronous reading of the file of the queries in the variable
    const executed= await new Promise((resolve, reject) => {
        lines.forEach((line)=>{
       if(line.trim().startsWith('--') || line.trim() === '') {
            //skip the comment lines
            return;
       }
       templine += line;
       if(line.trim().endsWith(';')) {
            //if the line ends with a semicolon, it is a complete query
            const sqlQuery = templine.trim();
            queries.push(sqlQuery);
            templine = '';
         }
        });
        resolve("Queries are added to the list")
    })
    //loop through the queries and execute them one by one asynchronously
    for(let i=0; i<queries.length; i++){
        try {
            const result = await conn.query(queries[i]);
            console.log('Table created');
        } catch (error) {
            finalMessage.message="not all tables are created";
        }
    }
    //preapre the final message to return to the controller
    if(finalMessage.message){
        finalMessage.message="Tables are created successfully";
        finalMessage.status=200;
    }
    else{
        finalMessage.message="Tables are not created successfully";
        finalMessage.status=500;
    }
    return finalMessage;
}
module.exports={install};