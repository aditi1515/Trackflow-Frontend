function RoleManagementController(
 $scope,
 ModalService,
 RoleService,
 SnackbarService
) {
 $scope.addRoleFormData = {};
 $scope.editRoleFormData = {};
 $scope.formHolder = {};
 $scope.currentEditingRole = {};
 $scope.presetNameError = false;
 $scope.launchModal = function (modalId) {
  $scope.presetNameError = false;

  ModalService.showModal(modalId);
 };

 function loadPermissionSet() {
  RoleService.getPermissionSets().then(function (permissionSets) {
   $scope.permissionSets = permissionSets;
   $scope.currentPermissionSet = angular.copy(
    permissionSets.find((set) => set.name === "Base Permission Set")
   );
  });
 }

 loadPermissionSet();

 $scope.isObject = function (value) {
  return typeof value === "object";
 };

 $scope.changePermissionSet = function (permissionSet) {
  console.log("Changing permission set: ", permissionSet);
  $scope.currentPermissionSet = angular.copy(permissionSet);
 };

 $scope.setBasePreset = function () {
  console.log($scope);
  $scope.currentPermissionSet = angular.copy(
   $scope.permissionSets.find((set) => set.name === "Base Permission Set")
  );
  $scope.addRoleFormData.permissions = $scope.currentPermissionSet;
 };

 $scope.saveRole = function (modalId) {
  console.log("currentPermissionSet: ", $scope.currentPermissionSet);

  var roleData = {
   name: $scope.addRoleFormData.roleName,
   permissionSet: $scope.currentPermissionSet,
   companyDetails: {
    _id: $scope.company._id,
    name: $scope.company.name,
    domain: $scope.company.domain,
   },
   createdBy: {
    _id: $scope.profile._id,
    firstname: $scope.profile.firstname,
    lastname: $scope.profile.lastname,
    email: $scope.profile.email,
    image: $scope.profile.image,
   },
  };
  console.log("Role data: ", roleData);
  RoleService.saveRole(roleData)
   .then(function (response) {
    console.log("Role saved: ", response);
    ModalService.hideModal(modalId);
    $scope.currentPermissionSet = angular.copy($scope.permissionSets[0]);
    $scope.addRoleFormData = {};
    $scope.formHolder.addRoleForm.$setPristine();
    $scope.formHolder.addRoleForm.$setUntouched();
    SnackbarService.showAlert("Role saved successfully", 2000, "success");
    getAllRoles();
   })
   .catch(function (err) {
    $scope.formHolder.addRoleForm.errorMessage = err.data.message;
    $scope.formHolder.addRoleForm.$invalid = true;
    console.log("Error saving role: ", err);
   });
 };

 function getAllRoles() {
  RoleService.getAllRoles($scope.company._id).then(function (roles) {
   console.log("Roles: ", roles);
   $scope.roles = roles;
  });
 }

 getAllRoles();

 $scope.saveTemplate = function (presetName) {
  if (!presetName || presetName === "") {
   $scope.presetNameError = true;
   return;
  }

  var data = {
   name: presetName,
   permissions: $scope.currentPermissionSet.permissions,
   companyDetails: {
    _id: $scope.company._id,
    name: $scope.company.name,
    domain: $scope.company.domain,
   },
  };

  RoleService.saveTemplate(data)
   .then(function (res) {
    console.log("Template saved: ", res);
    SnackbarService.showAlert(
     "Template saved successfully with name" + presetName,
     2000,
     "success"
    );
   })
   .catch(function (err) {
    console.log("Error saving template: ", err);
   });
 };

 $scope.editRole = function (role, modalId) {
  $scope.editRoleFormData = angular.copy(role);
  $scope.currentEditingRole = role;
  $scope.launchModal(modalId);
 };

 $scope.editRoleSubmit = function (modalId) {
  console.log("Edit role: ", $scope.editRoleFormData);

  $scope.editRoleFormData.previousData = $scope.currentEditingRole;

  RoleService.updateRole($scope.editRoleFormData._id, $scope.editRoleFormData)
   .then(function (response) {
    console.log("Role updated: ", response);
    ModalService.hideModal(modalId);
    SnackbarService.showAlert("Role updated successfully", 2000, "success");
    $scope.editRoleFormData = {};
    getAllRoles();
   })
   .catch(function (err) {
    $scope.formHolder.editRoleForm.errorMessage = err.data.message;
    $scope.formHolder.editRoleForm.$invalid = true;
    console.log("Error updating role: ", err);
   });
 };
}

trackflow.controller("RoleManagementController", [
 "$scope",
 "ModalService",
 "RoleService",
 "SnackbarService",
 RoleManagementController,
]);
