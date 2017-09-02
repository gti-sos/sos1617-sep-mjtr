/***VARIABLES GLOBALES****/

var mongoClient = require("mongodb").MongoClient;
var mongoURL = "mongodb://mjtr:gatete@ds051873.mlab.com:51873/sos1617sep";
var db = null;
var apikey = "septiembre";
var limit = null;
var offset = null;
var from = null;
var to = null;

/*Si se intenta acceder a la API con…
sin apikey se debe devolver el código 401.
con una apikey inválida se debe devolver el código 403.
*/

/************************CONECTAR CON LA BASE DE DATOS**************/

mongoClient.connect(mongoURL, { native_parser: true }, (error, database) => {

    if (error) {
        console.log("No se puede usar la base de datos " + error);
    }

    db = database.collection("rape-stats");

});

/**************************LOAD INITIAL DATA ****************/

module.exports.getCreateData = (req, res) => {
    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("Load initial data Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("load initial data KEY SECTION 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        if (db != null) {

            db.find({}).toArray(function(error, conjunto) {
                if (error) {
                    console.error(' Error from DB');
                    res.sendStatus(500); // internal server error
                }
                else {

                    if (!conjunto || conjunto.length !== 0) { //Si mi base de datos no está  vacía

                        /******################################## SECTION 1 ################################### ****/

                        console.log("section 1 error");
                        res.sendStatus(409); //Conflicto,la base de datos ya estaba inicializada

                    }
                    else {
                        db.insert([{
                            "country": "france",
                            "year": 2004,
                            "numberOfRape": 10408,
                            "rate": 17.4
                        }, {
                            "country": "france",
                            "year": 2009,
                            "numberOfRape": 10108,
                            "rate": 16.2
                        }, {
                            "country": "germany",
                            "year": 2010,
                            "numberOfRape": 7724,
                            "rate": 9.4
                        }, {
                            "country": "germany",
                            "year": 2005,
                            "numberOfRape": 8133,
                            "rate": 9.9
                        }, {
                            "country": "belgium",
                            "year": 2006,
                            "numberOfRape": 3194,
                            "rate": 30.5
                        }, {
                            "country": "belgium",
                            "year": 2010,
                            "numberOfRape": 2991,
                            "rate": 27.9
                        }, {
                            "country": "italy",
                            "year": 2004,
                            "numberOfRape": 3734,
                            "rate": 6.4
                        }, {
                            "country": "sweden",
                            "year": 2003,
                            "numberOfRape": 2235,
                            "rate": 25
                        }, {
                            "country": "sweden",
                            "year": 2010,
                            "numberOfRape": 5960,
                            "rate": 63.5
                        }, {
                            "country": "netherlands",
                            "year": 2007,
                            "numberOfRape": 2095,
                            "rate": 12.7
                        }, {
                            "country": "netherlands",
                            "year": 2008,
                            "numberOfRape": 1920,
                            "rate": 11.6
                        }, {
                            "country": "ukraine",
                            "year": 2009,
                            "numberOfRape": 758,
                            "rate": 1.7
                        }, {
                            "country": "ukraine",
                            "year": 2003,
                            "numberOfRape": 1048,
                            "rate": 2.2
                        }, {
                            "country": "portugal",
                            "year": 2008,
                            "numberOfRape": 392,
                            "rate": 3.7
                        }, {
                            "country": "portugal",
                            "year": 2010,
                            "numberOfRape": 424,
                            "rate": 4
                        }]);
                        /**################################## SECTION 2 ################################### **/

                        console.log("SECTION 2 OK, database start");
                        res.sendStatus(201);
                    }
                }
            });
        }
        else {
            /** ################################## SECTION 3 ################################### **/

            console.log("SECTION 3 ERROR, No se ha inicialiazado la base de datos correctamente");
            res.send(500);

        }
    }
};


/**********************GET********************/

//Get conjunto datos

