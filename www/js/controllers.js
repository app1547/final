angular.module('starter.controllers', [])

.controller('AppCtrl', function(){})

.controller('AppCtrlInicio', function($scope, $ionicPlatform, POST) {
    
    var senddata = [];
    senddata[0] = "accion=solicitaLlamados";
    var element = document.getElementById('post');
    
    POST.exe(senddata).then(function(res){
        element.innerHTML = 'POST: '+res.accion_post+ '<br/>'+'GET: '+res.accion_get+'<br/>';
    },function(err){
        element.innerHTML = 'ERR: '+err;
    });
    
    $ionicPlatform.ready(function(){
        
        navigator.geolocation.getCurrentPosition(function(position){

            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '+position.coords.latitude+ '<br/>'+'Longitude: '+position.coords.longitude+'<br/>';

        }, function(err){
            
        }, { maximumAge:0, timeout:5000, enableHighAccuracy: true });
        
        var db;
        if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve               
            db = window.sqlitePlugin.openDatabase({ name: "fireapp.db", location: 2 }); //device - SQLite
            $scope.msg1 = "DEVICE SQL";
        } else {
            db = window.openDatabase("fireapp.db", "1.0", "FireApp DB", 1024 * 1024 * 100); // browser webSql, a fall-back for debugging
            $scope.msg1 = "BROWSER SQL";
        }
        
        Ionic.io();
        var push = new Ionic.Push();
        push.register(function(token){
            var element = document.getElementById('token');
            element.innerHTML = 'Token: '+ token.token;
        });
        
        
        
    });
    
    
    
    $scope.foto = function(){
        
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        
        navigator.camera.getPicture(function(img){
        }, function(err){
            $scope.$digest();
        }, options);
        
    }


})
.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])
.factory('POST', function($http, $q, $localstorage){
	        
        var req = {};
        req.method = 'POST';
        req.url = 'http://localhost/respaldo/fireapp/class/final_class.php';
        req.url = 'http://104.197.42.18/services/';
        req.data = '';
        req.dataType = 'jsonp';
        req.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        
	return {
            exe: function(vars){
                var deferred = $q.defer();
                vars.push("user="+$localstorage.set("id_user"));
                vars.push("token="+$localstorage.set("token"));
                req.data = '&'+vars.join('&');
                $http(req).success(function(data, status, headers, config){
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config){
                    deferred.reject();
                });
                return deferred.promise;
            }
	}
        
});

