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


        $scope.value = [];

        var totalSpatialReference = 0;
        $scope.data2 = {};
        var data2 = {};
        var totalNumberOfRape = 0;



        $http
            .get("https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network/ESRI_DriveTime_US/GPServer/CreateDriveTimePolygons?f=json&pretty=true")
            .then(function(response) {

                console.log("Datos mashup cogidos correctamente");
                data2 = response.data;
                $scope.data2 = data2.parameters;

                console.log($scope.data2);
                $scope.value.push($scope.data2[0].defaultValue.spatialReference.wkid);
                console.log($scope.value);
                $scope.value.push(Number($scope.data2[2].defaultValue.spatialReference.wkid));
                console.log($scope.value);


                console.log(response.data);

                totalSpatialReference = $scope.value[0] + $scope.value[1];

                $http
                    .get("https://sos1617-sep-mjtr.herokuapp.com/api/v1/rape-stats?apikey=septiembre")
                    .then(function(response) {

                        data = response.data;
                        $scope.data = data;
                        console.log(data);
                        for (var i = 0; i < response.data.length; i++) {

                            $scope.country.push($scope.data[i].country);
                            $scope.year.push(Number($scope.data[i].year));
                            $scope.numberOfRape.push(Number($scope.data[i].numberOfRape));
                            totalNumberOfRape = totalNumberOfRape + Number($scope.data[i].numberOfRape);

                            console.log($scope.data[i].country);

                        }




                        Highcharts.chart('Rape&Ref', {
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false,
                                type: 'pie'
                            },
                            title: {
                                text: 'Total Spatial Refence vs Total Number of Rape'
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true
                                }
                            },
                            series: [{
                                name: 'Brands',
                                colorByPoint: true,
                                data: [{
                                    name: 'Number of Rape',
                                    y: totalNumberOfRape
                                }, {
                                    name: 'Total Spatial Reference',
                                    y: totalSpatialReference,
                                    sliced: true,
                                    selected: true
                                }]
                            }]
                        });

                    });


            });

    }]);
