function ActivityInProjectController($scope, $state,ActivityService) {

 $scope.totalPagesInPA = 0;
 $scope.paPage = 1;
 $scope.ticketLogs = [];
 $scope.displayedTicketsLogs = [];


 function fetchTicketLogs() {
  var projectId = $state.params.projectId
  ActivityService.getAllLogs('tickets',projectId).then(function (response) {
   $scope.ticketLogs = response.logs;
   displayTickets()
   console.log("ticketLogs", response);
  });
 }

 function displayTickets() {

   var pageSize = 12;
   var start = ($scope.paPage - 1) * pageSize;
   var end = start + pageSize;
   $scope.totalPagesInPA = Math.ceil($scope.ticketLogs.length / pageSize);
   $scope.displayedTicketsLogs = $scope.ticketLogs.slice(start, end);
 }

 $scope.projectActivityPageChange = function (pageNo) {
  $scope.paPage = pageNo;
  displayTickets()
 }


 fetchTicketLogs()
}

trackflow.controller("ActivityInProjectController", [
 "$scope",
 "$state",
 "ActivityService",
 ActivityInProjectController,
]);
