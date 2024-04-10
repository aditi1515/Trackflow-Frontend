function formDataFactory() {
 var factory = {};

 factory.getCompanyFormData = function (companyFormData) {
  console.log("Company data: ", companyFormData);
  var data = {
   name: companyFormData.name,
   city: companyFormData.city,
   state: companyFormData.state,
   domain: companyFormData.domain,
   country: companyFormData.country,
   previousLogo: companyFormData.previousLogo,
   admin: {
    firstname: companyFormData.admin.firstname,
    lastname: companyFormData.admin.lastname,
    email: companyFormData.admin.email,
    phoneNumber: companyFormData.admin.phoneNumber,
   },
  };

  if (companyFormData.previousData) {
   data.previousData = companyFormData.previousData;
  }

  if (companyFormData.isEnabled !== undefined) {
   data.isEnabled = companyFormData.isEnabled;
  }

  if (companyFormData.logo) {
   data.logo = companyFormData.logo;
  }

  // Validate name
  if (typeof data.name !== "string") {
   throw new Error("Name must be a string.");
  }

  // Validate city
  if (typeof data.city !== "string") {
   throw new Error("City must be a string.");
  }

  // Validate state
  if (typeof data.state !== "string") {
   throw new Error("State must be a string.");
  }

  // Validate domain
  if (typeof data.domain !== "string") {
   throw new Error("Domain must be a string.");
  }

  // Validate country
  if (typeof data.country !== "string") {
   throw new Error("Country must be a string.");
  }

  // Validate admin object
  if (typeof data.admin !== "object") {
   throw new Error("Admin must be an object.");
  } else {
   // Validate admin properties
   if (typeof data.admin.firstname !== "string") {
    throw new Error("Admin First Name must be a string.");
   }
   if (typeof data.admin.lastname !== "string") {
    throw new Error("Admin Last Name must be a string.");
   }
   if (typeof data.admin.email !== "string") {
    throw new Error("Admin Email must be a string.");
   }
   if (typeof data.admin.phoneNumber !== "string") {
    throw new Error("Admin Phone Number must be a string.");
   }
  }
  // Additional validations based on conditions
  if (data.isEnabled !== undefined && typeof data.isEnabled !== "boolean") {
   throw new Error("isEnabled must be a boolean.");
  }

  var formData = convertDataToFormData(data);

  return formData;
 };

 //project
 factory.getProjectFormData = function (project) {
  //  console.log("Project data: ", project);
  var data = {
   name: project.name,
   description: project.description,
   dueDate: project.dueDate,
   members: project.members,
   inProgress: project.inProgress,
   key: project.key,

   createdBy: {
    _id: project.createdBy._id,
    firstname: project.createdBy.firstname,
    lastname: project.createdBy.lastname,
    email: project.createdBy.email,
    image: project.createdBy.image,
   },
   companyDetails: {
    _id: project.companyDetails._id,
    name: project.companyDetails.name,
    domain: project.companyDetails.domain,
   },
  };

  if (project.logo) {
   data.logo = project.logo;
  }

  if (project.previousLogo) {
   data.previousLogo = project.previousLogo;
  }

  if (project.removedMembers) {
   data.removedMembers = project.removedMembers;
  }

  if (project.previousData) {
   data.previousData = project.previousData;
  }

  console.log("Project data: ", data);

  // Validate name
  if (typeof data.name !== "string") {
   throw new Error("Name must be a string.");
  }

  // Validate description
  if (typeof data.description !== "string") {
   throw new Error("Description must be a string.");
  }

  // Validate dueDate
  if (!(data.dueDate instanceof Date)) {
   throw new Error("Due date must be a Date object.");
  }

  // Validate members (assuming it's an array or object)
  if (!Array.isArray(data.members)) {
   throw new Error("Members must be an array or object.");
  }

  // Validate inProgress
  if (typeof data.inProgress !== "boolean") {
   throw new Error("In Progress must be a boolean.");
  }

  // Validate key
  if (typeof data.key !== "string") {
   throw new Error("Key must be a string.");
  }

  // Validate createdBy object
  if (typeof data.createdBy !== "object") {
   throw new Error("Created By must be an object.");
  } else {
   // Validate createdBy properties
   if (typeof data.createdBy._id !== "string") {
    throw new Error("Created By _id must be a string.");
   }
   if (typeof data.createdBy.firstname !== "string") {
    throw new Error("Created By First Name must be a string.");
   }
   if (typeof data.createdBy.lastname !== "string") {
    throw new Error("Created By Last Name must be a string.");
   }
   if (typeof data.createdBy.email !== "string") {
    throw new Error("Created By Email must be a string.");
   }
  }

  // Validate companyDetails object
  if (typeof data.companyDetails !== "object") {
   throw new Error("Company Details must be an object.");
  } else {
   // Validate companyDetails properties
   if (typeof data.companyDetails._id !== "string") {
    throw new Error("Company Details _id must be a string.");
   }
   if (typeof data.companyDetails.name !== "string") {
    throw new Error("Company Details Name must be a string.");
   }
   if (typeof data.companyDetails.domain !== "string") {
    throw new Error("Company Details Domain must be a string.");
   }
  }

  var formData = convertDataToFormData(data);

  return formData;
 };

 //ticket
 factory.getTicketFormData = function (data) {
  var ticketData = {
   title: data.title,
   description: data.description || "",
   dueDate: data.dueDate,
   status: data.status,
   ticketType: data.ticketType,
   priority: data.priority,
   assignees: data.assignees ? data.assignees : [],
   reporterClient: data.reporterClient,
   attachments: data.attachments,

   projectDetails: {
    _id: data.projectDetails._id,
    name: data.projectDetails.name,
    key: data.projectDetails.key,
   },
   companyDetails: {
    _id: data.companyDetails._id,
    name: data.companyDetails.name,
    domain: data.companyDetails.domain,
   },
   assignedBy: {
    _id: data.assignedBy._id,
    firstname: data.assignedBy.firstname,
    lastname: data.assignedBy.lastname,
    email: data.assignedBy.email,
    image: data.assignedBy.image,
   },
  };

  if (data.previousTicket) {
   ticketData.previousTicket = data.previousTicket;
  }

  if (data.removedAttachments) {
   ticketData.removedAttachments = data.removedAttachments;
  }

  if (data.previousAttachments) {
   ticketData.previousAttachments = data.previousAttachments;
  }

  if (data.alreadyAssigned) {
   ticketData.alreadyAssigned = data.alreadyAssigned;
  }

  if (data.removeAssignees) {
   ticketData.removeAssignees = data.removeAssignees;
  }

  // Validate title
  if (typeof ticketData.title !== "string") {
   throw new Error("Title must be a string.");
  }

  // Validate description
  if (typeof ticketData.description !== "string") {
   throw new Error("Description must be a string.");
  }

  // Validate dueDate (assuming it's a Date object)
  if (!(ticketData.dueDate instanceof Date)) {
   throw new Error("Due date must be a Date object.");
  }

  // Validate status
  if (typeof ticketData.status !== "string") {
   throw new Error("Status must be a string.");
  }

  // Validate ticketType
  if (typeof ticketData.ticketType !== "string") {
   throw new Error("Ticket type must be a string.");
  }

  // Validate priority
  if (typeof ticketData.priority !== "string") {
   throw new Error("Priority must be a string.");
  }

  // Validate assignees (assuming it's an array)
  if (ticketData.assignees && !Array.isArray(ticketData.assignees)) {
   throw new Error("Assignees must be an array.");
  }

  // Validate reporterClient
  if (typeof ticketData.reporterClient !== "string") {
   throw new Error("Reporter client must be a string.");
  }

  // Validate projectDetails object
  if (typeof ticketData.projectDetails !== "object") {
   throw new Error("Project details must be an object.");
  } else {
   // Validate projectDetails properties
   if (typeof ticketData.projectDetails._id !== "string") {
    throw new Error("Project Details _id must be a string.");
   }
   if (typeof ticketData.projectDetails.name !== "string") {
    throw new Error("Project Details Name must be a string.");
   }
   if (typeof ticketData.projectDetails.key !== "string") {
    throw new Error("Project Details Key must be a string.");
   }
  }

  // Validate companyDetails object
  if (typeof ticketData.companyDetails !== "object") {
   throw new Error("Company details must be an object.");
  } else {
   // Validate companyDetails properties
   if (typeof ticketData.companyDetails._id !== "string") {
    throw new Error("Company Details _id must be a string.");
   }
   if (typeof ticketData.companyDetails.name !== "string") {
    throw new Error("Company Details Name must be a string.");
   }
   if (typeof ticketData.companyDetails.domain !== "string") {
    throw new Error("Company Details Domain must be a string.");
   }
  }

  // Validate assignedBy object
  if (typeof ticketData.assignedBy !== "object") {
   throw new Error("Assigned By must be an object.");
  } else {
   // Validate assignedBy properties
   if (typeof ticketData.assignedBy._id !== "string") {
    throw new Error("Assigned By _id must be a string.");
   }
   if (typeof ticketData.assignedBy.firstname !== "string") {
    throw new Error("Assigned By First Name must be a string.");
   }
   if (typeof ticketData.assignedBy.lastname !== "string") {
    throw new Error("Assigned By Last Name must be a string.");
   }
   if (typeof ticketData.assignedBy.email !== "string") {
    throw new Error("Assigned By Email must be a string.");
   }
   if (typeof ticketData.assignedBy.image !== "string") {
    throw new Error("Assigned By Image must be a string.");
   }
  }

  if (
   ticketData.removedAttachments &&
   !Array.isArray(ticketData.removedAttachments)
  ) {
   throw new Error("Removed Attachments must be an array.");
  }

  if (
   ticketData.previousAttachments &&
   !Array.isArray(ticketData.previousAttachments)
  ) {
   throw new Error("Previous Attachments must be an array.");
  }

  if (
   ticketData.alreadyAssigned &&
   !Array.isArray(ticketData.removeAssignees)
  ) {
   throw new Error("Already Assigned must be a array.");
  }

  if (
   ticketData.removeAssignees &&
   !Array.isArray(ticketData.removeAssignees)
  ) {
   throw new Error("Remove Assignees must be an array.");
  }

  var formData = convertDataToFormData(ticketData);

  // console.log("FormData: by generalised ", ...formData);
  return formData;
 };

 return factory;
}

trackflow.factory("FormDataFactory", [formDataFactory]);
