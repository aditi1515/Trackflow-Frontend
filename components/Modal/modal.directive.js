// Define the modal directive
trackflow.directive("myModal", function (ModalService) {
 return {
  restrict: "E",
  transclude: true,
  scope: {
   modalId: "@",
   title: "@",
   body: "@",
   closeBtnText: "@",
   confirmBtnText: "@",
   modalSize: "@",
   onClose: "&",
  },
  templateUrl: "../components/Modal/modal.html", // Path to the directive's template
  link: function (scope, element) {
   // Function to handle modal close
   scope.closeModal = function () {
    console.log("Close action performed", scope.onClose);
    if (scope.onClose) {
     scope.onClose();
    }
    ModalService.hideModal(scope.modalId);
   };

   // Function to handle modal confirm
   scope.confirmModal = function () {
    console.log("Confirm action performed");
    console.log("Modal ID: ", scope.modalId);
    console.log(scope.onConfirm);
    if (scope.onConfirm) {
     scope.onConfirm();
    }
    scope.closeModal();
   };

   // element.on("click", function (event) {
   //  console.log("Modal clicked", element[0], event.target.id);
   //  if (
   //   event.target.classList.contains("modal") ||
   //   event.target.classList.contains("modal-dialog")
   //  ) {
   //   scope.$apply(scope.closeModal);
   //  }
   // });
  },
 };
});
