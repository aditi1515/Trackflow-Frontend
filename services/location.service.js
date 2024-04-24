function LocationService($http) {
 this.getCoutries = function () {
  return $http
   .get("https://api.countrystatecity.in/v1/countries", {
    headers: {
     "X-CSCAPI-KEY": "VE9EZGZiamdjQmpuSnFMeTdkVHZwRUF2emVBSXhSYUdTWTdXT2pEOA==",
    },
   })
   .then(function (response) {
    console.log("Countries: ", response.data);
    return response.data;
   });
 };

 this.getAllStates = function () {
  return $http
   .get("https://api.countrystatecity.in/v1/states", {
    headers: {
     "X-CSCAPI-KEY": "VE9EZGZiamdjQmpuSnFMeTdkVHZwRUF2emVBSXhSYUdTWTdXT2pEOA==",
    },
   })
   .then(function (response) {
    console.log("States: ", response.data);
    return response.data;
   });
 };

 this.getStates = function (countryIsoName) {
  return $http
   .get(
    "https://api.countrystatecity.in/v1/countries/" +
     countryIsoName +
     "/states",
    {
     headers: {
      "X-CSCAPI-KEY":
       "VE9EZGZiamdjQmpuSnFMeTdkVHZwRUF2emVBSXhSYUdTWTdXT2pEOA==",
     },
    }
   )
   .then(function (response) {
    console.log("States: ", response.data);
    return response.data;
   });
 };

 this.getCities = function (countryIsoName, stateIsoName) {
  var searchString =
   "https://api.countrystatecity.in/v1/countries/" + countryIsoName;

  if (stateIsoName) {
   searchString += "/states/" + stateIsoName + "/cities";
  } else {
   searchString += "/cities";
  }

  return $http
   .get(searchString, {
    headers: {
     "X-CSCAPI-KEY": "VE9EZGZiamdjQmpuSnFMeTdkVHZwRUF2emVBSXhSYUdTWTdXT2pEOA==",
    },
   })
   .then(function (response) {
    console.log("Cities: ", response.data);
    return response.data;
   });
 };
}

trackflow.service("LocationService", ["$http", LocationService]);
