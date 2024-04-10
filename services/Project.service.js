function ProjectService($http, BASE_URL, FormDataFactory) {
 this.addProject = function (project) {
  // var projectFormData = FormDataFactory.getProjectFormData(project);

  return $http.post(BASE_URL + "project", project, {
   headers: { "Content-Type": undefined },
  });
 };

 this.getAllProjects = function (queryObject) {
  var queryString = QueryGenerator(queryObject);
  console.log("Query string: ", queryString);
  return $http.get(BASE_URL + "project/all?" + queryString);
 };

 
 this.updateProject = function (projectId, project) {
  // var projectFormData = FormDataFactory.getProjectFormData(project);
  return $http.patch(BASE_URL + "project/" + projectId, project, {
   headers: { "Content-Type": undefined },
  });
 };
 this.deleteProject = function (projectId) {
  return $http.delete(BASE_URL + "project/" + projectId);
 };
 this.getProjectById = function (projectId) {
  return $http.get(BASE_URL + "project/" + projectId);
 };
}

trackflow.service("ProjectService", [
 "$http",
 "BASE_URL",
 "FormDataFactory",
 ProjectService,
]);
