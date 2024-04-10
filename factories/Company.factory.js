function CompanyFactory(CompanyService) {
 function Company(company) {
  this.name = company.name;
  this.city = company.city;
  this.state = company.state;
  this.country = company.country;
  this.domain = company.domain;

  this.admin = {
   firstname: company.admin.firstname,
   lastname: company.admin.lastname,
   email: company.admin.email,
   phoneNumber: company.admin.phoneNumber,
  };

  if (company.isEnabled !== undefined) {
   this.isEnabled = company.isEnabled;
  }

  if (company.logo) {
   this.logo = company.logo;
  }

  if (company.previousLogo) {
   this.previousLogo = company.previousLogo;
  }

  if (company.previousData) {
   this.previousData = company.previousData;
  }
 }

 // method to validate company data

 Company.prototype.validate = function () {
  var errors = [];
  if (!this.name) {
   errors.push("Company name is required");
  }

  if (!this.city) {
   errors.push("City is required");
  }

  if (!this.state) {
   errors.push("State is required");
  }

  if (!this.country) {
   errors.push("Country is required");
  }

  if (!this.domain) {
   errors.push("Domain is required");
  }

  if (!this.admin.firstname) {
   errors.push("First name is required");
  }

  if (!this.admin.lastname) {
   errors.push("Last name is required");
  }

  if (!this.admin.email) {
   errors.push("Email is required");
  }

  if (!this.admin.phoneNumber) {
   errors.push("Phone number is required");
  }

  // type checks

  if (typeof this.name !== "string") {
   errors.push("Company name must be a string");
  }

  if (typeof this.city !== "string") {
   errors.push("City must be a string");
  }

  if (typeof this.state !== "string") {
   errors.push("State must be a string");
  }

  if (typeof this.country !== "string") {
   errors.push("Country must be a string");
  }

  if (typeof this.domain !== "string") {
   errors.push("Domain must be a string");
  }

  if (typeof this.admin.firstname !== "string") {
   errors.push("First name must be a string");
  }

  if (typeof this.admin.lastname !== "string") {
   errors.push("Last name must be a string");
  }

  if (typeof this.admin.email !== "string") {
   errors.push("Email must be a string");
  }

  if (typeof this.admin.phoneNumber !== "string") {
   errors.push("Phone number must be a string");
  }

  return errors;
 };

 Company.prototype.save = function () {
  var formData = convertDataToFormData(this);
  console.log("this", this);
  console.log("formData", ...formData);
  return CompanyService.saveCompany(formData);
 };

 function prepareEditData(company) {
  var _company = angular.copy(company);
  _company.previewLogo = [{ url: company.logo }];
  _company.previousLogo = company.logo;
  _company.previousData = company;
  delete _company.logo;
  return _company;
 }

 Company.prototype.edit = function (companyId) {
  var formData = convertDataToFormData(this);
  return CompanyService.editCompany(companyId, formData);
 };

 return {
  Company: Company,
  prepareEditData: prepareEditData,
 };
}

trackflow.factory("CompanyFactory", ["CompanyService", CompanyFactory]);
