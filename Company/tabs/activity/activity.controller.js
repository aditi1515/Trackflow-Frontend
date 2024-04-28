function ActivityController($scope, $state, ActivityService, ModalService) {

 $scope.totalPagesInPA = 0;
 $scope.paPage = 1;
 $scope.ticketLogs = [];
 $scope.displayedTicketsLogs = [];
 $scope.ticketLogs = [];
 $scope.ticketHistory = [];
 $scope.showTicketHistory = false;

 function fetchTicketLogs() {
  var projectId = $state.params.projectId;
  ActivityService.getAllLogs(["tickets","projects","users","role"], projectId).then(function (response) {
   $scope.ticketLogs = response.logs;
   displayTickets();
   console.log("ticketLogs", response);
  });
 }

 function displayTickets() {
  var pageSize = 10;
  var start = ($scope.paPage - 1) * pageSize;
  var end = start + pageSize;
  $scope.totalPagesInPA = Math.ceil($scope.ticketLogs.length / pageSize);
  $scope.displayedTicketsLogs = $scope.ticketLogs.slice(start, end);
 }

 $scope.projectActivityPageChange = function (pageNo) {
  $scope.paPage = pageNo;
  displayTickets();
 };

 fetchTicketLogs();

 $scope.openTicketLogDialog = function (ticketLog, modalId) {
  $scope.ticketLog = ticketLog;
  getAllTicketHistory(ticketLog.model.id);
  $scope.showTicketHistory = false;
  ModalService.showModal(modalId);
 };

 $scope.isImage = function (url) {
  // Get the file extension from the URL
  const extension = url.split(".").pop().toLowerCase();

  // List of common image file extensions
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];

  // Check if the extension is in the list of image extensions
  return imageExtensions.includes(extension);
 };

 function getAllTicketHistory(ticketID) {
  $scope.ticketHistory = $scope.ticketLogs.filter(function (ticketLog) {
   return ticketLog.model.id === ticketID;
  });
 }

 $scope.setShowTicketHistory = function (val) {
  $scope.showTicketHistory = val;
 };
}

trackflow.controller("ActivityController", [
 "$scope",
 "$state",
 "ActivityService",
 "ModalService",
 ActivityController,
]);
