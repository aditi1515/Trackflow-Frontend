function CompanyService($http, BASE_URL, FormDataFactory) {
  this.getCompanies = function (pageNo, pageSize, query) {
    return $http.get(
      BASE_URL +
        `company?pageNo=${pageNo}&&pageSize=${pageSize}&&query=${query}`
    );
  };

  this.saveCompany = function (company) {
    // var formData = FormDataFactory.getCompanyFormData(company); //get data from factory
    console.log("Company data: ", ...company);
    return $http.post(BASE_URL + "company", company, {
      headers: { "Content-Type": undefined },
    });
  };

  // this.changeCompanyStatus = function (companyId) {
  //   return $http.patch(
  //     BASE_URL + "company/" + companyId,
  //     {},
  //     {
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  // };

  this.editCompany = function (companyId, companyData) {
    // var formData = FormDataFactory.getCompanyFormData(companyData);
    return $http.patch(BASE_URL + "company/" + companyId, companyData, {
      headers: { "Content-Type": undefined },
    });
  };

  this.getCompanyByDomain = function (companyDomain) {
    return $http.get(
      BASE_URL + `company/getSiteDetails?domain=${companyDomain}`
    );
  };
}

trackflow.service("CompanyService", [
  "$http",
  "BASE_URL",
  "FormDataFactory",
  CompanyService,
]);
