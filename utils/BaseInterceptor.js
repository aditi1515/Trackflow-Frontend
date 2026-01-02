trackflow.config(function ($httpProvider) {
 $httpProvider.interceptors.push("BaseUrlInterceptor");
});

// subdomain service
trackflow.service("subdomainService", function () {
 this.extractSubdomain = function () {
  var subdomain = window.location.hostname.split(".")[0];

  return subdomain;
 };
});

//backend base url
trackflow.constant("BASE_URL", "https://trackflow-backend-7ou9.onrender.com/api/");

trackflow.service("BaseUrlInterceptor", [
 "subdomainService",
 "$state",
 "$q",
 function (subdomainService, $state, $q) {
  this.request = function (config) {
   // Extract subdomain using subdomainService
   var subdomain = subdomainService.extractSubdomain();

   // Set company_id from subdomain
   config.headers = config.headers || {};

   if (subdomain !== "localhost") {
    config.headers["x_company_domain"] = subdomain;
   }

   var authToken =
    subdomain === "localhost"
     ? localStorage.getItem("superadmin_authToken")
     : localStorage.getItem(subdomain + "_authToken");

   if (authToken) {
    config.headers["Authorization"] = "Bearer " + authToken;
   }

   return config;
  };

  this.response = function (response) {
   return response;
  };

  this.responseError = function (rejection) {
   // Handle errors
   console.log("Response Error: ", rejection);
   if (rejection.status === 510 || rejection.status === 401) {
    $state.go("login");
   } else if (rejection.status === 403) {
    console.log("Forbidden");
    $state.go("company");
   }
   // It is important to reject the response error to keep the promise chain
   return $q.reject(rejection);
  };
 },
]);
