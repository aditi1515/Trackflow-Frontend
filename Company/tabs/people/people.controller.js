function companyPeopleController(
 $scope,
 $timeout,
 ModalService,
 SnackbarService,
 UserService,
 RoleService
) {
 $scope.peopleData = {};
 $scope.isEditing = false;
 $scope.currentEditingEmployee = null;
 $scope.formHolder = {};
 $scope.addEmployeeFormData = {};
 $scope.dateRangeOption = null;

 //submit add employee form
 $scope.addEmployeeFormSubmit = function (modalId, addEmployeeForm) {
  console.log("Adding employee: ", $scope.addEmployeeFormData);
  UserService.createUser({ user: $scope.addEmployeeFormData })
   .then(function (response) {
    console.log("Employee added successfully: ", response);
    SnackbarService.showAlert("Employee added successfully", 2000, "success");
    getAllPeople();
    $scope.addEmployeeFormData = {};
    ModalService.hideModal(modalId);
   })
   .catch(function (error) {
    console.log("Error adding employee: ", error);
    addEmployeeForm.$invalid = true;
    addEmployeeForm.errorMessage = error.data.message;
   });
  // ModalService.hideModal(modalId);
 };

 $scope.dateOptionChange = function (option) {
  console.log("Option: ", option);
  $scope.dateRangeOption = option;

  getAllPeople();
 };

 function getAllPeople(
  pageNo = 1,
  pageSize = 10,
  query = $scope.peopleData.query || ""
 ) {

  var startDate = null;
  var endDate = null;
  console.log("Date range option: ", $scope.dateRangeOption);
  switch ($scope.dateRangeOption) {
    case "oneMonth":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
      break;
    case "sixMonths":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      endDate = new Date();
      break;
    case "oneYear":
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate = new Date();
      break;
    default:
      break;
  }


  var dateRangeOption = {startDate: startDate, endDate: endDate}


  UserService.getAllUsers({
   pageNo,
   pageSize,
   query,
  },   dateRangeOption).then(function (response) {
   console.log("All people: ", response);
   $scope.peopleData = response.data;
  });
 }

 getAllPeople();

 function getAllRoles() {
  RoleService.getAllRoles($scope.company._id).then(function (response) {
   console.log("All roles: ", response);
   $scope.roles = response;
  });
 }

 getAllRoles();

 $scope.pageChange = function (pageNo, pageSize) {
  console.log("Page changed: ", pageNo);
  getAllPeople(pageNo, pageSize);
 };

 function searchPeople(query) {
  console.log("Search query: ", query);
  getAllPeople($scope.peopleData.currentPage, $scope.peopleData.pageSize, {
   query: query,
  });
 }

 var debounceTimeout;

 $scope.debounceSearch = function () {
  console.log("Debouncing...");
  $timeout.cancel(debounceTimeout);
  debounceTimeout = $timeout(function () {
   searchPeople($scope.peopleData.query);
  }, 1000);
 };

 $scope.launchModal = function (modalId) {
  if ($scope.isEditing) {
   $scope.isEditing = false;
   $scope.addEmployeeFormData = {};
   $scope.currentEditingEmployee = null;
  }

  $scope.formHolder.addEmployeeForm.$setPristine();
  $scope.formHolder.addEmployeeForm.$setUntouched();
  ModalService.showModal(modalId);
 };

 //prepopulate form with employee data
 $scope.editEmployee = function (modalId, employee) {
  console.log("Editing employee: ", employee);
  $scope.isEditing = true;
  $scope.currentEditingEmployee = angular.copy(employee);
  var editEmployeeFormData = {
   firstname: employee.firstname,
   lastname: employee.lastname,
   email: employee.email,
   role: employee.role,
   phoneNumber: employee.phoneNumber,
   isCurrentMember: employee.isCurrentMember,
   previousData: $scope.currentEditingEmployee,
  };

  $scope.addEmployeeFormData = editEmployeeFormData;
  ModalService.showModal(modalId);
 };

 //submit edit employee form
 $scope.editEmployeeFormSubmit = function (modalId, addEmployeeForm) {
  console.log("Editing employee: ", $scope.addEmployeeFormData);
  UserService.updateUser(
   $scope.currentEditingEmployee._id,
   $scope.addEmployeeFormData
  )
   .then(function (response) {
    console.log("Employee updated successfully: ", response);
    SnackbarService.showAlert("Employee updated successfully", 2000, "success");
    getAllPeople();
    ModalService.hideModal(modalId);
   })
   .catch(function (error) {
    console.log("Error updating employee: ", error);
    addEmployeeForm.$invalid = true;
    addEmployeeForm.errorMessage = error.data.message;
   });
 };
}

trackflow.controller("companyPeopleController", [
 "$scope",
 "$timeout",
 "ModalService",
 "SnackbarService",
 "UserService",
 "RoleService",
 companyPeopleController,
]);
