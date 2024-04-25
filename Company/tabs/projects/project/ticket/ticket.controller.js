function ticketController(
  $scope,
  $state,
  $timeout,
  $stateParams,
  ModalService,
  SnackbarService,
  TicketService,
  UserService,
  FilePreviewFactory,
  TicketFactory
) {
  $scope.addTicketFormData = {};
  $scope.ticketFormSubmitted = false;
  $scope.ticketEditFormSubmitted = false;

  function init() {
    $scope.addTicketFormData.dueDate = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    );
    $scope.minDueDate = new Date();
    $scope.isEditing = false;
  }

  $scope.myTicketsFilter = false;

  init();

  $scope.launchModal = function (modalId) {
    ModalService.showModal(modalId);
    init();
  };

  $scope.addTicketFormSubmit = function (modalId, addTicketForm) {
    console.log("Add ticket form data: ", $scope.addTicketFormData);

    if ($scope.ticketFormSubmitted) return;

    $scope.ticketFormSubmitted = true;

    var ticket = new TicketFactory.Ticket(
      $scope.addTicketFormData,
      $scope.projectDetails,
      $scope.company,
      $scope.profile
    );

    var errors = ticket.validate();
    console.log("Errors: ", errors);
    if (errors.length) {
      addTicketForm.errorMessages = errors;
      addTicketForm.$invalid = true;
      return;
    } else {
      ticket
        .save()
        .then(function (response) {
          console.log("Ticket created successfully: ", response);
          ModalService.hideModal(modalId);
          SnackbarService.showAlert(
            "Ticket created successfully",
            2000,
            "success"
          );

          $scope.addTicketFormData = {};
          addTicketForm.$setPristine();
          addTicketForm.$setUntouched();

          // reload  after 2 sec

          $timeout(function () {
            $state.reload("company.projects.project.ticket");
          }, 2000);
        })
        .catch(function (error) {
          addTicketForm.errorMessage = error.message;
          addTicketForm.$invalid = true;
          console.log("Error adding ticket: ", error);
        });
    }
  };

  //edit ticket
  $scope.editTicketToggle = function (modalId,editTicketForm) {
    if ($scope.isEditing) {
      //  init();
      $scope.viewTicket(modalId, $scope.currentEditingTicket);
    } else {
      $scope.isEditing = true;
    }
    editTicketForm.$setPristine();
    editTicketForm.$setUntouched();
    console.log("Editing ticket: ", $scope.isEditing , editTicketForm) ;
  };

  $scope.editTicketSubmit = function (modalId, editTicketForm) {
    if($scope.ticketEditFormSubmitted) return;
    $scope.ticketEditFormSubmitted = true;

    var ticket = new TicketFactory.Ticket($scope.viewTicketDetails);

    var errors = ticket.validate();
    if (errors.length) {
      editTicketForm.errorMessages = errors;
      editTicketForm.$invalid = true;
      return;
    } else {
      console.log("Editing ticket: ", $scope.viewTicketDetails);
      ticket
        .update($scope.viewTicketDetails._id)
        .then(function (response) {
          console.log("Ticket updated successfully: ", response);
          $scope.ticketEditFormSubmitted = false
          $scope.viewTicketDetails = {};
          editTicketForm.$setPristine();
          editTicketForm.$setUntouched();

          SnackbarService.showAlert(
            "Ticket updated successfully",
            2000,
            "success"
          );
          ModalService.hideModal(modalId);
          getAllTickets();
        })
        .catch(function (error) {
          editTicketForm.errorMessage = error.data.message;
          editTicketForm.$invalid = true;
          $scope.ticketEditFormSubmitted = false
          console.error("Error updating ticket: ", error);
        });
    }
  };

  $scope.isCurrentlyInProject = function (assigneee) {
    return $scope.membersInProject.some(function (member) {
      return member._id === assigneee._id
    })
  }

  $scope.checkIfTicketIsPending = function (ticket) {
    // based on status and duedate
    return (
      ["OPEN", "IN PROGRESS"].includes(ticket.status) &&
      new Date(ticket.dueDate) < new Date()
    );
  };

  function filePreviewCallback(filesUrls) {
    if ($scope.isEditing) {
      $scope.viewTicketDetails.attachmentsPreview = filesUrls;
    } else {
      $scope.addTicketFormData.attachmentsPreview = filesUrls;
    }
  }

  FilePreviewFactory.initFileSelectionListener($scope, filePreviewCallback);

  $scope.isImage = function (preview) {
    // Check if the fileType starts with "image/"
    return preview.type && preview.type.startsWith("image/");
  };

  $scope.isImageUrl = function (url) {
    // check extensions
    var imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    var extension = url.split(".").pop();

    return imageExtensions.includes(extension);
  };

  //set reporter client
  $scope.setReporterClient = function () {
    var currentUsername =
      $scope.profile.firstname + " " + $scope.profile.lastname;
    $scope.viewTicketDetails.reporterClient =
      $scope.viewTicketDetails.reporterClient || currentUsername;
  };

  //get all tickets
  function getAllTickets(pageNo = 1, pageSize = 10, query = {}) {
    if ($scope.myTicketsFilter) {
      query["myTickets"] = "My Tickets";
    }

    if ($scope.selectedBasicFilter) {
      query[$scope.selectedBasicFilter.filterType] =
        $scope.selectedBasicFilter.filterValue;
    }

    TicketService.getAllTickets({
      pageNo: pageNo,
      pageSize: pageSize,
      query: query,
      projectId: $state.params.projectId,
    }).then(function (response) {
      console.log("All tickets: ", response);
      $scope.ticketsData = response.data;
    });
  }

  //get all members ni project

  function getAllMembersInProject() {
    UserService.getAllUsersByProjectId({
      projectId: $state.params.projectId,
    }).then(function (response) {
      console.log("All members: ", response);
      $scope.membersInProject = response.data.users;

    });
  }

  getAllMembersInProject();

  $scope.basicFilterSelected = function (basicFilter) {
    $scope.selectedBasicFilter = basicFilter;
    console.log("Basic filter selected: ", basicFilter);

    if (basicFilter.filterType === "myTickets") {
      $scope.myTicketsFilter = !$scope.myTicketsFilter;
      if (!$scope.myTicketsFilter) {
        return;
      }
    }

    var query = {};

    // Assigning the filter value to the appropriate property in the query object
    query[basicFilter.filterType] = basicFilter.filterValue;

    console.log("Query: ", query);

    // Calling getAllTickets
    getAllTickets(
      $scope.ticketsData.currentPage,
      $scope.ticketsData.pageSize,
      query
    );
  };

  $scope.clearFilter = function () {
    $scope.selectedBasicFilter = null;
    $scope.myTicketsFilter = false;
    getAllTickets();
    $scope.searchTicket = "";
  };

  $scope.pageChange = function (pageNo, pageSize) {
    console.log("Page changed: ", pageNo, pageSize);
    $scope.searchTicket = "";
    getAllTickets(pageNo, pageSize);
  };

  //search tickets
  function searchTickets(nameSearch) {
    console.log("Search query: ", nameSearch);
    getAllTickets($scope.ticketsData.currentPage, $scope.ticketsData.pageSize, {
      name: nameSearch,
      description: nameSearch,
    });
  }

  var debounceTimeout;

  $scope.debounceSearch = function () {
    console.log("Debouncing...");
    $timeout.cancel(debounceTimeout);
    debounceTimeout = $timeout(function () {
      searchTickets($scope.searchTicket);
    }, 1000);
  };

  getAllTickets();

  //  view ticket
  $scope.viewTicket = function (modalId, ticket) {
    console.log("Viewing ticket: ", ticket);

    $scope.currentEditingTicket = ticket;
    $scope.isEditing = false;

  $scope.viewTicketDetails = angular.copy(ticket);
  $scope.viewTicketDetails.previousTicket = JSON.parse(angular.toJson(ticket));
  $scope.viewTicketDetails.removedAttachments = [];
  $scope.viewTicketDetails.previousAttachments = ticket.attachments;
  $scope.viewTicketDetails.alreadyAssigned = ticket.assignees;
  $scope.viewTicketDetails.assignees = [];
  $scope.viewTicketDetails.attachments = [];
  $scope.viewTicketDetails.removeAssignees = [];
  $scope.viewTicketDetails.dueDate = new Date(ticket.dueDate);
  $scope.minDueDate = new Date(ticket.createdAt);

    ModalService.showModal(modalId);
  };

  //to remove an existing attachment
  $scope.removeAttachment = function (url) {
    console.log("Removing attachment: ", url);

    $scope.viewTicketDetails.removedAttachments.push(url);

    $scope.viewTicketDetails.previousAttachments =
      $scope.viewTicketDetails.previousAttachments?.filter(function (preview) {
        return preview !== url;
      });

    console.log(
      "new attachments: ",
      $scope.viewTicketDetails.previousAttachments
    );
  };

  //check if the employee is already assigned ticket or not
  $scope.isAssigneeSelected = function (member) {
    return $scope.viewTicketDetails.alreadyAssigned?.some(function (m) {
      console.log("assign " ,m._id ,member._id);
      return m._id === member._id;
    });
  };

  //to remove assignee from ticket
  $scope.removeAssignee = function (member) {
    console.log("Removing member: ", member);
    $scope.viewTicketDetails.removeAssignees.push(member);
    $scope.viewTicketDetails.alreadyAssigned =
      $scope.viewTicketDetails.alreadyAssigned?.filter(function (m) {
        return m._id !== member._id;
      });
  };

  $scope.checkTicketEditAccess = function (isMetaInfo) {

    var updateAccess =
      $scope.profile.role.permissionSet.permissions.TICKET.UPDATE;



    if (
      updateAccess.FULL_ACCESS &&
      !updateAccess.ONLY_ENROLLED &&
      !updateAccess.MANAGE_ACCESS
    ) {

      return true;
    }

    if (updateAccess.MANAGE_ACCESS) {
 
      var isUserExistsInProject = $scope.projectDetails.members.some(function (
        member
      ) {
        return member._id === $scope.profile._id;
      });

      if (isUserExistsInProject) {
        if (isMetaInfo) {
          return updateAccess.FULL_ACCESS || updateAccess.ONLY_META_INFO;
        } else {
          console.log("return access: ", updateAccess.FULL_ACCESS);
          return updateAccess.FULL_ACCESS;
        }
      }
    }

    if (updateAccess.ONLY_ENROLLED) {
      var isUserExistsInTicket = $scope.currentEditingTicket.assignees.some(
        function (member) {
          return member._id === $scope.profile._id;
        }
      );

      if (isUserExistsInTicket) {
        if (isMetaInfo) {
          return updateAccess.FULL_ACCESS || updateAccess.ONLY_META_INFO;
        } else {
          return updateAccess.FULL_ACCESS;
        }
      }
    }

    return false;
  };
}

trackflow.controller("ticketController", [
  "$scope",
  "$state",
  "$timeout",
  "$stateParams",
  "ModalService",
  "SnackbarService",
  "TicketService",
  "UserService",
  "FilePreviewFactory",
  "TicketFactory",
  ticketController,
]);
