function formDataFactory() {
    var factory = {};
   
    factory.getCompanyFormData = function (companyFormData) {
     console.log("Company data: ", companyFormData);
    //  var data = {
    //   name: companyFormData.name,
    //   city: companyFormData.city,
    //   state: companyFormData.state,
    //   domain: companyFormData.domain,
    //   country: companyFormData.country,
    //   previousLogo: companyFormData.previousLogo,
    //   admin: {
    //    firstname: companyFormData.admin.firstname,
    //    lastname: companyFormData.admin.lastname,
    //    email: companyFormData.admin.email,
    //    phoneNumber: companyFormData.admin.phoneNumber,
    //   },
    //   previousData: companyFormData.previousData,
    //  };
   
    //  if (companyFormData.isEnabled !== undefined) {
    //   data.isEnabled = companyFormData.isEnabled;
    //  }
   
    //  if (companyFormData.logo) {
    //   data.logo = companyFormData.logo;
    //  }
   
     var formData = convertDataToFormData(companyFormData);
   
     return formData;
    };
   
    //project
    factory.getProjectFormData = function (project) {
    //  console.log("Project data: ", project);
    //  var data = {
    //   name: project.name,
    //   description: project.description,
    //   dueDate: project.dueDate,
    //   members: project.members,
    //   removedMembers: project.removedMembers,
    //   previousLogo: project.previousLogo,
    //   inProgress: project.inProgress,
    //   key: project.key,
    //   previousData: project.previousData,
    //   createdBy: {
    //    _id: project.metaData.user._id,
    //    firstname: project.metaData.user.firstname,
    //    lastname: project.metaData.user.lastname,
    //    email: project.metaData.user.email,
    //    image: project.metaData.user.image,
    //   },
    //   companyDetails: {
    //    _id: project.metaData.company._id,
    //    name: project.metaData.company.name,
    //    domain: project.metaData.company.domain,
    //   },
    //  };
    //  console.log("project.logo", project.logo);
    //  if (project.logo) {
    //   data.logo = project.logo;
    //  }
     console.log("Data before form: ", project);
     var formData = convertDataToFormData(project);
   
     return formData;
    };
   
    //ticket
    factory.getTicketFormData = function (ticketData) {
     console.log("Ticket data: in getTicketFormData", ticketData);
     // Validate title
     if (typeof ticketData.title !== "string") {
      return new Error("Title must be a string.");
     }
   
     // Validate description
     if (ticketData.description && typeof ticketData.description !== "string") {
      return new Error("Description must be a string.");
     }
   
     // Validate dueDate
     if (!(ticketData.dueDate instanceof Date)) {
      return new Error("Due date must be a Date object.");
     }
   
     // Validate status
     if (typeof ticketData.status !== "string") {
      return new Error("Status must be a string.");
     }
   
     // Validate ticketType
     if (typeof ticketData.ticketType !== "string") {
      return new Error("Ticket type must be a string.");
     }
   
     // Validate priority
     if (typeof ticketData.priority !== "string") {
      return new Error("Priority must be a string.");
     }
   
     // Validate projectDetails
     if (
      ticketData.projectDetails &&
      typeof ticketData.projectDetails !== "object"
     ) {
      return new Error("Project details must be an object.");
     }
   
   
    //  var data = {
    //   title: ticketData.title,
    //   description: ticketData.description || "",
    //   dueDate: ticketData.dueDate,
    //   status: ticketData.status,
    //   ticketType: ticketData.ticketType,
    //   priority: ticketData.priority,
    //   assignees: ticketData.assignees ? ticketData.assignees : [],
    //   alreadyAssigned: ticketData.alreadyAssigned,
    //   reporterClient: ticketData.reporterClient,
    //   removeAssignees: ticketData.removeAssignees,
    //   previousAttachments: ticketData.previousAttachments,
    //   removedAttachments: ticketData.removedAttachments,
    //   attachments: ticketData.attachments,
    //   previousTicket: ticketData.previousTicket,
    //  };
   
    //  if (ticketData.metaData.projectDetails !== null) {
    //   data.projectDetails = {
    //    _id: ticketData.metaData.projectDetails._id,
    //    name: ticketData.metaData.projectDetails.name,
    //    key: ticketData.metaData.projectDetails.key,
    //   };
    //  }
   
    //  if (ticketData.metaData.companyDetails !== null) {
    //   data.companyDetails = {
    //    _id: ticketData.metaData.companyDetails._id,
    //    name: ticketData.metaData.companyDetails.name,
    //    domain: ticketData.metaData.companyDetails.domain,
    //   };
    //  }
    //  if (ticketData.metaData.user !== null) {
    //   data.assignedBy = {
    //    _id: ticketData.metaData.user._id,
    //    firstname: ticketData.metaData.user.firstname,
    //    lastname: ticketData.metaData.user.lastname,
    //    email: ticketData.metaData.user.email,
    //    image: ticketData.metaData.user.image,
    //   };
    //  }
   
     var formData = convertDataToFormData(ticketData);
   
     // console.log("FormData: by generalised ", ...formData);
     return formData;
    };
   
    return factory;
   }
   
   trackflow.factory("FormDataFactory", [formDataFactory]);