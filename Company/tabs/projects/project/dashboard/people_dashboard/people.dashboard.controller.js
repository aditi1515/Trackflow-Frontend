function PeopleDashboardInProjectController(
 $scope,
 $state,
 AnalyticsService,
 ProjectService
) {
 $scope.projectId = $state.params.projectId;
 $scope.projectDetails = {};
 $scope.dateData = {};

 $scope.mPUPage = 1;
 $scope.totalPagesInMPU = 0;

 $scope.lPUPage = 1;
 $scope.totalPagesInLPU = 0;

 $scope.uWMPTPage = 1;
 $scope.totalPagesInUWMPT = 0;

 $scope.formDataInit = {
  startDate: new Date("2023-01-01"),
  endDate: new Date("2024-12-31"),
 };

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

 console.log("projectDetails: ", $scope.projectDetails);
 function getUsersInProject() {
  AnalyticsService.getUsersInProject($scope.projectId).then(function (
   response
  ) {
   $scope.usersInProject = response.data;
  });
 }

 getUsersInProject();

 function fetchProjectById() {
  ProjectService.getProjectById($scope.projectId).then(function (response) {
   $scope.projectDetails = response.data.project;
   $scope.dateData = {
    timePassed: Math.ceil(
     (new Date() - new Date($scope.projectDetails.createdAt)) /
      (1000 * 60 * 60 * 24)
    ),
    timeLeft: Math.ceil(
     (new Date($scope.projectDetails.dueDate) - new Date()) /
      (1000 * 60 * 60 * 24)
    ),
   };
  });
 }
 fetchProjectById();

 function getMostProductiveMembers() {
  var body = {
   startDate: "01-01-1900",
   endDate: "01-01-2100",
   sortBy: "MostEfficient",
   projectId: $scope.projectId,
  };

  AnalyticsService.getMostProductiveMembers(body).then(function (response) {
   $scope.mostProductiveMembersProject = response.data;
   console.log("mostProductiveMembers", $scope.mostProductiveMembersProject);
   displayMostProductiveMembersChart();
  });
 }

 $scope.mostProductiveMembersPageChange = function (page) {
  $scope.mPUPage = page;
  getMostProductiveMembers();
 };

 function displayMostProductiveMembersChart() {
  var data = $scope.mostProductiveMembersProject;

  var pageSize = 10;
  var totalPages = Math.ceil(data.length / pageSize);
  $scope.totalPagesInMPU = totalPages;
  var startIndex = ($scope.mPUPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var keys = data.map(function (d) {
   return d.firstName + " " + d.lastName;
  });
  console.log("dataset", data);
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

  var ctx = document.getElementById("mostProductiveMembers-chart-project");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

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
   startDate: "01-01-1900",
   endDate: "01-01-2100",
   sortBy: "LeastEfficient",
   projectId: $scope.projectId,
  };

  AnalyticsService.getMostProductiveMembers(body).then(function (response) {
   $scope.leastProductiveMembers = response.data;
   displayLeastProductiveMembersChart();
  });
 }

 $scope.leastProductiveMembersPageChange = function (page) {
  $scope.lPUPage = page;
  getLeastProductiveMembers();
 };

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

  var ctx = document.getElementById("leastProductiveMembers-chart-project");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

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

 function getLeastTicketResolvers() {
  var body = {
   status: "NOT_CLOSED",
   projectId: $scope.projectId,
  };

  AnalyticsService.getuserProductivityInTickets(body).then(function (response) {
   $scope.leastTicketResolvers = response.data;
   displayLeastTicketResolversChart();
  });
 }

 getLeastTicketResolvers();

 function displayLeastTicketResolversChart() {



    Chart.defaults.font.size = 10


  

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


 function getUsersWithMostTickets() {
  var body = {
    startDate: "01-01-1900",
    endDate: "01-01-2100",
    projectId : $scope.projectId
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
  var values = data.map(function (d) {
   return d.totalTickets;
  });

  var ctx = document.getElementById("usersWithMostTickets-chart");

  var existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }

  var keysAdjusted = keys.map(function (key){
    return key.split(" ");
  })

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


}

trackflow.controller("PeopleDashboardInProjectController", [
 "$scope",
 "$state",
 "AnalyticsService",
 "ProjectService",
 PeopleDashboardInProjectController,
]);
