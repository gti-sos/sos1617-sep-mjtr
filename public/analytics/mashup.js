/*global angular*/
/*global EJSC */
/*global RGraph*/


angular
    .module("mainCtrl")
    .controller("mashupCtrl", ["$http", "$scope", function($http, $scope) {

        //Variables de mi API
        $scope.country = [];
        $scope.year = [];
        $scope.numberOfRape = [];
        $scope.rate = [];
        $scope.data = {};
        var data = {};

        
        //Variables de la API a integrar
        $scope.author = [];
        $scope.author2 = [];

        $scope.data2 = {};
        var data2 = {};

//  Compararé el número de autores de dos enlaces distintos,ya que no hay ningún parámetro numérico para comparar

            $scope.url = 'https://joanfihu-article-analysis-v1.p.mashape.com/link?entity_description=False&link=http%3A%2F%2Fwww.theverge.com%2F2014%2F11%2F26%2F7292895%2Fbest-black-friday-deals';
           $scope.url2 = 'https://joanfihu-article-analysis-v1.p.mashape.com/link?entity_description=False&link=http%3A%2F%2Fwww.siliconvalley.com%2Fnews%2Fci_26606809%2Ftwitter-working-targeted-ads-movie-buffs';
           
            var mashape = {
                method: 'GET',
                url: $scope.url,
                headers: {
                    "X-Mashape-Key": "V59uv5BWMcmshTX0FOA8AE8dR7xmp1a6OWOjsnDj3kXaiXpTMj", //get an api key at mashape.com
                    "Accept": "application/json"
                }
            };
            
            
            var mashape2 = {
                
                method: 'GET',
                url: $scope.url2,
                headers: {
                    "X-Mashape-Key": "V59uv5BWMcmshTX0FOA8AE8dR7xmp1a6OWOjsnDj3kXaiXpTMj", //get an api key at mashape.com
                    "Accept": "application/json"
                }
                
            };
            
            $http(mashape)
                .then(function(response) {
                    console.log(response.data);
    
                  data2 = response.data;
                $scope.data2 = data2;


                for (var i = 0; i < 7; i++) {
                    $scope.author.push($scope.data2.author[i]);
                    console.log($scope.author);
          
                }
                
                });     
                 
                 $http
            .get("https://sos1617-09.herokuapp.com/api/v2/hiv-stats?apikey=manuel")
            .then(function(response) {

                data = response.data;
                $scope.data = data;

                for (var i = 0; i < response.data.length; i++) {

                    $scope.country.push($scope.data[i].country);
                    $scope.year.push(Number($scope.data[i].year));
                    $scope.incidence.push(Number($scope.data[i].incidence));
                    $scope.total.push(Number($scope.data[i].total));
                    $scope.percentage.push(Number($scope.data[i].percentage));

                    console.log($scope.data[i].country);

                }

            });     

               
            $http(mashape2)
                .then(function(response) {
                    console.log(response.data);
    
                   data = response.data;
                $scope.data = data;
                   for (var i = 0; i < 1; i++) {
                    $scope.author2.push($scope.data.author[0]);
                    console.log($scope.author2);
          
                }
                   

        new RGraph.Bar({
        id: 'cvs',
        data: [ [$scope.author.length,$scope.author2.length,$scope.percentage[3]]],
        options: {
            textAccessible: true,
            variant: '3d',
            variantThreedAngle: 0.3,
            strokestyle: 'rgba(0,0,0,0)',
            colors: ['Gradient(#fbb:red)', 'Gradient(#bfb:green)','Gradient(#bbf:blue)'],
            gutterTop: 5,
            gutterLeft: 5,
            gutterRight: 15,
            gutterBottom: 50,
            labels: ['Numbers of authors and hiv %'],
            shadowColor:'#ccc',
            shadowOffsetx: 3,
            backgroundGridColor: '#eee',
            scaleZerostart: true,
            axisColor: '#ddd',
            unitsPost: '',
            title: 'Numbers of authors and spain hiv % compare',
            key: ['Black friday page','Silicon Valley page','hiv Spain %'],
            keyShadow: true,
            keyShadowColor: '#ccc',
            keyShadowOffsety: 0,
            keyShadowOffsetx: 3,
            keyShadowBlur: 15
        }
    }).draw();
                    
                    
                    
                    
                    
                });
        

       /* $.ajax({
            url: 'https://joanfihu-article-analysis-v1.p.mashape.com/link?entity_description=False&link=http%3A%2F%2Fwww.theverge.com%2F2014%2F11%2F26%2F7292895%2Fbest-black-friday-deals', // The URL to the API. You can get this in the API page of the API you intend to consume
            type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
            data: {}, // Additional parameters here
            dataType: 'json',
            success: function(data) {
                console.dir((data.source));

                console.log(data);
            },
            error: function(err) {
                alert(err);
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "V59uv5BWMcmshTX0FOA8AE8dR7xmp1a6OWOjsnDj3kXaiXpTMj"); // Enter here your Mashape key
            }
        });*/


              

    }]);
