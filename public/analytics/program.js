/*global angular*/
/*global Highcharts*/
/*global EJSC*/

angular
    .module("mainCtrl")
    .controller("programCtrl", ["$http", "$scope", function($http, $scope) {

        //Variables de mi API
        $scope.apikey = "manuel";
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
        $scope.findItemsByKeywordsResponse = [];
        $scope.value = [];
        $scope.searchResult = [];
        $scope.title = [];
        $scope.currentPrice = [];


        $scope.data2 = {};
        var data2 = {};

        var mashape = {
            method: 'GET',
            url: "https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=ManuTorr-sos16107-PRD-491ebc5cc-06d6834d&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=Smartphones&paginationInput.entriesPerPage=6&GLOBAL-ID=EBAY-ES&siteid=186",
            headers: {
                "X-Mashape-Key": "V59uv5BWMcmshTX0FOA8AE8dR7xmp1a6OWOjsnDj3kXaiXpTMj", //get an api key at mashape.com
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic <B64-encoded-oauth-credentials>",
                "App ID (Client ID)": "ManuTorr-sos16107-SBX-08e2d25a0-16c2b8e4",
                "Dev ID": "15eddb4f-5008-4f2a-9c69-e8517abe3429",
                "Cert ID (Client Secret)": "SBX-8e2d25a0d7a1-a65a-43f3-b531-15f4"

            },
            requestbody: {

                "grant_type": "client_credentials",
                "redirect_uri": "<RuName-value>"
            }
        };

        $http(mashape)
            //.get("https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=ManuTorr-sos16107-PRD-491ebc5cc-06d6834d&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=Smartphones&paginationInput.entriesPerPage=6&GLOBAL-ID=EBAY-ES&siteid=186")
            .then(function(response) {
                console.log("Datos mashup cogidos correctamente");
                data2 = response.data;
                $scope.data2 = data2.findItemsByKeywordsResponse.searchResult.item;

                for (var i = 0; i < 6; i++) {
                    $scope.title.push($scope.data2[i].title);
                    console.log($scope.title);

                    $scope.currentPrice.push(Number($scope.data2[i].sellingStatus.currentPrice[1]));
                    console.log($scope.currentPrice);
                }

                //console.log(response.data);




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
                                data: $scope.currentPrice
                            }, {
                                name: 'Rape Number Of Rapes',
                                data: $scope.numberOfRape
                            }]

                        });

                    });

            });

    }]);
