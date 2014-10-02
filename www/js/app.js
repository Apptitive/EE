var app = angular.module('app', ['ngRoute','ngResource','ngTouch','datePicker','google-maps']);
/*app.service('signupApi', function ($http) {
    var promise = $http.get('url/dchome.json').
        success(function (data) {
            var jsonData = data.data;
            return jsonData;
        });
    return promise;
});*/

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/login.html',
            controller: 'mainCtrl'
        }). when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail', {
            templateUrl: 'views/jobdetail.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/estimation', {
            templateUrl: 'views/jobdetail.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/insurer', {
            templateUrl: 'views/insurer.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/riskhazard', {
            templateUrl: 'views/riskhazard.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/po', {
            templateUrl: 'views/po.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/assessment', {
            templateUrl: 'views/riskhazard.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/client_discuss', {
            templateUrl: 'views/clientdiscussion.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/maintenance', {
            templateUrl: 'views/maintenance.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/timeline', {
            templateUrl: 'views/timeline.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/photocapture', {
            templateUrl: 'views/photo_capture.html',
            controller: 'homeCtrl'
        }). when('/home/report_template', {
            templateUrl: 'views/report_template.html',
            controller: 'homeCtrl'
        }). when('/home/freetext_report', {
            templateUrl: 'views/report_template.html',
            controller: 'homeCtrl'
        }). when('/home/jobdetail/sow', {
            templateUrl: 'views/insurer.html',
            controller: 'homeCtrl'
        }). when('/:page', {
            templateUrl: 'views/login.html',
            controller: 'mainCtrl'
        }).
       
          otherwise({
            redirectTo: '/'
          });
      }
  ]);
/* when('/projects/:pagename/:projectname', {
            templateUrl: 'web_resources/views/projectDetail.html',
            controller: 'projectlistCtrl'
        }).when('/:page/:pagename', {
            templateUrl: 'web_resources/views/pageHome.html',
            controller: 'pageCtrl'
          }).*/


app.directive('camera', function() {
   return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {


         elm.on('click', function() {
            navigator.camera.getPicture(function (imageURI) {
               scope.$apply(function() {
                  ctrl.$setViewValue(imageURI);
                   console.log(imageURI);
               });
            }, function (err) {
               ctrl.$setValidity('error', false);
            }, { 
                quality : 50,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1000,
                targetHeight: 1000,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false 
            })
         });  
      }
   };
});
app.directive('calendar',function(){
  return{
    restrict:'E',
    replace:'true',
    templateUrl:'views/calendar.html',
    link:function(scope, elm, attrs, ctrl) {
        elm.ready(function() {
          setTimeout(function(){
            var $calendars = $(".jsCalendar");
            for (var i = 0, maxI = $calendars.length; i < maxI; i++) {
                var calendar = new Calendar();
                calendar.ready($calendars.eq(i));
            }
            $(".jsCalendar").bind("startDateChanged", function() {
                $(this).data("startdate");
            }).bind("endDateChanged", function() {
                $(this).data("enddate");
            });
          },1000)
        })
    }
  };
});

