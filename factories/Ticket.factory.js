function TicketFactory(TicketService){

 function Ticket(ticket){
  this.title = ticket.title;
  this.description = ticket.description || "";
  this.dueDate = ticket.dueDate;
  this.status = ticket.status;
  this.priority = ticket.priority;
  this.ticketType = ticket.ticketType;
  this.assignees = ticket.assignees ? ticket.assignees : [];
  this.reporterClient = ticket.reporterClient;
  this.attachments = ticket.attachments;
  this.projectDetails = ticket.projectDetails;
  this.companyDetails = ticket.companyDetails;
  this.assignedBy = ticket.assignedBy;

  if(ticket.previousTicket){
    this.previousTicket = ticket.previousTicket;
  }

  if(ticket.removedAttachments){
    this.removedAttachments = ticket.removedAttachments;
  }

  if(ticket.previousAttachments){
    this.previousAttachments = ticket.previousAttachments;
  }

  if(ticket.alreadyAssigned){
    this.alreadyAssigned = ticket.alreadyAssigned;
  }

  if(ticket.removeAssignees){
    this.removeAssignees = ticket.removeAssignees;
  }



 }

 Ticket.prototype.validate = function(){

  var errors = [];

  if(!this.title){
   errors.push("Ticket title is required");
  }

  if(!this.dueDate){
   errors.push("Due date is required");
  }

  if(!this.status){
   errors.push("Status is required");
  }

  if(!this.priority){
   errors.push("Priority is required");
  }


  if(!this.ticketType){
   errors.push("Ticket type is required");
  }

  if(!this.reporterClient){
   errors.push("Reporter client is required");
  }

  if(!this.projectDetails){
   errors.push("Project details are required");
  }

  if(!this.companyDetails){
   errors.push("Company details are required");
  }

  if(!this.assignedBy){
   errors.push("Assigned by is required");
  }

  // type checks 

  if(typeof this.title !== "string"){
   errors.push("Ticket title must be a string");
  }

  if(this.description && typeof this.description !== "string"){
   errors.push("Description must be a string");
  }

  if(!(this.dueDate instanceof Date)){
   errors.push("Due date must be a date");
  }

  if(typeof this.status !== "string"){
   errors.push("Status must be a string");
  }

  if(typeof this.priority !== "string"){
   errors.push("Priority must be a string");
  }

  if(typeof this.ticketType !== "string"){
   errors.push("Ticket type must be a string");
  }

  if(typeof this.reporterClient !== "string"){
   errors.push("Reporter client must be an String");
  }

  return errors;
 }

 Ticket.prototype.save = function(){
  var ticketFormData = convertDataToFormData(this);
  return TicketService.createTicket(ticketFormData);
 }

 Ticket.prototype.update = function(ticketId){
  var ticketFormData = convertDataToFormData(this);
  return TicketService.updateTicket(ticketId, ticketFormData);
 }


 function prepareEditData(ticket){
  
 }
 
 return {
  Ticket: Ticket,
  prepareEditData: prepareEditData
 }


}

trackflow.factory("TicketFactory",["TicketService", TicketFactory])