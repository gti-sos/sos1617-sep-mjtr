/*global angular*/
/*global Highcharts*/
/*global EJSC*/

angular
    .module("mainCtrl")
    .controller("programCtrl", ["$http", "$scope", function($http, $scope) {

        //Variables de mi API
        $scope.apikey = "septiembre";
        $scope.country = [];
        $scope.year = [];
        $scope.numberOfRape = [];
        $scope.rape = [];
        $scope.data = {};
        var data = {};

        //Variables de la API a integrar
        /*   properties: {
address: "1 Earhart Dr",
category: "airport",
tel: "(610) 383-6057",
landmark: true,
maki: "airport"
center: [
-72.508049,
41.387161
],
},*/
        $scope.value = [];


        $scope.data2 = {};
        var data2 = {};
        var proweb = {

            method: 'GET',
            url: "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network/ESRI_DriveTime_US/GPServer/CreateDriveTimePolygons?f=json&pretty=true",
            headers: {
                "Accept": "application/json"
            }

        };

        $http(proweb)
            //.get("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network/ESRI_DriveTime_US/GPServer/CreateDriveTimePolygons?f=json&pretty=true")
            .then(function(response) {

                console.log("Datos mashup cogidos correctamente");
                data2 = response.data;
                $scope.data2 = data2.parameters;


                $scope.value.push($scope.data2.defaultValue[0].spatialReference);
                console.log($scope.value);

                $scope.value.push(Number($scope.data2.defaultValue[1].spatialReference));


                console.log(response.data);



                $http
                    .get("https://sos1617-sep-mjtr.herokuapp.com//api/v1/rape-stats?apikey=septiembre")
                    .then(function(response) {

                        data = response.data;
                        $scope.data = data;

                        for (var i = 0; i < response.data.length; i++) {

                            $scope.country.push($scope.data[i].country);
                            $scope.year.push(Number($scope.data[i].year));
                            $scope.numberOfRape.push(Number($scope.data[i].numberOfRape));
                            $scope.rate.push(Number($scope.data[i].rate));

                            console.log($scope.data[i].country);

                        }




                        Highcharts.chart('Rape&progweb', {

                            title: {
                                text: 'Rape and Spain mobile price compare'
                            },

                            subtitle: {
                                text: ''
                            },

                            yAxis: {
                                title: {
                                    text: 'Number of data'
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'middle'
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: false
                                    },
                                    enableMouseTracking: true
                                }
                            },

                            series: [{
                                name: 'SmartPhones price',
                                data: $scope.value
                            }, {
                                name: 'Rape Number Of Rapes',
                                data: $scope.numberOfRape
                            }]

                        });

                    });


            });

    }]);
