function companyProjectsManageController(
 $scope,
 $timeout,
 $state,
 ModalService,
 SnackbarService,
 UserService,
 ProjectService,
 FilePreviewFactory,
 ProjectFactory
) {
 //add project form data
 function init() {
  function checkRole() {
   if (!$scope?.profile?.role?.permissionSet?.permissions?.PROJECT?.CREATE) {
    $state.go("company");
   }
  }

  checkRole();

  $scope.addProjectFormData = {
   inProgress: true,
   dueDate: new Date(),
  };

  $scope.minDueDate = new Date();
  $scope.isEditingProject = false;
  $scope.currentEditingProjectId = null;
 }

 init();

 $scope.projectData = {};
 $scope.keySuccess = false;
 $scope.currentlyViewingProject = {}
 //add project form data
//  $scope.addProjectFormSubmit = function (modalId, addProjectForm) {
//   // check if user role is not company admin and not present in addProjectFormData.members then add it

//   if ($scope.profile.role !== "COMPANY_ADMIN") {
//    var isCreatorPresent = $scope.addProjectFormData.members.some(function (
//     member
//    ) {
//     return member._id === $scope.profile._id;
//    });

//    if (!isCreatorPresent) {
//     $scope.addProjectFormData.members.push({
//      _id: $scope.profile._id,
//      firstname: $scope.profile.firstname,
//      lastname: $scope.profile.lastname,
//      email: $scope.profile.email,
//      image: $scope.profile.image,
//     });
//    }
//   }

//   $scope.addProjectFormData.companyDetails = {
//    _id: $scope.company._id,
//    name: $scope.company.name,
//    domain: $scope.company.domain,
//   };

//   $scope.addProjectFormData.createdBy = {
//    _id: $scope.profile._id,
//    firstname: $scope.profile.firstname,
//    lastname: $scope.profile.lastname,
//    email: $scope.profile.email,
//   };

//   console.log("Form data: ", $scope.addProjectFormData);
//   ProjectService.addProject($scope.addProjectFormData)
//    .then(function (response) {
//     SnackbarService.showAlert("Project created successfully", 2000, "success");
//     $state.reload("company.projects");
//     ModalService.hideModal(modalId);
//    })
//    .catch(function (error) {
//     console.log("Error adding employee: ", error);
//     addProjectForm.errorMessage = error.data.message;
//    });
//  };

$scope.addProjectFormSubmit = function (modalId, addProjectForm) {
  // check if user role is not company admin and not present in addProjectFormData.members then add it

  if ($scope.profile.role.name !== "COMPANY_ADMIN") {
   var isCreatorPresent = $scope.addProjectFormData.members.some(function (
    member
   ) {
    return member._id === $scope.profile._id;
   });

   if (!isCreatorPresent) {
    $scope.addProjectFormData.members.push({
     _id: $scope.profile._id,
     firstname: $scope.profile.firstname,
     lastname: $scope.profile.lastname,
     email: $scope.profile.email,
     image: $scope.profile.image,
    });
   }
  }

  var project = new ProjectFactory.Project($scope.addProjectFormData, $scope.profile, $scope.company);

  console.log("Form data: ", project);

  var errors = project.validate();

  if (errors.length > 0) {
   addProjectForm.errorMessages = errors;

   addProjectForm.$invalid = true;
   return;
  }
  else{
    project.save().then(function (response) {
      SnackbarService.showAlert("Project created successfully", 2000, "success");
      $state.reload("company.projects");
      ModalService.hideModal(modalId);
    })
    .catch(function (error) {
     console.log("Error adding employee: ", error);
     addProjectForm.$invalid = true;
     addProjectForm.errorMessage = error.data.message;
    });
  }
 };


 //populate form with project data
//  $scope.editProject = function (project, modalId) {
//   $scope.isEditingProject = true;
//   $scope.currentEditingProjectId = project._id;

//   console.log("Editing project: ", project);

//   var _project = angular.copy(project);

//   var editProjectFormData = _project;
  
//   editProjectFormData.previewLogo = [{ url: project.logo }];
//   editProjectFormData.previousLogo = project.logo;
//   editProjectFormData.dueDate = new Date(project.dueDate);
//   editProjectFormData.membersAlreadySelected = project.members;
//   editProjectFormData.removedMembers = [];

//   $scope.minDueDate = new Date(project.createdAt);
//   $scope.addProjectFormData = editProjectFormData;
//   ModalService.showModal(modalId);
//  };


$scope.editProject = function (project, modalId) {
  $scope.isEditingProject = true;
  $scope.currentEditingProjectId = project._id;
  console.log("Editing project: ", project);
  $scope.minDueDate = new Date(project.createdAt);
  $scope.addProjectFormData = ProjectFactory.prepareEditData(project);
  ModalService.showModal(modalId);
 };

 //edit project form submit
//  $scope.editProjectFormSubmit = function (modalId, editProjectForm) {
//   console.log("Editing project: ", $scope.addProjectFormData);
//   ProjectService.updateProject(
//    $scope.currentEditingProjectId,
//    $scope.addProjectFormData
//   )
//    .then(function (response) {
//     SnackbarService.showAlert("Project updated successfully", 2000, "success");
//     $state.reload("company.projects");
//     ModalService.hideModal(modalId);
//    })
//    .catch(function (error) {
//     console.log("Error updating project: ", error);
//     editProjectForm.errorMessage = error.data.message;
//     editProjectForm.$invalid = true;
//    });
//  };

 //to check if member is already present in the project
 
 $scope.removeLogo = function () {
  $scope.addProjectFormData.previewLogo = null;
  $scope.addProjectFormData.logo = null;
  $scope.addProjectFormData.previousLogo = null;
 };

 $scope.editProjectFormSubmit = function (modalId, editProjectForm) {
  console.log("Editing project: ", $scope.addProjectFormData);
 var project = new ProjectFactory.Project($scope.addProjectFormData, $scope.profile, $scope.company);

  var errors = project.validate();

  if (errors.length > 0) {
   editProjectForm.errorMessages = errors;

   editProjectForm.$invalid = true;
   return;
  }
  else{
    project.update($scope.currentEditingProjectId).then(function (response) {
      SnackbarService.showAlert("Project updated successfully", 2000, "success");
      $state.reload("company.projects");
      ModalService.hideModal(modalId);
    })
    .catch(function (error) {
     console.log("Error updating project: ", error);
     editProjectForm.$invalid = true;
     editProjectForm.errorMessage = error.data.message;
    });
  }

 };
 
 $scope.isMemberSelected = function (person) {
  return $scope.addProjectFormData.membersAlreadySelected?.some(function (
   member
  ) {
   return member._id === person._id;
  });
 };

 // add member to be removed from project to remove member array
 $scope.removeMember = function (person) {
  console.log("Removing member: ", person);
  $scope.addProjectFormData.removedMembers.push(person);
  $scope.addProjectFormData.membersAlreadySelected =
   $scope.addProjectFormData.membersAlreadySelected.filter(function (member) {
    return member._id !== person._id;
   });
 };

 function filePreviewCallback(filesUrls) {
  console.log("Files here: ", filesUrls[0].url);
  $scope.addProjectFormData.previewLogo = filesUrls;
 }

 FilePreviewFactory.initFileSelectionListener($scope, filePreviewCallback);

 //get all projects
 function getAllProjects(
  pageNo = 1,
  pageSize = 10,
  query = $scope.projectData.query || ""
 ) {
  ProjectService.getAllProjects({
   pageNo: pageNo,
   pageSize: pageSize,
   query,
  }).then(function (response) {
   console.log("All projects: ", response);
   $scope.projectData = response.data;
  });
 }

 getAllProjects();

 //on page change
 $scope.pageChange = function (pageNo, pageSize) {
  console.log("Page changed: ", pageNo);
  getAllProjects(pageNo, pageSize);
 };

 //serach project
 function searchProject(query) {
  console.log("Search query: ", query);
  getAllProjects($scope.projectData.currentPage, $scope.projectData.pageSize, {
   query: query,
  });
 }

 var debounceTimeout;

 $scope.debounceSearch = function () {
  console.log("Debouncing...");
  $timeout.cancel(debounceTimeout);
  debounceTimeout = $timeout(function () {
   searchProject($scope.projectData.query);
  }, 1000);
 };

 var debounceKeyCheckTimeout;

 $scope.debounceKeyCheck = function () {
  console.log("Debouncing...");
  $timeout.cancel(debounceKeyCheckTimeout);
  debounceKeyCheckTimeout = $timeout(function () {
    checkKeyUnique();
  }, 1000);
 };

 $scope.viewProject = function(project,modalId){
  $scope.currentlyViewingProject = angular.copy(project);
  ModalService.showModal(modalId);
 }

 function checkKeyUnique(){
  ProjectService.checkKeyInProject($scope.addProjectFormData.key, $scope.currentEditingProjectId).then(function (response) {
    console.log("Key check: ", response);
    if (response.data.exists) {
     $scope.keyError = "Key already exists";
     $scope.keySuccess = false;
    } else {
     $scope.keyError = "";
     $scope.keySuccess = true;
    }
   });
 }


 $scope.launchModal = function (modalId, addProjectForm) {
  if ($scope.isEditingProject) {
   init();
   if (addProjectForm) {
    addProjectForm.$setPristine();
    addProjectForm.$setUntouched();
   }
  }
  ModalService.showModal(modalId);
 };
}

trackflow.controller("companyProjectsManageController", [
 "$scope",
 "$timeout",
 "$state",
 "ModalService",
 "SnackbarService",
 "UserService",
 "ProjectService",
 "FilePreviewFactory",
 "ProjectFactory",
 companyProjectsManageController,
]);
