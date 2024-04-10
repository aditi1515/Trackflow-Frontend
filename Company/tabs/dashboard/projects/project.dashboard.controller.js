function CompanyProjectsDashboardController($scope, AnalyticsService) {
  $scope.formDataInit = {
    startDate:new Date(new Date().getFullYear()-1, new Date().getMonth(), new Date().getDate()),
    endDate: new Date(),
   };

  

 $scope.projectCountFormData = {};
 $scope.totalPagesInPWU = 0;
 $scope.pwuPage = 1;

 $scope.pwtPage = 1;
 $scope.totalPagesInPWT = 0;

 $scope.pctPage = 1;
 $scope.totalPagesInPCT = 0;

 $scope.pWPtPage = 1;
 $scope.totalPagesInPWPT = 0;

 $scope.projectAnalyticsSearchData = {};

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

 function fetchcountProjects() {
  var body = {
   startDate:
    $scope.projectAnalyticsSearchData.startDate ||
    $scope.formDataInit.startDate,
   endDate:
    $scope.projectAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getProjectCount(body).then(function (response) {
   $scope.dashboardProjects = response.data;
   displayProjectsCountChart();
  });
 }

 $scope.projectAnalyticsSearchDataChanged = function () {
  fetchcountProjects();
  getprojectWiseTickets();
  getprojectWiseUsers();
  getProjectCompletionTime();
  getProjectWisePendingTickets()
 };

 function displayProjectsCountChart() {
  var data = $scope.dashboardProjects;

  var chartDiv = document.getElementById("projectsCountChart");

  var existsChart = Chart.getChart(chartDiv);
  if (existsChart) {
   existsChart.destroy();
  }

  new Chart(chartDiv, {
   type: "pie",
   data: {
    labels: ["InProgress", "Completed"],
    datasets: [
     {
      label: "Projects",
      data: [data.inProgress, data.complete],
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
      borderWidth: 1,
     },
    ],
   },
  });
 }
 fetchcountProjects();

 function getprojectWiseUsers() {
  var body = {
   startDate:
    $scope.projectAnalyticsSearchData.startDate ||
    $scope.formDataInit.startDate,
   endDate:
    $scope.projectAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getprojectWiseUsers(body).then(function (response) {
   $scope.projectWiseUsers = response.data;
   console.log("projectWiseUsers", $scope.projectWiseUsers);
   displayprojectWiseUsersChart();
  });
 }
 getprojectWiseUsers();

 function displayprojectWiseUsersChart() {
  var data = $scope.projectWiseUsers;

  var pageSize = 10;
  $scope.totalPagesInPWU = Math.ceil(data.length / pageSize);
  $scope.pwuPage = data.length > 0 ? 1 : 0;
  var startIndex = ($scope.pwuPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var chartDiv = document.getElementById("projectWiseUsersChart");
  var existsChart = Chart.getChart(chartDiv);
  if (existsChart) {
   existsChart.destroy();
  }

  console.log("data", data);
  let maxLength = 20;
  new Chart(chartDiv, {
   type: "bar",
   data: {
    labels: data.map(function (item) {
     return item.project.name.length > maxLength
      ? item.project.name.substring(0, maxLength) + "..."
      : item.project.name;
    }),
    datasets: [
     {
      label: "Users",
      data: data.map(function (item) {
       return item.userCount;
      }),
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
      borderWidth: 1,
     },
    ],
   },
   options: {
    scales: {
     x: {
      title: {
       display: true,
       text: "Projects",
      },
     },
     y: {
      title: {
       display: true,
       text: "Users",
      },
      beginAtZero: true,
      ticks: {
       stepSize: 1,
      },
     },
    },
   },
  });
 }

 function getprojectWiseTickets() {
  var body = {
   startDate:
    $scope.projectAnalyticsSearchData.startDate ||
    $scope.formDataInit.startDate,
   endDate:
    $scope.projectAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getprojectWiseTickets(body).then(function (response) {
   $scope.projectWiseTickets = response.data;
   console.log("projectWiseTickets", $scope.projectWiseTickets);
   displayprojectWiseTicketsChart();
  });
 }

 function displayprojectWiseTicketsChart() {
  var data = $scope.projectWiseTickets;
  var chartDiv = document.getElementById("ticketsInProjectChart");
  var existsChart = Chart.getChart(chartDiv);
  console.log(data);
  var pageSize = 10;

  $scope.totalPagesInPWT = Math.ceil(data.length / pageSize);
  var startIndex = ($scope.pwtPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  if (existsChart) {
   existsChart.destroy();
  }

  console.log("datadisplayprojectWiseTicketsChart ", data);

  var dataSets = [
   {
    label: "Bugs",
    data: data.map(function (item) {
     return item.bugs;
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    borderWidth: 1,
   },
   {
    label: "FR",
    data: data.map(function (item) {
     return item.fr;
    }),
    backgroundColor: graphColors.sort(function () {
     return Math.random() - 0.5;
    }),
    borderWidth: 1,
   },
  ];

  console.log("dataset", dataSets);
  let maxLength = 20;
  new Chart(chartDiv, {
   type: "bar",
   data: {
    labels: data.map(function (item) {
     return item.project.name.length > maxLength
      ? item.project.name.substring(0, maxLength) + "..."
      : item.project.name;
    }),
    datasets: dataSets,
   },
   options: {
    scales: {
     x: {
      title: {
       display: true,
       text: "Projects",
      },
     },
     y: {
      title: {
       display: true,
       text: "Tickets",
      },
      beginAtZero: true,
      ticks: {
       stepSize: 1,
      },
     },
    },
   },
  });
 }

 getprojectWiseTickets();

 $scope.projectWiseUsersPageChange = function (page) {
  $scope.pwuPage = page;
  displayprojectWiseUsersChart();
 };

 $scope.projectWiseTicketsPageChange = function (page) {
  $scope.pwtPage = page;
  displayprojectWiseTicketsChart();
 };

 function getProjectCompletionTime() {
  var body = {
   startDate:
    $scope.projectAnalyticsSearchData.startDate ||
    $scope.formDataInit.startDate,
   endDate:
    $scope.projectAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getProjectCompletionTime(body).then(function (response) {
   $scope.projectCompletionTime = response.data;
   console.log("projectCompletionTime", $scope.projectCompletionTime);
   displayProjectCompletionTimeChart();
  });
 }

 getProjectCompletionTime();

 function displayProjectCompletionTimeChart() {
  var data = $scope.projectCompletionTime;

  var pageSize = 10;
  $scope.totalPagesInPCT = Math.ceil(data.length / pageSize);
  var startIndex = ($scope.pctPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var chartDiv = document.getElementById("projectCompletionTimeChart");
  var existsChart = Chart.getChart(chartDiv);
  if (existsChart) {
   existsChart.destroy();
  }

  console.log("datadisplayProjectCompletionTimeChart ", data);

  new Chart(chartDiv, {
   type: "bar",
   data: {
    labels: data.map(function (item) {
     return item.name;
    }),
    datasets: [
     {
      label: "Average Time(hrs)",
      data: data.map(function (item) {
       return convertMillisecondsToHours(item.duration);
      }),
      backgroundColor: graphColors.sort(function () {
       return Math.random() - 0.5;
      }),
      borderWidth: 1,
     },
    ],
   },
   options: {
    scales: {
     x: {
      title: {
       display: true,
       text: "Projects",
      },
     },
     y: {
      title: {
       display: true,
       text: "Hours",
      },
      beginAtZero: true,
      ticks: {
       stepSize: 50,
      },
     },
    },
   },
  });
 }

 $scope.projectWiseCTPageChange = function (page) {
  $scope.pctPage = page;
  displayProjectCompletionTimeChart();
 };

 function getProjectWisePendingTickets() {
  var body = {
   startDate:
    $scope.projectAnalyticsSearchData.startDate ||
    $scope.formDataInit.startDate,
   endDate:
    $scope.projectAnalyticsSearchData.endDate || $scope.formDataInit.endDate,
   status: "NOT_CLOSED",
  };

  AnalyticsService.getProjectProductivityInTickets(body).then(function (
   response
  ) {
   $scope.projectWisePendingTickets = response.data;
   console.log("projectWisePendingTickets", $scope.projectWisePendingTickets);
   displayProjectWisePendingTicketsChart();
  });
 }

 function displayProjectWisePendingTicketsChart() {
  var data = $scope.projectWisePendingTickets;

  var pageSize = 10;
  $scope.totalPagesInPWPT = Math.ceil(data.length / pageSize);
  var startIndex = ($scope.pWPtPage - 1) * pageSize;
  data = data.slice(startIndex, Math.min(startIndex + pageSize, data.length));

  var chartDiv = document.getElementById("projectWisePendingTickets");
  var existsChart = Chart.getChart(chartDiv);
  if (existsChart) {
   existsChart.destroy();
  }

  console.log("datadisplayProjectWisePendingTicketsChart ", data);

  var dataSet = [
   {
    label: "Total Tickets",
    data: data.map(function (item) {
     return item.totalTickets;
    }),
    backgroundColor: graphColors[0],
    borderWidth: 1,
   },
   {
    label: "Open Tickets",
    data: data.map(function (item) {
     return item.openTickets;
    }),
    backgroundColor: graphColors[3],
    borderWidth: 1,
   },
   {
    label: "Closed Tickets",
    data: data.map(function (item) {
     return item.closedTickets;
    }),
    backgroundColor: graphColors[2],
    borderWidth: 1,
   },
  ];

  new Chart(chartDiv, {
   type: "bar",
   data: {
    labels: data.map(function (item) {
     return item.projectName;
    }),
    datasets: dataSet,
   },
   options: {
    scales: {
     x: {
      title: {
       display: true,
       text: "Projects",
      },
     },
     y: {
      title: {
       display: true,
       text: "Tickets",
      },
      beginAtZero: true,
      ticks: {
       stepSize: 1,
      },
     },
    },
   },
  });
 }

 getProjectWisePendingTickets();

 $scope.projectWisePendingTPageChange = function (page) {
  $scope.pWPtPage = page;
  displayProjectWisePendingTicketsChart();
 }
}

trackflow.controller("CompanyProjectsDashboardController", [
 "$scope",
 "AnalyticsService",
 CompanyProjectsDashboardController,
]);
