function CompanyUserDashboardController($scope, AnalyticsService) {
 $scope.formDataInit = {
  startDate:new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate()),
  endDate: new Date(),
 };

 $scope.peopleAnalyticsSearchData = {};

 $scope.roleBasedEmployeeCountData = {};

 $scope.uWMPTPage = 1;
 $scope.totalPagesInUWMPT = 0;

 $scope.mPUPage = 1;
  $scope.totalPagesInMPU = 0;

  $scope.lPUPage = 1;
  $scope.totalPagesInLPU = 0;

 var graphColors = [
  "#C2DFFF", // Periwinkle
  "#F5DCE8", // Lavender Rose
  "#D0F0C0", // Tea Green
  "#E2CCFF", // Light Pastel Purple
  "#FFDFD3", // Peach Puff
  "#C8E6C9", // Tea Green Light
  "#E1E0FF", // Periwinkle Light
  "#FFE5F7", // Pink Light
  "#D8FFCC", // Light Mint
  "#FFEEDD", // Light Apricot
 ];

 function fetchCompanySize() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getCompanySize(body).then(function (response) {
   $scope.companySize = response.data[0];
   displayCompanySizeChart();
  });
 }

 fetchCompanySize();

 $scope.countUserDateChanged = function () {
  fetchCompanySize();
 };

 function getUsersWithMostProjects() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getUsersWithMostProjects(body).then(function (response) {
   $scope.usersWithMostProjects = response.data;
   displayUsersWithMostProjectsChart();
  });
 }

 getUsersWithMostProjects();

 function displayUsersWithMostProjectsChart() {
  var data = $scope.usersWithMostProjects;

  var keys = data.map(function (d) {
   return d.details.user.firstname + ' ' + d.details.user.lastname;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var values = data.map(function (d) {
   return d.totalProjects;
  });

  var ctx = document.getElementById("usersWithMostProject-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: [
     {
      label: "ProjectCount",
      data: values,
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
     },
    ],
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "User Project Count",
     },
    },
   },
  });
 }

 $scope.peopleAnalyticsSearchDataChanged = function () {
  fetchCompanySize();
  getUsersWithMostProjects();
  getUsersWithMostTickets();
  getTopTicketResolvers();
  getLeastTicketResolvers();
  getMostProductiveMembers();
 };

 function employeesRoleDistribution() {
  AnalyticsService.getRoleBasedEmployeesCount().then(function (response) {
   $scope.roleBasedEmployeeCountData = response.data;
   displayemployeesRoleDistribution();
  });
 }

 function displayemployeesRoleDistribution() {
  var data = $scope.roleBasedEmployeeCountData;

  var keys = data.map(function (d) {
   return d._id;
  });
  var values = data.map(function (d) {
   return d.roleBasedCount;
  });

  var ctx = document.getElementById("EmployeeRoleDistribution");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "doughnut",
   data: {
    labels: keys,
    datasets: [
     {
      label: "Role",
      data: values,
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
     },
    ],
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    plugins: {
     title: {
      display: true,
      text: "Employee Role Distribution",
     },
    },
   },
  });
 }

 employeesRoleDistribution();

 function getUsersWithMostTickets() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getUsersWithMostTickets(body).then(function (response) {
   $scope.usersWithMostTickets = response.data;
   displayUsersWithMostTicketsChart();
  });
 }

 getUsersWithMostTickets();

 function displayUsersWithMostTicketsChart() {
  var data = $scope.usersWithMostTickets;
  console.log("displayUsersWithMostTciketsChart", data);

  var keys = data.map(function (d) {
   return d._id.firstname + " " + d._id.lastname;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var values = data.map(function (d) {
   return d.totalTickets;
  });

  var ctx = document.getElementById("usersWithMostTickets-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: [
     {
      label: "Ticket Count",
      data: values,
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
     },
    ],
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "User Ticket Count",
     },
    },
   },
  });
 }

 function getTopTicketResolvers() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
   status: "CLOSED",
  };

  AnalyticsService.getuserProductivityInTickets(body).then(function (response) {
   $scope.topTicketResolvers = response.data;
   console.log("topTicketResolvers", $scope.topTicketResolvers);
   displayTopTicketResolversChart();
  });
 }

 function displayTopTicketResolversChart() {
  var data = $scope.topTicketResolvers;

  var keys = data.map(function (d) {
   return d.firstname + " " + d.lastname;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var values = data.map(function (d) {
   return d.solvedTicketsCount;
  });

  var ctx = document.getElementById("topTicketResolvers-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: [
     {
      label: "Ticket Count",
      data: values,
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
     },
    ],
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "Top Ticket Resolvers",
     },
    },
   },
  });
 }

 getTopTicketResolvers();

 function getLeastTicketResolvers() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
   status: "NOT_CLOSED",
  };

  AnalyticsService.getuserProductivityInTickets(body).then(function (response) {
   $scope.leastTicketResolvers = response.data;
   displayLeastTicketResolversChart();
  });
 }

 getLeastTicketResolvers();

 function displayLeastTicketResolversChart() {
  var data = $scope.leastTicketResolvers;

  var pageSize = 10;
  var totalPages = Math.ceil(data.length / pageSize);
  $scope.totalPagesInUWMPT = totalPages;
  var startIndex = ($scope.uWMPTPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var keys = data.map(function (d) {
   return d.firstname + " " + d.lastname;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var values = data.map(function (d) {
   return d.solvedTicketsCount;
  });

  var ctx = document.getElementById("leastTicketResolvers-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: [
     {
      label: "Ticket Count",
      data: values,
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
     },
    ],
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "Most pending tickets",
     },
    },
   },
  });
 }

 $scope.userWithMostPendingTicketsPageChange = function (page) {
  $scope.uWMPTPage = page;
  getLeastTicketResolvers();
 };

 function getMostProductiveMembers() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
   sortBy: "MostEfficient",
  };

  AnalyticsService.getMostProductiveMembers(body).then(function (response) {
   $scope.mostProductiveMembers = response.data;
   console.log("mostProductiveMembers", $scope.mostProductiveMembers);
   displayMostProductiveMembersChart();
  });
 }

 $scope.mostProductiveMembersPageChange = function (page) {
  $scope.mPUPage = page;
  getMostProductiveMembers();
 }

 function displayMostProductiveMembersChart() {
  var data = $scope.mostProductiveMembers;

  var pageSize = 10;
  var totalPages = Math.ceil(data.length / pageSize);
  $scope.totalPagesInMPU = totalPages;
  var startIndex = ($scope.mPUPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var keys = data.map(function (d) {
   return d.firstName + " " + d.lastName;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var dataset = [
   {
    label: "Avg Time Taken(hrs) per Ticket",
    data: data.map(function (d) {
     return convertMillisecondsToHours(d.averageTimeTaken);
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    yAxisID: "y",
   },

   {
    label: "Average Efficiency %",
    data: data.map(function (d) {
     return d.averageEfficiency;
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    yAxisID: "y1",
   },
  ];

  var ctx = document.getElementById("mostProductiveMembers-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: dataset,
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "Most Productive Members",
     },
    },
    scales: {
     y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
       display: true,
       text: "Avg Time Taken (hrs)",
      },
     },
     y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
       display: true,
       text: "Efficiency %",
      },
      // grid line settings
      grid: {
       drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
     },
    },
   },
  });
 }

 getMostProductiveMembers();

 function getLeastProductiveMembers() {
  var body = {
   startDate:
    $scope.peopleAnalyticsSearchData.startDate || $scope.formDataInit.startDate,
   endDate:
    $scope.peopleAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
   sortBy: "LeastEfficient",
  };

  AnalyticsService.getMostProductiveMembers(body).then(function (response) {
   $scope.leastProductiveMembers = response.data;
   console.log("mostProductiveMembers", $scope.mostProductiveMembers);
   displayLeastProductiveMembersChart();
  });
 }

 $scope.leastProductiveMembersPageChange = function (page) {
  $scope.lPUPage = page;
  getLeastProductiveMembers();
 
 }

 function displayLeastProductiveMembersChart() {
  var data = $scope.leastProductiveMembers;

  var pageSize = 10;
  var totalPages = Math.ceil(data.length / pageSize);
  $scope.totalPagesInLPU = totalPages;
  var startIndex = ($scope.lPUPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var keys = data.map(function (d) {
   return d.firstName + " " + d.lastName;
  });

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

  var dataset = [
   {
    label: "Avg Time Taken(hrs) per Ticket",
    data: data.map(function (d) {
     return convertMillisecondsToHours(d.averageTimeTaken);
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    yAxisID: "y",
   },

   {
    label: "Average Efficiency %",
    data: data.map(function (d) {
     return d.averageEfficiency;
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    yAxisID: "y1",
   },
  ];

  var ctx = document.getElementById("leastProductiveMembers-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }
  new Chart(ctx, {
   type: "bar",
   data: {
    labels: keysAdjusted,
    datasets: dataset,
   },
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    ticks: {
     stepSize: 1,
    },
    plugins: {
     title: {
      display: true,
      text: "Least Productive Members",
     },
    },
    scales: {
     y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
       display: true,
       text: "Avg Time Taken (hrs)",
      },
     },
     y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
       display: true,
       text: "Efficiency %",
      },
      // grid line settings
      grid: {
       drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
     },
    },
   },
  });
 }

 getLeastProductiveMembers();
}

trackflow.controller("CompanyUserDashboardController", [
 "$scope",
 "AnalyticsService",
 CompanyUserDashboardController,
]);
