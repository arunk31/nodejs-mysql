const bodyParser = require('body-parser')
const express = require('express')  
var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 100,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test',
  debug : false
})
const app = express()  
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/users/:id', function(request, response) {
	pool.getConnection(function(err,connection){
        if (err) {
			response.json({"code" : 100, "status" : "Error in connection database"})
			return
        }   
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * FROM users WHERE sn=?', request.params.id, function(err, rows, fields){
            connection.release()
            if(!err) {
                response.json(rows)
            }           
        })
        connection.on('error', function(err) {      
            response.json({"code" : 100, "status" : "Error in connection database"})
            return  
        })
	})
})

app.get('/', (request, response) => { 
	response.send('No Access.')
})

app.get('/users', function (request, response) {  
	pool.getConnection(function(err,connection){
        if (err) {
			response.json({"code" : 100, "status" : "Error in connection database"})
			return
        }   
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * FROM users', function(err, rows, fields) {
            connection.release()
            if(!err) {
                response.json(rows)
            }           
        })
        connection.on('error', function(err) {      
            response.json({"code" : 100, "status" : "Error in connection database"})
            return
        })
	})
})

app.post('/users', function (request, response) {  
    const user_name = request.body.name
    const user_age = request.body.age
    const user_address = request.body.address
	var post  = {name: user_name, age: user_age, address: user_address};
	var query = 'INSERT INTO users SET ?'
	pool.getConnection(function(err,connection){
        if (err) {
			response.json({"code" : 100, "status" : "Error in connection database"})
			return
        }   
        console.log('connected as id ' + connection.threadId)
        connection.query(query, post, function(err, rows, fields) {
            connection.release()
            if(!err) {
                response.send('successfully added')
            }           
        })
        connection.on('error', function(err) {      
            response.json({"code" : 100, "status" : "Error in connection database"})
            return 
        })
	})
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})