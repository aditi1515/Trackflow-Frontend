trackflow.config(function ($httpProvider) {
 $httpProvider.interceptors.push("BaseUrlInterceptor");
});

// subdomain service
trackflow.service("subdomainService", function () {
  this.extractSubdomain = function () {
    var host = window.location.hostname;

    // Case 1: localhost or Render default domain
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.includes("onrender.com")
    ) {
      // tenant stored after login / selection
      return localStorage.getItem("active_company");
    }

    // Case 2: real tenant domain (company.trackflow.app)
    return host.split(".")[0];
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
      var domain = subdomainService.extractSubdomain();

      config.headers = config.headers || {};

      // Attach tenant header ONLY if present
      if (domain) {
        config.headers["x_company_domain"] = domain;
      }

      // Auth token resolution
      var authToken = domain
        ? localStorage.getItem(domain + "_authToken")
        : localStorage.getItem("superadmin_authToken");

      if (authToken) {
        config.headers["Authorization"] = "Bearer " + authToken;
      }

      return config;
    };

    this.responseError = function (rejection) {
      console.log("Response Error:", rejection);

      if (rejection.status === 401) {
        $state.go("login");
      } else if (rejection.status === 403) {
        $state.go("company");
      }

      return $q.reject(rejection);
    };
  }
]);

