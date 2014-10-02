angular.module('app')
.factory('dataFactory', ['$http', function($http,$scope) {
    var scope = angular.element('[ng-controller=loginCtrl]').scope() ;
    $http.defaults.headers.common['User'] =   scope.m_username;//'carlo.lastrina';
    $http.defaults.headers.common['Password'] =scope.m_password; //'Password1!';
    //var urlBase = 'http://119.9.14.30/MobileAPI/MobileAPI/';
    var urlBase = 'js/apiTest/';
    var dataFactory = {};

    dataFactory.getJobsByDate = function (d1,d2) {
        //return $http.get(urlBase+'GetJobListByDateRange.json/?fromDate='+d1+'&toDate='+d2);
        return $http.get(urlBase+'GetJobListByDateRange.json');
    };

    dataFactory.getNoticeList = function (id) {
        //return $http.get('http://119.9.14.30/MobileAPI/MobileAPI/GetNoticeList');
        return $http.get(urlBase+'GetNoticeList.json');
    };

    dataFactory.signup = function (user) {
        return $http.post('http://119.9.14.30/MobileAPI/MobileAPI/SignUpUser',user);
    };

    dataFactory.getAllProceduralDocuments = function (cust) {
        return $http.get(urlBase+'GetAllProceduralDocuments.json');
    };

    dataFactory.recoverPassword = function (username) {
        return $http.post(' http://119.9.14.30/MobileAPI/MobileAPI/ResetPassword',{"username":username});
    };
    dataFactory.changePassword = function (old,newp) {
        return $http.post('http://119.9.14.30/MobileAPI/MobileAPI/ChangePassword',{"oldPassword":old,"newPassword":newp});
    };

    dataFactory.searchJob = function (params) {
        var url = 'http://119.9.14.30/MobileAPI/MobileAPI/GetJobsByParamsAndEstimator/?JobId='+params.JobId+'&ClaimNumber='+params.ClaimNumber+'&ClientName='+params.ClientName+'&Suburb='+params.Suburb;

        return $http.get(url);
    };
    dataFactory.jobDetailsById = function (id) {
        var url = urlBase+'GetJobDetailsByJobId.json';
       //var url = 'http://119.9.14.30/MobileAPI/MobileAPI/GetJobDetailsByJobId/?JobId='+id;
        return $http.get(url);
    };
    dataFactory.getRiskHazardByJobId = function(id){
        var url = urlBase+'GetRiskAndHazardIdentificationByJobId.json';
        return $http.get(url);
    };
    dataFactory.getLineItemLocations = function () {
        var url = urlBase+'GetLineItemLoction.json';
       //var url = 'http://119.9.14.30/MobileAPI/MobileAPI/GetLineItemLoction';
        return $http.get(url);
    };
    dataFactory.getLineItemTradeTypes = function () {
       var url = urlBase+'GetLineItemTradeTypes.json';
       
        return $http.get(url);
    };
    dataFactory.getPOTradeDetails = function () {
        var url = 'http://119.9.14.30/MobileAPI/MobileAPI/GetTraderDetails';
       
        return $http.get(url);
    };
    dataFactory.getPOTypes = function () {
        var url = urlBase+'GetPOType.json';
       
        return $http.get(url);
    };
    dataFactory.getInsurerDocs = function(){
        var url = urlBase+"GetAllInsurerDocuments.json";
        return $http.get(url);
    };
    dataFactory.saveRiskHazard = function(obj){
        var url = urlBase+"SaveRiskAndHazardIdentificaton.json";
        return $http.post(url,obj);
    };
    dataFactory.saveAssesment = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveAssessmentItem";
        return $http.post(url,obj);
    };
    dataFactory.SaveJobInspectionPhoto = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveJobInspectionPhoto";
        return $http.post(url,obj);
    };
    dataFactory.SaveMaintenanceIssue = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveMaintenanceIssue";
        return $http.post(url,obj);
    };
    dataFactory.SaveClientDiscussionItem = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveClientDiscussionItem";
        return $http.post(url,obj);
    };
    dataFactory.SaveLineItem = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveLineItem";
        return $http.post(url,obj);
    };
    dataFactory.SavePOLineItem = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SavePOLineItem";
        return $http.post(url,obj);
    };
    dataFactory.SaveNoteByJobId = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveNote";
        return $http.post(url,obj);
    };
    dataFactory.SaveBARreport = function(obj){
        var url = "http://119.9.14.30/MobileAPI/MobileAPI/SaveBARreport";
        return $http.post(url,obj);
    }
    return dataFactory;
}]);

/*.service('jsonData', function ($http) {
    $http.defaults.headers.common['User'] = 'carlo.lastrina';
    $http.defaults.headers.common['Password'] = 'Password1!';

    var promise = $http.get('http://119.9.14.30/MobileAPI/MobileAPI/GetJobListByDateRange/?fromDate=01-Jan-2001&toDate=10-Sep-2014').
        success(function (data) {
            var jsonData = data.data;
            return jsonData;
        });
    return promise;
}*/