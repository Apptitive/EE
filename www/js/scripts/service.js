/*angular.module('app')
.factory('UsersFactory', function ($resource) {
    return $resource('http://119.9.14.30/MobileAPI/MobileAPI/SignUpUser', {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
}).factory('UserFactory', function ($resource) {
    return $resource('http://119.9.14.30/MobileAPI/MobileAPI/SignUpUser/:id', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    })
});*/
/*angular.module('app',[]
).factory('Users', function($http) {
  var Users = {};
  Users = $http.get('../mockdata/users_js.json').then(function (response) {
    return response.data;
  });
  return Users;
});*/