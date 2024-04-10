function ProjectFactory(ProjectService) {
 function Project(project, createdBy, companyDetails) {
  this.name = project.name;
  this.description = project.description;
  this.dueDate = project.dueDate;
  this.inProgress = project.inProgress;
  this.key = project.key;
  this.members = project.members || [];

  if (project.logo) {
   this.logo = project.logo;
  }

  if (project.previousLogo) {
   this.previousLogo = project.previousLogo;
  }

  if (project.previousData) {
   this.previousData = project.previousData;
  }

  if (project.createdBy) {
   this.createdBy = project.createdBy;
  } else {
   this.createdBy = {
    _id: createdBy._id,
    firstname: createdBy.firstname,
    lastname: createdBy.lastname,
    email: createdBy.email,
    phoneNumber: createdBy.phoneNumber,
   };
  }

  if (project.companyDetails) {
   this.companyDetails = project.companyDetails;
  } else {
   this.companyDetails = {
    _id: companyDetails._id,
    name: companyDetails.name,
    domain: companyDetails.domain,
   };
  }

  if (project.membersAlreadySelected) {
   this.membersAlreadySelected = project.membersAlreadySelected;
  }

  if (project.removedMembers) {
   this.removedMembers = project.removedMembers;
  }
 }

 function prepareEditData(project) {
  var projectData = angular.copy(project);
  projectData.dueDate = new Date(project.dueDate);
  projectData.membersAlreadySelected = project.members;
  projectData.previewLogo = [{ url: project.logo }];
  projectData.previousLogo = project.logo;
  projectData.removedMembers = [];
  delete projectData.logo;
  return projectData;
 }

 Project.prototype.validate = function () {
  var errors = [];
  if (!this.name) {
   errors.push("Project name is required");
  }

  if (!this.description) {
   errors.push("Description is required");
  }

  if (!this.dueDate) {
   errors.push("Due date is required");
  }

  if (!this.key) {
   errors.push("Key is required");
  }

  if (!this.createdBy) {
   errors.push("Creator is required");
  }

  if (!this.companyDetails) {
   errors.push("Company details are required");
  }

  // type checks

  if (typeof this.name !== "string") {
   errors.push("Project name must be a string");
  }

  if (typeof this.description !== "string") {
   errors.push("Description must be a string");
  }

  if (typeof this.key !== "string") {
   errors.push("Key must be a string");
  }

  if (typeof this.inProgress !== "boolean") {
   errors.push("In progress must be a boolean");
  }

  return errors;
 };

 Project.prototype.save = function () {
  var projectFormData = convertDataToFormData(this);

  return ProjectService.addProject(projectFormData);
 };

 Project.prototype.update = function (projectId) {
  var projectFormData = convertDataToFormData(this);

  return ProjectService.updateProject(projectId, projectFormData);
 };

 return {
  Project: Project,
  prepareEditData: prepareEditData,
 };
}

trackflow.factory("ProjectFactory", ["ProjectService", ProjectFactory]);