module.exports.getAllData = (req, res) => {
    var errores = 200;
    var key = req.query.apikey;
    var aux = [];
    limit = parseInt(req.query.limit);
    offset = parseInt(req.query.offset);
    from = parseInt(req.query.from);
    to = parseInt(req.query.to);
    var auxFrom = [];
    var auxTo = [];

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("get all data Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("get all data Key section 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        if (!db || db.length === 0) {

            /******################################## Section 1 GET ALL DATA ################################### ****/

            console.log("section 1 get all data error, base de datos vacía get all data");
            res.sendStatus(404);
        }

        else {

            /**SI NO HAY NI LIMIT NI OFFSET DEVOLVEMOS LA LISTA COMPLETA **/

            if (tiene(limit) == false && tiene(offset) == false) {
                db.find({}).toArray(function(err, data) {

                    if (err) {

                        /******################################## Section 2 GET ALL DATA ################################### ****/

                        console.log("section 2 get all data error,problemas con el servidor");
                        res.sendStatus(500); // internal server error
                    }
                    else {
                        if (data.length === 0) {

                            /******################################## Section 3 GET ALL DATA ################################### ****/

                            console.log("section 3 get all data error, no hay datos en la base de datos");
                            res.sendStatus(404);
                        }


                        /**##################BÚSQUEDAS########################**/

                        /**Si solamente ponemos el from**/

                        if (from && to == null) {
                            console.log("Falta por poner el to");
                            //res.sendStatus(404);
                            if (!isNaN(from)) {
                                console.log("Hay from y no hay to, y from es un año");

                                /**Si es un año lo que le pasamos al from***/

                                for (var k = 0; k < data.length; k++) {

                                    if (data[k].year === from) {
                                        while(k < data.length) {
                                            auxFrom.push(data[j]);
                                        }
                                        break;
                                    }

                                }
                                res.send(auxFrom);
                            }
                            else if (isNaN(from)) {
                                console.log("Hay from y no hay to, y from es un pais");
                                /*Si el from en vez de ser un año es el país*/
                                for (var k = 0; k < data.length; k++) {

                                    if (data[k].country === from) {
                                        for (var j = k; j < data.length; j++) {
                                            auxFrom.push(data[j]);
                                        }
                                        break;
                                    }

                                }


                            }
                        }

                        /**Si solamente ponemos el to***/

                        else if (to && !from) {
                            console.log("Hemos entrado en el To y no hay from");

                            if (!isNaN(to)) {
                                console.log("El to es un año");
                                /**Si es un año lo que le pasamos al to***/

                                for (var k = 0; k < data.length; k++) {

                                    if (data[k].year === to) {
                                        /**El TO es el límite,luego tenemos que poner todos los anteriores**/
                                        for (var j = k; j >= 0; j--) {
                                            auxTo.push(data[j]);
                                        }
                                        break;
                                    }

                                }
                                res.send(auxTo);
                            }
                            else if (isNaN(to)) {
                                console.log("el to es un país");
                                /*Si el to en vez de ser un año es el país*/
                                for (var k = 0; k < data.length; k++) {

                                    if (data[k].country === to) {
                                        for (var j = k; j >= 0; j--) {
                                            auxTo.push(data[j]);
                                        }
                                        break;
                                    }

                                }
                                res.send(auxTo);

                            }


                        }
                        else if (from && to) {
                            console.log("Hay from y to");
                            /**Comprobamos que los dos sean años**/

                            if (!isNaN(from) && !isNaN(to)) {

                                console.log("From y to en el que los dos son años");

                                for (var j = 0; j < data.length; j++) {
                                    //Si está comprendido entre el from y el to 
                                    if (data[j].year >= from && data[j].year <= to) {
                                        aux.push(data[j]);

                                    }
                                }
                                res.send(aux);
                            }
                            else if (isNaN(from) && isNaN(to)) {

                                console.log("From y to en el que los dos son países");

                                for (var j = 0; j < data.length; j++) {
                                    //Si está comprendido entre el from y el to 
                                    if (data[j].country == from) {
                                        for (var k = j; k < data.length; k++) {
                                            aux.push(data[k]);
                                            if (data[k].country === to) {
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }

                            }

                            res.send(aux);

                        }
                        else {

                            console.log("mostrando los datos con limit y offset ");
                            console.log("INFO: Sending contacts: " + JSON.stringify(data, 2, null));
                            res.send(data);
                        }
                    }
                });

                /**SI HAY  LIMIT Y OFFSET DEVOLVEMOS LA LISTA COMPLETA DEPENDIENDO DEL LIMIT Y EL OFFSET**/

            }
            else if (tiene(limit) && tiene(offset)) {

                errores = compruebaError(limit, offset);
                if (errores === 200) {

                    db.find({}).skip(offset).limit(limit).toArray(function(err, data) {
                        if (err) {

                            /******################################## Section 4 GET ALL DATA ################################### ****/

                            console.log("section 4 get all data error,problemas con el servidor");
                            res.sendStatus(500); // internal server error
                        }
                        else {
                            if (data.length === 0) {

                                /******################################## Section 5 GET ALL DATA ################################### ****/

                                console.log("section 5 get all data error, no hay datos en la base de datos");
                                res.sendStatus(404);
                            }
                            /**NOS FALTA COMPROBAR EL FROM Y EL TO***/
                            /**Si solamente ponemos el from**/


                            if (from && !to) {
                                console.log("Hay from y no hay to");

                                if (!isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un año");

                                    /**Si es un año lo que le pasamos al from***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                }
                                else if (isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un pais");
                                    /*Si el from en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }


                                }
                                res.send(auxFrom);
                            }

                            /**Si solamente ponemos el to***/

                            else if (to && !from) {
                                console.log("Hemos entrado en el To y no hay from");

                                if (!isNaN(to)) {
                                    console.log("El to es un año");
                                    /**Si es un año lo que le pasamos al to***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === to) {
                                            /**El TO es el límite,luego tenemos que poner todos los anteriores**/
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);
                                }
                                else if (isNaN(to)) {
                                    console.log("el to es un país");
                                    /*Si el to en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === to) {
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);

                                }


                            }
                            else if (from && to) {
                                console.log("Hay from y to");
                                /**Comprobamos que los dos sean años**/

                                if (!isNaN(from) && !isNaN(to)) {

                                    console.log("From y to en el que los dos son años");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].year >= from && data[j].year <= to) {
                                            aux.push(data[j]);

                                        }
                                    }
                                    res.send(aux);
                                }
                                else if (isNaN(from) && isNaN(to)) {

                                    console.log("From y to en el que los dos son países");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].country == from) {
                                            for (var k = j; k < data.length; k++) {
                                                aux.push(data[k]);
                                                if (data[k].country === to) {
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }

                                }

                                res.send(aux);

                            }
                            else {

                                console.log("mostrando los datos con limit y offset ");
                                console.log("INFO: Sending contacts: " + JSON.stringify(data, 2, null));
                                res.send(data);
                            }


                        }
                    });

                }
                else {
                    console.log("El limit o el offset introducidos no son válidos");
                    res.sendStatus(404);
                }

                /**Si tiene limit y no tiene el offset**/

            }
            else if (tiene(limit) && !tiene(offset)) {
                errores = compruebaError(limit, offset);
                if (errores === 200) {

                    db.find({}).limit(limit).toArray(function(err, data) {
                        if (err) {

                            /******################################## Section 4 GET ALL DATA ################################### ****/

                            console.log("section 4 get all data error,problemas con el servidor");
                            res.sendStatus(500); // internal server error
                        }
                        else {
                            if (data.length === 0) {

                                /******################################## Section 5 GET ALL DATA ################################### ****/

                                console.log("section 5 get all data error, no hay datos en la base de datos");
                                res.sendStatus(404);
                            }
                            /**##################BÚSQUEDAS########################**/

                            /**Si solamente ponemos el from**/


                            if (from && !to) {
                                console.log("Hay from y no hay to");

                                if (!isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un año");

                                    /**Si es un año lo que le pasamos al from***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                }
                                else if (isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un pais");
                                    /*Si el from en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }


                                }
                                res.send(auxFrom);
                            }

                            /**Si solamente ponemos el to***/

                            else if (to && !from) {
                                console.log("Hemos entrado en el To y no hay from");

                                if (!isNaN(to)) {
                                    console.log("El to es un año");
                                    /**Si es un año lo que le pasamos al to***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === to) {
                                            /**El TO es el límite,luego tenemos que poner todos los anteriores**/
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);
                                }
                                else if (isNaN(to)) {
                                    console.log("el to es un país");
                                    /*Si el to en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === to) {
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);

                                }


                            }
                            else if (from && to) {
                                console.log("Hay from y to");
                                /**Comprobamos que los dos sean años**/

                                if (!isNaN(from) && !isNaN(to)) {

                                    console.log("From y to en el que los dos son años");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].year >= from && data[j].year <= to) {
                                            aux.push(data[j]);

                                        }
                                    }
                                    res.send(aux);
                                }
                                else if (isNaN(from) && isNaN(to)) {

                                    console.log("From y to en el que los dos son países");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].country == from) {
                                            for (var k = j; k < data.length; k++) {
                                                aux.push(data[k]);
                                                if (data[k].country === to) {
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }

                                }

                                res.send(aux);

                            }
                            else {

                                console.log("mostrando los datos con limit y offset ");
                                console.log("INFO: Sending contacts: " + JSON.stringify(data, 2, null));
                                res.send(data);
                            }

                        }
                    });

                }
                else {
                    console.log("El limit o el offset introducidos no son válidos");
                    res.sendStatus(404);
                }

                /**No tiene limit y tiene offset**/

            }
            else if (!tiene(limit) && tiene(offset)) {

                errores = compruebaError(limit, offset);
                if (errores === 200) {

                    db.find({}).skip(offset).toArray(function(err, data) {
                        if (err) {

                            /******################################## Section 4 GET ALL DATA ################################### ****/

                            console.log("section 4 get all data error,problemas con el servidor");
                            res.sendStatus(500); // internal server error
                        }
                        else {
                            if (data.length === 0) {

                                /******################################## Section 5 GET ALL DATA ################################### ****/

                                console.log("section 5 get all data error, no hay datos en la base de datos");
                                res.sendStatus(404);
                            }
                            /**NOS FALTA COMPROBAR EL FROM Y EL TO***/
                            /**Si solamente ponemos el from**/


                            if (from && !to) {
                                console.log("Hay from y no hay to");

                                if (!isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un año");

                                    /**Si es un año lo que le pasamos al from***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                }
                                else if (isNaN(from)) {
                                    console.log("Hay from y no hay to, y from es un pais");
                                    /*Si el from en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === from) {
                                            for (var j = k; j < data.length; j++) {
                                                auxFrom.push(data[j]);
                                            }
                                            break;
                                        }

                                    }


                                }
                                res.send(auxFrom);
                            }

                            /**Si solamente ponemos el to***/

                            else if (to && !from) {
                                console.log("Hemos entrado en el To y no hay from");

                                if (!isNaN(to)) {
                                    console.log("El to es un año");
                                    /**Si es un año lo que le pasamos al to***/

                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].year === to) {
                                            /**El TO es el límite,luego tenemos que poner todos los anteriores**/
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);
                                }
                                else if (isNaN(to)) {
                                    console.log("el to es un país");
                                    /*Si el to en vez de ser un año es el país*/
                                    for (var k = 0; k < data.length; k++) {

                                        if (data[k].country === to) {
                                            for (var j = k; j >= 0; j--) {
                                                auxTo.push(data[j]);
                                            }
                                            break;
                                        }

                                    }
                                    res.send(auxTo);

                                }


                            }
                            else if (from && to) {
                                console.log("Hay from y to");
                                /**Comprobamos que los dos sean años**/

                                if (!isNaN(from) && !isNaN(to)) {

                                    console.log("From y to en el que los dos son años");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].year >= from && data[j].year <= to) {
                                            aux.push(data[j]);

                                        }
                                    }
                                    res.send(aux);
                                }
                                else if (isNaN(from) && isNaN(to)) {

                                    console.log("From y to en el que los dos son países");

                                    for (var j = 0; j < data.length; j++) {
                                        //Si está comprendido entre el from y el to 
                                        if (data[j].country == from) {
                                            for (var k = j; k < data.length; k++) {
                                                aux.push(data[k]);
                                                if (data[k].country === to) {
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }

                                }

                                res.send(aux);

                            }
                            else {

                                console.log("mostrando los datos con limit y offset ");
                                console.log("INFO: Sending contacts: " + JSON.stringify(data, 2, null));
                                res.send(data);
                            }


                        }
                    });

                }
                else {
                    console.log("El limit o el offset introducidos no son válidos");
                    res.sendStatus(404);
                }


            }


        }
    }
};


//Get a un recurso en concreto por nombre o por año

module.exports.getDataName = function(req, res) {

    var key = req.query.apikey;
    limit = parseInt(req.query.limit);
    offset = parseInt(req.query.offset);

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/

        console.log("get un recurso en concreto por nombre o año Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("get un recurso en concreto por nombre o año Key section 2 error");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        var country = req.params.name;
        var aux = [];

        if (!country) {
            console.log("BAD Request,try again with new data");
            res.sendStatus(400); // bad request

        }
        else if (!db || db.length === 0) {

            /******################################## Section 1 GET ONE DATA ################################### ****/

            console.log("section 1 GET ONE DATA error, base de datos vacía get recurso concreto data");
            res.sendStatus(404);
        }

        else {

            /***Comprobamos si hay limit o offset**/
            //Si no hay ni limit no offset

            if (tiene(limit) == false && tiene(offset) == false) {

                db.find({}).toArray(function(error, conjunto) {

                    if (conjunto.length === 0) {

                        /******################################## Section 2 GET ONE DATA ################################### ****/

                        console.log("SECTION 2 GET ONE DATA ERROR, Algo pasa con la base de datos que está vacía");
                        res.sendStatus(404);
                    }
                    else {
                        for (var i = 0; i < conjunto.length; i++) {

                            if (isNaN(country)) {
                                if (country == conjunto[i].country) {
                                    aux.push(conjunto[i]);
                                }

                            }
                            else if (!isNaN(country)) {

                                if (country == conjunto[i].year) {
                                    aux.push(conjunto[i]);
                                }
                            }

                        }

                        if (aux.length === 0) {
                            /******################################## Section 3 GET ONE DATA ################################### ****/

                            console.log("SECTION 3 GET ONE DATA ERROR, el conjunto auxiliar creado está vacío");
                            res.sendStatus(404);
                        }
                        else {
                            console.log("Enviando los datos encontrados con el parámetro indicado");
                            res.send(aux);
                        }
                    }

                });

                //Comprobamos ahora si tiene limit y no tiene offset   
            }
            else if (tiene(limit) && !tiene(offset)) {

                db.find({}).limit(limit).toArray(function(error, conjunto) {

                    if (conjunto.length === 0) {

                        /******################################## Section 2 GET ONE DATA ################################### ****/

                        console.log("SECTION 2 GET ONE DATA ERROR, Algo pasa con la base de datos que está vacía XXX");
                        res.sendStatus(404);
                    }
                    else {
                        for (var i = 0; i < conjunto.length; i++) {

                            if (isNaN(country)) {
                                if (country == conjunto[i].country) {
                                    aux.push(conjunto[i]);
                                }

                            }
                            else if (!isNaN(country)) {

                                if (country == conjunto[i].year) {
                                    aux.push(conjunto[i]);
                                }
                            }

                        }

                        if (aux.length === 0) {
                            /******################################## Section 3 GET ONE DATA ################################### ****/

                            console.log("SECTION 3 GET ONE DATA ERROR, el conjunto auxiliar creado está vacío");
                            res.sendStatus(404);
                        }
                        else {
                            console.log("Enviando los datos encontrados con el parámetro indicado");
                            res.send(aux);
                        }
                    }

                });


                /**Si no tenemos limit pero hemos puesto offset**/

            }
            else if (!tiene(limit) && tiene(offset)) {

                db.find({}).skip(offset).toArray(function(error, conjunto) {

                    if (conjunto.length === 0) {

                        /******################################## Section 2 GET ONE DATA ################################### ****/

                        console.log("SECTION 2 GET ONE DATA ERROR, Algo pasa con la base de datos que está vacía XXX");
                        res.sendStatus(404);
                    }
                    else {
                        for (var i = 0; i < conjunto.length; i++) {

                            if (isNaN(country)) {
                                if (country == conjunto[i].country) {
                                    aux.push(conjunto[i]);
                                }

                            }
                            else if (!isNaN(country)) {

                                if (country == conjunto[i].year) {
                                    aux.push(conjunto[i]);
                                }
                            }

                        }

                        if (aux.length === 0) {
                            /******################################## Section 3 GET ONE DATA ################################### ****/

                            console.log("SECTION 3 GET ONE DATA ERROR, el conjunto auxiliar creado está vacío");
                            res.sendStatus(404);
                        }
                        else {
                            console.log("Enviando los datos encontrados con el parámetro indicado");
                            res.send(aux);
                        }
                    }

                });



            }
            /**Si tenemos limit y offset**/
            else if (tiene(limit) && tiene(offset)) {

                db.find({}).skip(offset).limit(limit).toArray(function(error, conjunto) {

                    if (conjunto.length === 0) {

                        /******################################## Section 2 GET ONE DATA ################################### ****/

                        console.log("SECTION 2 GET ONE DATA ERROR, Algo pasa con la base de datos que está vacía XXX");
                        res.sendStatus(404);
                    }
                    else {
                        for (var i = 0; i < conjunto.length; i++) {

                            if (isNaN(country)) {
                                if (country == conjunto[i].country) {
                                    aux.push(conjunto[i]);
                                }

                            }
                            else if (!isNaN(country)) {

                                if (country == conjunto[i].year) {
                                    aux.push(conjunto[i]);
                                }
                            }

                        }

                        if (aux.length === 0) {
                            /******################################## Section 3 GET ONE DATA ################################### ****/

                            console.log("SECTION 3 GET ONE DATA ERROR, el conjunto auxiliar creado está vacío");
                            res.sendStatus(404);
                        }
                        else {
                            console.log("Enviando los datos encontrados con el parámetro indicado");
                            res.send(aux);
                        }
                    }

                });

            }

        }
    }

};


//GET a un recurso en concreto por nombre y año

module.exports.getDataNameYear = function(req, res) {

    var nombre = req.params.name;
    var year = req.params.year;
    var aux = [];
    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/

        console.log("get un recurso en concreto por nombre y año Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("get un recurso en concreto por nombre y año Key section 2 error");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {
        if (!nombre || !year) {

            console.log("BAD Request,try again with new data");
            res.sendStatus(400); // bad request

        }
        else if (!db) {
            res.sendStatus(404); //Base de datos está vacía
        }
        else {
            db.find({}).toArray(function(error, conjunto) {

                if (conjunto.length === 0) {
                    console.log("Algo pasa con la base de datos que está vacía");
                    res.sendStatus(404);
                }
                else {

                    for (var j = 0; j < conjunto.length; j++) {

                        if (isNaN(nombre) && isNaN(parseInt(year)) === false) {
                            if (conjunto[j].country === nombre && conjunto[j].year == parseInt(year)) {
                                aux.push(conjunto[j]);

                            }

                        }
                    }

                    if (!aux || aux == [] || aux.length === 0) {
                        res.sendStatus(404);
                    }
                    else {
                        res.send(aux);

                    }
                }
            });
        }
    }
};


/**********************POST********************/

//POST a un conjunto 

module.exports.postNewData = (req, res) => {

    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("POST DATA Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("POST DATA Key section 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        var nuevoDato = null;
        nuevoDato = req.body;
        var sol = false;

        if (nuevoDato === null) {
            console.log("El post a un conjunto no se ha realizado correctamente porque se han introducido mal los datos");
            res.sendStatus(400); //BAD REQUEST

        }
        else if (!nuevoDato.country || !nuevoDato.year || !nuevoDato.numberOfRape || !nuevoDato.rate) {

            res.sendStatus(400);
            console.log("something wrong in your data post,bad request, falta algún dato");

        }
        else {
            db.find({}).toArray(function(error, conjunto) {

                if (conjunto.length === 0) {
                    console.log("DB empty");
                    res.sendStatus(404);
                }
                else {

                    for (var i = 0; i < conjunto.length; i++) {

                        if (conjunto[i].country === nuevoDato.country && conjunto[i].year === parseInt(nuevoDato.year)) {
                            res.sendStatus(409);
                            console.log("Error,el dato ya estaba en el conjunto");
                            sol = true;
                        }
                    }

                    if (sol === false) {
                        db.insert(nuevoDato);
                        res.sendStatus(201); //CREATED 
                    }
                }

            });

        }

    }

};


//POST a un recurso en concreto 


module.exports.badpost = (req, res) => {
    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("POST ONE DATA Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("POST ONE DATA Key section 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        res.sendStatus(405); //Method Not Allowed

        console.log("No se puede hacer un post a un recurso en concreto");
    }

};


/**********************PUT*************************************/


//PUT a una coleccion de datos

module.exports.badPut = (req, res) => {
    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("PUT DATA Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("PUT DATA Key section 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {
        res.sendStatus(405);
        console.log("No se puede hacer un put a una coleccion de datos");
    }
};


//PUT a un recurso en concreto


module.exports.putTwoData = (req, res) => {

    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("PUT ONE DATA Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("PUT ONE DATA Key section 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {
        var actualiza = req.body;
        var country = req.params.name;
        var year = parseInt(req.params.year);

        if (!actualiza.country || !actualiza.year || !actualiza.numberOfRape || !actualiza.rate) {

            res.sendStatus(400);
            console.log("falta algún parámetro del dato que queremos insertar");

        }
        if (country === actualiza.country && parseInt(year) === parseInt(actualiza.year)) {
            db.update({
                country: country,
                year: year
            }, {
                country: actualiza.country,
                year: actualiza.year,
                numberOfRape: actualiza.numberOfRape,
                rate: actualiza.rate

            });
            res.sendStatus(200); //OK

        }
        else {
            res.sendStatus(400);
        }
    }
};



/*************************DELETE********************************/

//DELETE a una colección de datos

module.exports.deleteCollection = (req, res) => {

    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("Load initial data Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("load initial data KEY SECTION 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else if (db || db.length !== 0) {

        db.remove({}, {
            multi: true
        }, function(err, borr) {
            var numeros = JSON.parse(borr);
            if (err) {

                console.error('Error no funciona el Delete de toda la coleccion');
                res.sendStatus(500); // internal server error
            }
            else {
                if (numeros.n > 0) {
                    console.log("Todo borrado ");
                    res.sendStatus(204); // no content
                }
                else {
                    +
                    console.log("No hay contactos que borrar");
                    res.sendStatus(404); // not found
                }
            }
        });
    }
    else {
        console.log("No habia nada en la base de datos");
        res.sendStatus(404);
    }
};

//DELETE a un recurso en concreto

module.exports.deleteData = (req, res) => {

    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("Load initial data Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("load initial data KEY SECTION 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {
        var country = req.params.country;

        if (!country) {
            res.sendStatus(404);
        }
        else {

            if (isNaN(country)) {
                db.remove({
                    country: country
                }, function(error, conjunto) {
                    var numeros = JSON.parse(conjunto);
                    if (error) {
                        console.log("Algo pasa con la base de datos que está vacía");
                        res.sendStatus(404);
                    }
                    else if (numeros.n > 0) {

                        console.log("El dato se ha borrado satisfactoriamente");
                        res.sendStatus(204);
                    }
                    else {

                        res.sendStatus(404);
                    }

                });
            }
            else if (isNaN(country) === false) {
                var year = parseInt(country);
                db.remove({
                    year: year
                }, function(error, conjunto) {
                    var numeros = JSON.parse(conjunto);
                    if (error) {
                        console.log("Algo pasa con la base de datos que está vacía");
                        res.sendStatus(404);
                    }
                    else if (numeros.n > 0) {

                        console.log("El dato se ha borrado satisfactoriamente");
                        res.sendStatus(204);
                    }
                    else {

                        res.sendStatus(404);
                    }

                });


            }
        }
    }

};

module.exports.deleteTwoData = (req, res) => {
    var key = req.query.apikey;

    if (!key || key == null) {

        /******################################## KEY SECTION 1 ################################### ****/
        console.log("Load initial data Key section 1 error");
        res.sendStatus(401); //No ha introducido ninguna apikey

    }
    else if (key != apikey) {

        /******################################## KEY SECTION 2 ################################### ****/

        console.log("load initial data KEY SECTION 2 ERROR");
        res.sendStatus(403); //La apikey introducida es incorrecta
    }
    else {

        var country = req.params.country;
        var year = parseInt(req.params.year);

        if (!country) {
            res.sendStatus(404);

        }
        else {
            db.remove({
                country: country,
                year: year
            }, function(error, conjunto) {
                var numeros = JSON.parse(conjunto);
                if (error) {
                    console.log("Algo pasa con la base de datos que está vacía");
                    res.sendStatus(404);
                }
                else if (numeros.n > 0) {

                    console.log("El dato se ha borrado satisfactoriamente");
                    res.sendStatus(204);
                }
                else {
                    console.log("no se ha borrado nada ");
                    res.sendStatus(404);
                }

            });


        }
    }
};


//MÉTODOS AUXILIARES
 
var tiene = function(limit) {
    var res = false;

    if (limit != null && limit >= 0) {

        res = true;
    }
    return res;

};

var compruebaError = function(limit, offset) {
    var s = 200;
    if (limit != null) {
        if (limit < 0) {
            s = -1;
        }
    }
    if (offset != null) {
        if (offset < 0) {
            s = -1;
        }
    }

    return s;
};
