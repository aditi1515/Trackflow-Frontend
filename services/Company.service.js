function CompanyService($http, BASE_URL, FormDataFactory) {
  this.getCompanies = function (pageNo, pageSize, queryOnName,dateRangeOption) {

    var query = ""
    query += `pageNo=${pageNo}&&pageSize=${pageSize}&&query=${queryOnName}`
    console.log("dateRangeOption",dateRangeOption);
    if (dateRangeOption) {
     
      
      if (dateRangeOption.startDate) {
        query += `&&startDate=${dateRangeOption.startDate}`
      }

      if (dateRangeOption.endDate) {
        query += `&&endDate=${dateRangeOption.endDate}`
      }

    }

    console.log("query: " + query);
    return $http.get(
      BASE_URL +
        `company?${query}`
    );
  };

  this.saveCompany = function (company) {
    // var formData = FormDataFactory.getCompanyFormData(company); //get data from factory
    console.log("Company data: ", ...company);
    return $http.post(BASE_URL + "company", company, {
      headers: { "Content-Type": undefined },
    });
  };

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
