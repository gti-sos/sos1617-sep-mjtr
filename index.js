var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");
var request = require("request");

var app = express();
var port = (process.env.PORT || 16778);

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());


app.use("/", express.static(path.join(__dirname, "public")));


app.listen(port, () => {
    console.log("Magic is happening in port " + port);
}).on("error", (e) => {
    console.log("Server can noy be started " + e);
    process.exit(1);
});


/*Si se intenta acceder a la API con…
sin apikey se debe devolver el código 401.
con una apikey inválida se debe devolver el código 403.
*/

/****MÉTODOS DE LA TABLA AZUL****/

var funciones = require("./public/rape-manager/v1/rapeStats.js");

app.get("/api/v1/rape-stats/loadInitialData",funciones.getCreateData);
app.get("/api/v1/rape-stats",funciones.getAllData);

app.get("/api/v1/rape-stats/:name",funciones.getDataName);
app.get("/api/v1/rape-stats/:name/:year",funciones.getDataNameYear);

app.post("/api/v1/rape-stats",funciones.postNewData);
app.post("/api/v1/rape-stats/:name",funciones.badpost);
app.post("/api/v1/rape-stats/:name/:year",funciones.badpost);

app.put("/api/v1/rape-stats",funciones.badPut);
app.put("/api/v1/rape-stats/:name",funciones.badPut);
app.put("/api/v1/rape-stats/:name/:year",funciones.putTwoData);

app.delete("/api/v1/rape-stats",funciones.deleteCollection);
app.delete("/api/v1/rape-stats/:country" ,funciones.deleteData);
app.delete("/api/v1/rape-stats/:country/:year" , funciones.deleteTwoData);

