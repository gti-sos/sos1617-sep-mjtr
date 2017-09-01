/*global angular*/

angular.module("mainCtrl")
.controller("editCtrl",["$scope","$http","$routeParams","$location",function($scope,$http,$routeParams,$location){
    console.log("Edit controller initialized");
    $scope.url  = "https://sos1617-09.herokuapp.com/api/v2/hiv-stats/";
    var apikey = "apikey=manuel";
    
    function refresh(){
        $http
            .get($scope.url + $routeParams.name + "/" + Number($routeParams.year) + "?" + apikey)
            .then(function successCallback(response) {
                    $scope.updateData = response.data[0];

                }, function errorCallback(response) {
                    console.log("Entra1");
                    $scope.updateData = [];

                });
    }
    
    $scope.updatedData = function(newData){
      
            $http
                .put($scope.url  + newData.country + "/" + Number(newData.year) + "?apikey=manuel", {
                    country: newData.country,
                    year: newData.year,
                    incidence: newData.incidence,
                    total: newData.total,
                    percentage: newData.percentage
                })
                .then(function(response) {
                    console.log("Stat Updated 2");
                    switch (response.status) {
                        case 400:
                            alert("Please fill all the fields");
                            break;
                        default:
                            alert("OK");
                            break;
                    }
                    $location.path("/");

                });
        };



        refresh();
    
}]);