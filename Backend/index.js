     const express =require("express");
const path =require("path");
const app = express();
const mysql = require('mysql');
const bodyParser =require('body-parser');
const cors=require("cors");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '/public')));



//create connection
const conn =mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database:'task'
    

});



//connect to database
conn.connect((err) =>{
    if(err) throw err;
    console.log ('Mysql Connected...');
});

app.get('/getuser', (req, res) => {
    // Query the transaction table for all records
    const query = 'SELECT * FROM windowuser';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error querying transaction table:', err);
            return res.status(500).json({ error: 'Failed to retrieve transactions.' });
        }

        // Respond with the retrieved transaction data
        res.json({  results });
    });
});

// get all count
app.get('/getcount', (req, res) => {
    // Query the transaction table for all records
    const query = 'SELECT * FROM count';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error querying transaction table:', err);
            return res.status(500).json({ error: 'Failed to retrieve transactions.' });
        }

        // Respond with the retrieved transaction data
        res.json({  results });
    });
});
app.post('/windowuser', (req, res) => {
    // Delete existing records
    conn.query('DELETE FROM windowuser', (error, results, fields) => {
        if (error) {
            console.error('Error deleting records from MySQL:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log('Previous records deleted');

        // Insert new record
        const title = req.body.title; // Assuming title is sent in the request body
        const query = 'INSERT INTO windowuser (title) VALUES (?)';
        conn.query(query, [title], (error, results, fields) => {
            if (error) {
                console.error('Error inserting record into MySQL:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            console.log('New record inserted:', { title });

            // Increment count in count_table
            conn.query('UPDATE count SET `add` = `add` + 1', (countError, countResults, countFields) => {
                if (countError) {
                    console.error('Error updating count in count_table:', countError);
                    // Don't return error response here as the main operation has succeeded
                    // You can choose to log the error or handle it differently
                }
                console.log('Count updated successfully');
                res.status(201).json({ message: 'New record inserted successfully' });
            });
        });

    });
});

// Define a route for updating a record by ID
app.put('/windowuser/:id', (req, res) => {
    const id = req.params.id; // Extract ID from URL parameters
    const { title } = req.body; // Extract updated title from request body

    // Construct SQL query to update the record
    const updateQuery = 'UPDATE windowuser SET title = ? WHERE id = ?';
    conn.query(updateQuery, [title, id], (error, results, fields) => {
        if (error) {
            console.error('Error updating record in MySQL:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.affectedRows === 0) {
            // If no rows were affected, it means the record with the specified ID was not found
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        console.log('Record updated successfully:', { id, title });

        // Increment the count in the count_table
        conn.query('UPDATE count SET `update` = `update` + 1', (countError, countResults, countFields) => {
            if (countError) {
                console.error('Error updating count in count_table:', countError);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            console.log('Count updated successfully');
            res.json({ message: 'Record updated successfully' });
        });
    });
});

  
app.listen(4200,()=>{
    console.log(`express server running on 4200`);
});