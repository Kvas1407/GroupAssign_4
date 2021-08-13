const express = require("express")
const path = require("path");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const dbConnection = mysql.createConnection(config.dbConfig);

dbConnection.connect((err)=>{
    if(err){
        throw err
    }

    console.log("Connected to the Database");
})

router.get("/", function (req, res) {
    const query = "SELECT * FROM colours ORDER BY id ASC"

    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err
        }
        res.render("index", {
           colours: result, 
        });
    });  
});

router.get("/colour/:id", function (req, res) {

    const colourId = req.params.id;
    
    const query = `SELECT * FROM colours WHERE id = ${colourId}`;

    dbConnection.query(query, (err, result)=> {
        if(err){
            throw err            
        }
        res.render("colour", {
            colour: result[0]
        });
    });  
  });

app.use("/", router);

app.listen(config.serverPort,()=>{
    console.log('Express Server is running at Port');
})