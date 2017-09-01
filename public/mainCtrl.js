
/*global angular*/

angular.module("mainCtrl",["ngRoute"]).config(function($routeProvider){
    
    $routeProvider
    .when("/",{
        templateUrl : "cover.html",
    }).when("/analytics",{
        templateUrl : "/analytics/analytics.html",
        controller : "GrupalWidget"
    }).when("/integrations",{
        templateUrl : "/integrations/integrations.html"
        
    }).when("/governance",{
        templateUrl : "/governance.html"
        
    }).when("/about",{
        templateUrl : "/about.html"
    
   }).when("/rape-stats",{
        templateUrl : "/hiv-manager/list.html",
        controller : "listCtrl"
   
    }).when("/rape-stats/edit/:name/:year",{
        templateUrl : "/hiv-manager/edit.html",
        controller : "editCtrl"
 
 
    }) .when("/rape-stats/pruebaGeo",{
        templateUrl : "/analytics/hiv-stats/googleGeo.html",
        controller : "HivGeoController"
 
 
    }).when("/analytics/rape-stats/ejscharts",{
        templateUrl : "/analytics/hiv-stats/ejs.html",
        controller : "EJSChartsController"
   
    }).when("/proxy/rape-stats",{
        templateUrl : "/analytics/hiv-stats/ext2proxy.html",
        controller : "ProxyCtrl"
        
        
    }).when("/analytics/rape-stats/startups",{
        templateUrl : "/analytics/hiv-stats/ext1.html",
        controller : "CtrlExt"
        
    }).when("/mashup",{
        templateUrl : "/analytics/hiv-stats/mashup.html",
        controller : "mashupCtrl"
        
        
    }).when("/proweb",{
        templateUrl : "/analytics/hiv-stats/proweb.html",
        controller : "prowebCtrl"
    });

     console.log("APP INIT");
     
    
    
    });
  