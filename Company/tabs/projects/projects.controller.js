function companyProjectsController(
 $scope,
 $state,
 $timeout,
 ProjectService,
 UserService,
 TicketService,
 ModalService,
 SnackbarService,
 FilePreviewFactory,
 TicketFactory
) {
 $scope.allEmployeesInCompany = [];
 $scope.formHolder = {};

 //blob url
 function filePreviewCallback(filesUrls) {
  console.log("Files here: ", filesUrls[0].url);
  $scope.previewAttachments = filesUrls;
 }

 $scope.addGlobalTicketFormData = {};
 FilePreviewFactory.initFileSelectionListener($scope, filePreviewCallback);

 $scope.isImage = function (preview) {
  // Check if the fileType starts with "image/"
  return preview.type && preview.type.startsWith("image/");
 };

 //get all projects
 function getAllProjects() {
  ProjectService.getAllProjects().then(function (response) {
   console.log("All projects: ", response);
   $scope.projects = response.data.projects;
  });
 }

 getAllProjects();

 //get all employees
 function getAllEmployeesInCompany() {
  UserService.getAllUsers({
   onlyEnabled: true,
  }).then(function (response) {
   console.log("All people: ", response.data.users);
   $scope.allEmployeesInCompany = response.data.users;
  });
 }

 getAllEmployeesInCompany();

 $scope.setCurrentProject = function (projectId) {
  $scope.currentlySelectedProject = $scope.projects.find(function (project) {
   return project._id === projectId;
  });

  console.log("Currently selected project: ", $scope.currentlySelectedProject);
 };

 $scope.addTicketFormSubmit = function (modalId, addGlobalTicketForm) {
  console.log("Add ticket form data: ", $scope.addGlobalTicketFormData);

  $scope.addGlobalTicketFormData.projectDetails = {
   _id: $scope.currentlySelectedProject._id,
   name: $scope.currentlySelectedProject.name,
   key: $scope.currentlySelectedProject.key,
  };

  $scope.addGlobalTicketFormData.companyDetails = {
   _id: $scope.company._id,
   name: $scope.company.name,
   domain: $scope.company.domain,
  };

  $scope.addGlobalTicketFormData.assignedBy = {
   _id: $scope.profile._id,
   firstname: $scope.profile.firstname,
   lastname: $scope.profile.lastname,
   email: $scope.profile.email,
   image: $scope.profile.image,
  };

  // TicketService.createTicket($scope.addGlobalTicketFormData)
  //  .then(function (response) {
  //   console.log("Ticket created successfully: ", response);
  //   ModalService.hideModal(modalId);
  //   $scope.previewAttachments = [];
  //   SnackbarService.showAlert("Ticket created successfully", 2000, "success");

  //   $timeout(function () {
  //    $state.go("company.projects.project.ticket", {
  //     projectId: $scope.currentlySelectedProject._id,
  //    });
  //    $state.reload("company.projects.project.ticket", {
  //     projectId: $scope.currentlySelectedProject._id,
  //    });
  //   }, 3000);
  //  })
  //  .catch(function (error) {
  //   addTicketForm.errorMessage = error.message;
  //   console.log("Error adding ticket: ", error);
  //  });

  var ticket = new TicketFactory.Ticket($scope.addGlobalTicketFormData);
  var errors = ticket.validate();
  console.log("Errors: ", errors);

  if (errors.length) {
   addGlobalTicketForm.errorMessages = errors;
   console.log("Errors: ", errors);
   return;
  }
  else{
    console.log("Ticket created successfully");
    ticket.save().then(function(response){
      ModalService.hideModal(modalId);
      $scope.previewAttachments = [];
      SnackbarService.showAlert("Ticket created successfully", 2000, "success");
      $timeout(function(){
        $state.go("company.projects.project.ticket", {
          projectId: $scope.currentlySelectedProject._id,
         });
         $state.reload("company.projects.project.ticket", {
          projectId: $scope.currentlySelectedProject._id,
         });
      }, 3000);
    }).catch(function(error){
      addGlobalTicketForm.errorMessage = error.message;
      console.log("Error adding ticket: ", error);
    })
  }

 };

 $scope.launchModal = function (modalId) {
  $scope.addGlobalTicketFormData = {
   dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
   ticketType: "BUG",
   priority: "LOW",
   // projectDetails: $scope.currentlySelectedProject,
   status: "OPEN",
  };
  $scope.minDueDate = new Date();
  ModalService.showModal(modalId);
 };

 $scope.onModalClose = function () {
  $scope.addGlobalTicketFormData = {};
  $scope.formHolder.addGlobalTicketForm.$setPristine();
  $scope.formHolder.addGlobalTicketForm.$setUntouched();
 };
}
trackflow.controller("companyProjectsController", [
 "$scope",
 "$state",
 "$timeout",
 "ProjectService",
 "UserService",
 "TicketService",
 "ModalService",
 "SnackbarService",
 "FilePreviewFactory",
 "TicketFactory",
 companyProjectsController,
]);
