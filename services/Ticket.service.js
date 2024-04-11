function TicketService($http, BASE_URL, FormDataFactory) {
 this.createTicket = function (ticketData) {
  return $http.post(BASE_URL + "ticket", ticketData, {
   headers: { "Content-Type": undefined },
  });
 };
 this.updateTicket = function (ticketId, ticketData) {
  // console.log("ticketData", ticketData);
  // var formdata = FormDataFactory.getTicketFormData(ticketData);
  return $http.patch(BASE_URL + "ticket/" + ticketId, ticketData, {
   headers: { "Content-Type": undefined },
  });
 };

 this.getAllTickets = function (queryObject) {
  var queryString = QueryGenerator(queryObject);
  console.log("Query string: ", queryString);

  return $http.get(BASE_URL + "ticket/all?" + queryString);
 };
}

trackflow.service("TicketService", [
 "$http",
 "BASE_URL",
 "FormDataFactory",
 TicketService,
]);
