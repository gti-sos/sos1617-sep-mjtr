
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors= require("cors");
var request = require("request");
var mongoClient = require("mongodb").MongoClient;

var app = express();
var port = (process.env.PORT || 16778);

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());


app.use("/",express.static(path.join(__dirname,"public")));


app.listen(port, ()=> {
    console.log("Magic is happening in port "+port);
}).on("error",(e)=>{
    console.log("Server can noy be started "+e);
    process.exit(1);
});


var mongoURL = "mongodb://manu:admin@ds137730.mlab.com:37730/sos1617";

var db;

var apikey = "septiembre";

/*Si se intenta acceder a la API con…
sin apikey se debe devolver el código 401.
con una apikey inválida se debe devolver el código 403.
*/
 
/************************CONECTAR CON LA BASE DE DATOS**************/

mongoClient.connect(mongoURL, {native_parser: true}, (error, database) => {

    if (error) {
        console.log("No se puede usar la base de datos" + error);
    }

    db = database.collection("rape-stats");

});

/**************************LOAD INITIAL DATA ****************/

module.exports.getCreateStats = (req, res) => {
    var key = req.query.apikey;

    if (!key) {
        res.sendStatus(401); //No ha puesto la apikey

    }
    else if (!tieneKey(key)) {

        res.sendStatus(403); //Está mal puesta la apikey
    }
    else {

        if (db) {

            db.find({}).toArray(function(error, conjunto) {
                if (error) {
                    console.error(' Error from DB');
                    res.sendStatus(500); // internal server error
                }
                else {

                    if (conjunto.length !== 0) { //Si mi base de datos no está  vacía
                        res.sendStatus(409); //Conflicto,la base de datos ya estaba inicializada

                    }
                    else {
                        meteDatos(db);
                        console.log("OK");
                        res.sendStatus(201);

                    }

                }

            });
        }
        else {
            console.log("No se ha inicialiazado la base de datos correctamente");
            res.send(500);

        }
    }
};




