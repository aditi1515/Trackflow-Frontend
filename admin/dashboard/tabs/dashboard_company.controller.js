function dashboardCompanyController(
 $scope,
 $timeout,
 $element,
 CompanyService,
 ModalService,
 SnackbarService,
 FilePreviewFactory
) {
 $scope.addCompanyFormData = {};

 $scope.companiesData = {};
 $scope.isEditing = false;
 $scope.currentEditingCompany = null;

 //for previewing logo in form
 function filePreviewCallback(filesUrls) {
  console.log("Files here: ", filesUrls[0].url);
  $scope.addCompanyFormData.previewLogo = filesUrls;
 }

 FilePreviewFactory.initFileSelectionListener($scope, filePreviewCallback);

 //add company form data
 $scope.addCompanyFormSubmit = function (modalId, addCompanyForm) {
  console.log("Form data: ", $scope.addCompanyFormData);
  CompanyService.saveCompany($scope.addCompanyFormData)
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
 };

 //populate add company form with previous data
 $scope.editCompany = function (company, modalId) {
  console.log(company);

  var _company = angular.copy(company);


  var editCompanyData = _company;
  editCompanyData.previousData = company;
  editCompanyData.previewLogo = [{ url: company.logo }];
  editCompanyData.previousLogo = company.logo;
  editCompanyData.admin.phoneNumber = parseInt(company.admin.phoneNumber);

  delete editCompanyData.logo;

  $scope.currentEditingCompany = company;
  $scope.addCompanyFormData = editCompanyData;
  // console.log($scope.editCompanyData);
  console.log($scope.addCompanyFormData);
  $scope.isEditing = true;
  ModalService.showModal(modalId);
 };

 //edit company form submit
 $scope.editCompanyFormSubmit = function (modalId, editCompanyForm) {

  console.log("Editing company: ", $scope.addCompanyFormData);

  CompanyService.editCompany(
   $scope.currentEditingCompany._id,
   $scope.addCompanyFormData
  )
   .then(function (response) {
    console.log("Company updated successfully: ", response);
    SnackbarService.showAlert("Company updated successfully ", 2000, "success");
    $scope.addCompanyFormData = {}; // reset form data
    editCompanyForm.$setPristine();
    editCompanyForm.$setUntouched();
    getCompanies();
    ModalService.hideModal(modalId);
   })
   .catch(function (err) {
    console.error("Error updating company: ", err.data.message);
    editCompanyForm.$invalid = true;
    editCompanyForm.errorMessage = err.data.message;
   });
 };

 //display all companies
 function getCompanies(
  pageNo = 1,
  pageSize = 10,
  query = $scope.companiesData.query || ""
 ) {
  CompanyService.getCompanies(pageNo, pageSize, query)
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

  console.log(companyId);
  CompanyService.editCompany(companyId, company)
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
 dashboardCompanyController,
]);
