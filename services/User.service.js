function UserService($q, $http, $state, BASE_URL, subdomainService) {
 //get user by id
 this.getUser = function (id) {
  return $http.get(BASE_URL + "user/" + id);
 };

 //add new user
 this.createUser = function (user) {
  console.log("User data: ", user);
  return $http.post(BASE_URL + "user/", user);
 };

 //update user by id
 this.updateUser = function (userId, user) {
  return $http.patch(BASE_URL + "user/" + userId, user);
 };

 //login user
 this.login = function (user) {
  return $http.post(BASE_URL + "user/login", user).then(function (response) {
   console.log("Login response: ", response.data);

   //check subdomain value and store token in localstorage
   var companyDomain = subdomainService.extractSubdomain();
   if (companyDomain && companyDomain !== "localhost") {
    //if company domain is not localhost
    localStorage.setItem(companyDomain + "_authToken", response.data.token);
   } else {
    localStorage.setItem("superadmin_authToken", response.data.token);
   }

   var user = response.data.user;

   if (user.role.name === "SUPER_ADMIN") {
    $state.go("superAdminDashboard");
   } else {
    $state.go("company");
   }
   return response;
  });
 };

 //get user from jwt
 this.isAuthenticated = function () {
  var deferred = $q.defer();

  $http
   .get(BASE_URL + "user/")
   .then(function (response) {
    console.log("Authenticated: ", response.data);
    deferred.resolve(response.data.user);
   })
   .catch(function (error) {
    console.log("Authenticated Error: ", error);
    deferred.reject(error);
   });

  return deferred.promise;
 };

 //get all users
 this.getAllUsers = function (queryObject) {
  var queryString = QueryGenerator(queryObject);

  return $http.get(BASE_URL + `user/all?${queryString}`);
 };

 //get all users of a project
 this.getAllUsersByProjectId = function (queryObject) {
  var queryString = QueryGenerator(queryObject);

  return $http.get(BASE_URL + `user/allByProjectId?${queryString}`);
 };

 this.logout = function () {
  var companyDomain = subdomainService.extractSubdomain();
  if (companyDomain && companyDomain !== "localhost") {
   localStorage.removeItem(companyDomain + "_authToken");
  } else {
   localStorage.removeItem("superadmin_authToken");
  }

  $state.go("login");
 };

 //to send reset password link to user
 this.forgotPassword = function (userEmail) {
  return $http.post(BASE_URL + "user/forgotPassword", userEmail);
 };

 //to reset password

 this.resetPassword = function (password, token) {
  return $http.post(BASE_URL + `user/resetPassword/${token.token}`, {
   password: password.newPassword,
  });
 };
}

trackflow.service("UserService", [
 "$q",
 "$http",
 "$state",
 "BASE_URL",
 "subdomainService",
 UserService,
]);
