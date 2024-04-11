function dashboardCompanyController(
 $scope,
 $timeout,
 $element,
 CompanyService,
 ModalService,
 SnackbarService,
 FilePreviewFactory,
 CompanyFactory
) {
 $scope.addCompanyFormData = {};

 $scope.companiesData = {};
 $scope.isEditing = false;
 $scope.currentEditingCompany = null;
  $scope.dateRangeOption = null


 //for previewing logo in form
 function filePreviewCallback(filesUrls) {
  console.log("Files here: ", filesUrls[0].url);
  $scope.addCompanyFormData.previewLogo = filesUrls;
 }

 FilePreviewFactory.initFileSelectionListener($scope, filePreviewCallback);
 $scope.addCompanyFormSubmit = function (modalId, addCompanyForm) {
  console.log("Form data: ", $scope.addCompanyFormData);

  var company = new CompanyFactory.Company($scope.addCompanyFormData);

  console.log("Company data: ", company);
  var errors = company.validate();

  if (errors.length) {
   console.log("Errors: ", errors);
   addCompanyForm.$invalid = true;
   $scope.addCompanyFormErrors = errors;
  } else {
   company
    .save()
    .then(function (response) {
     console.log("Company saved successfully: ", response);
     SnackbarService.showAlert(
      "Company and Admin saved successfully ",
      2000,
      "success"
     );
     $scope.addCompanyFormData = {}; // reset form data
     addCompanyForm.$setPristine();
     addCompanyForm.$setUntouched();
     getCompanies();
     ModalService.hideModal(modalId);
    })
    .catch(function (err) {
     console.error("Error saving company: ", err.data.message);
     console.log(addCompanyForm);
     addCompanyForm.$invalid = true;
     addCompanyForm.errorMessage = err.data.message;
    });
  }
 };

 //populate add company form with previous data
 $scope.editCompany = function (company, modalId) {
  $scope.currentEditingCompany = company;
  $scope.addCompanyFormData = CompanyFactory.prepareEditData(company);
  $scope.isEditing = true;
  ModalService.showModal(modalId);
 };

 $scope.editCompanyFormSubmit = function (modalId, editCompanyForm) {
  console.log("Editing company: ", $scope.addCompanyFormData);

  var company = new CompanyFactory.Company($scope.addCompanyFormData);

  console.log("Company data: ", company);
  var errors = company.validate();

  if (errors.length) {
   console.log("Errors: ", errors);
   editCompanyForm.$invalid = true;
   $scope.editCompanyFormErrors = errors;
  } else {
   company
    .edit($scope.currentEditingCompany._id)
    .then(function (response) {
     console.log("Company updated successfully: ", response);
     SnackbarService.showAlert(
      "Company updated successfully ",
      2000,
      "success"
     );
     $scope.addCompanyFormData = {}; // reset form data
     editCompanyForm.$setPristine();
     editCompanyForm.$setUntouched();
     getCompanies();
     ModalService.hideModal(modalId);
    })
    .catch(function (error) {
     console.error("Error updating company: ", error.message);
     editCompanyForm.$invalid = true;
     editCompanyForm.errorMessage = error.message;
    });
  }
 };


 $scope.dateOptionChange = function (option) {
  console.log("Option: ", option);
  $scope.dateRangeOption = option;

  getCompanies()
 }

 //display all companies
 function getCompanies(
  pageNo = 1,
  pageSize = 10,
  query = $scope.companiesData.query || ""
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
  CompanyService.getCompanies(pageNo, pageSize, query , dateRangeOption)
   .then(function (response) {
    $scope.companiesData = response.data;

    console.log("Companies: ", $scope.companiesData);
   })
   .catch(function (err) {
    console.error("Error getting companies: ", err);
   });
 }

 getCompanies();

 //on chaning page number
 $scope.pageChange = function (pageNo, pageSize) {
  console.log("Page changed: ", pageNo);
  getCompanies(pageNo, pageSize);
 };

 function searchCompanies(query) {
  console.log("Search query: ", query);
  $scope.companiesData.currentPage = 1;
  getCompanies(
   $scope.companiesData.currentPage,
   $scope.companiesData.pageSize,
   query
  );
 }

 var debounceTimeout;

 $scope.debounceSearch = function () {
  console.log("Debouncing...");
  $timeout.cancel(debounceTimeout);
  debounceTimeout = $timeout(function () {
   searchCompanies($scope.companiesData.query);
  }, 1000);
 };

 $scope.launchModal = function (modalId, addCompanyForm) {
  if ($scope.isEditing) {
   $scope.isEditing = false;
   $scope.addCompanyFormData = {};
   addCompanyForm?.$setPristine();
   addCompanyForm?.$setUntouched();
   angular.element("#companyLogo").val(null);
  }
  ModalService.showModal(modalId);
 };

 //change company status
 $scope.changeCompanyStatus = function (companyId, company) {
  var previousData = angular.copy(company);
  console.log("Company status before changed: ", company);
  company.isEnabled = !company.isEnabled;
  company.previousData = previousData;

  var company = new CompanyFactory.Company(company);

  console.log("Company data: ", company);
  var errors = company.validate();

  if (errors.length) {
   console.log("Errors: ", errors);
   return
  }

  company.edit(companyId)
   .then(function (response) {
    console.log("Company status changed", response);
    getCompanies(
     $scope.companiesData.currentPage,
     $scope.companiesData.pageSize
    );
   })
   .catch(function (error) {
    console.log("Error while changing company status", error.message);
   });
 };
}

trackflow.controller("dashboardCompanyController", [
 "$scope",
 "$timeout",
 "$element",
 "CompanyService",
 "ModalService",
 "SnackbarService",
 "FilePreviewFactory",
 "CompanyFactory",
 dashboardCompanyController,
]);
