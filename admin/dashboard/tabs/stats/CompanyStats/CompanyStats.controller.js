function companyStatsController($scope, AnalyticsService) {
 $scope.companyWisePeople = [];
 $scope.currtCWPpage = 1;
 $scope.totalPagesInCWP = 0;
 $scope.currtProjectCWPage = 1;
 $scope.totalPagesInProjectCW = 0;
 $scope.projectCountFormData = {};
 $scope.formDataInit = {
  startDate: new Date("2023-01-01"),
  endDate: new Date("2025-01-01"),
 };


 $scope.totalTickets = 0;
 $scope.ticketCountFormData = {};
 $scope.cptPage = 1;
 $scope.totalPagesInCPT = 0;
 $scope.projectTrendCountOption = "month";
 $scope.ticketTrendCountOption = "month";

 $scope.currLWCPage = 1;
 $scope.totalPagesInLWC = 0;

 $scope.locationWiseCompanyFormData = {
  locationOption: "country",
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

 function fetchcountProjectsInCompany() {
  AnalyticsService.getProjectsInCompany().then(function (response) {
   console.log("fetchcountProjectsInCompany", response);
   $scope.projectCountInCompany = response.data;
   $scope.totalPagesInProjectCW = Math.ceil(
    $scope.projectCountInCompany.length / 20
   );
   $scope.companyWiseProjectPageChange(1);
  });
 }

 fetchcountProjectsInCompany();

 $scope.companyWiseProjectPageChange = function (pageNo) {
  console.log("Page changed: ", pageNo);
  var pageSize = 20;

  var data = $scope.projectCountInCompany;

  var start = (pageNo - 1) * pageSize;
  var end = start + pageSize;
  data = data.slice(start, end);

  $scope.currtProjectCWPage = pageNo;
  displayProjectsInCompany(data);
 };

 function displayProjectsInCompany(chartData) {
  var labels = chartData.map(function (data) {
   return data._id.substring(0, Math.min(10, data._id.length));
  });

  var values = chartData.map(function (data) {
   return data.projectCount;
  });

  var data = {
   labels: labels,
   datasets: [
    {
     label: "Projects",
     data: values,
     backgroundColor: graphColors.sort(function () {
      return Math.random() - 0.5;
     }),
    },
   ],
  };

  var chartDiv = document.getElementById("companyWiseProjectsChart");

  var existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "bar",
   data: data,
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    scales: {
     x: {
      title: {
       display: true,
       text: "Companies",
      },
     },
     y: {
      beginAtZero: true,
      title: {
       display: true,
       text: "Project Count",
      },
      ticks: {
       stepSize: 1,
      },
     },
    },
   },
  });
 }

 function fetchprojectCount() {
  var body = {
   startDate:
    $scope.projectCountFormData.startDate || $scope.formDataInit.startDate,
   endDate: $scope.projectCountFormData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getProjectCount(body).then(function (response) {
   console.log("fetchprojectCount", response);
   $scope.projectCount = response.data;
  });
 }

 $scope.countProjectDateChanged = function () {
  fetchprojectCount();
 };

 //pie chart for project wise companies top 5
 function fetchTopCompany() {
  var limit = 5;
  AnalyticsService.getProjectsInCompany(limit, true).then(function (response) {
   console.log("topCompaniesProjectWise", response.data);
   displayTopCompanyChart(response.data);
  });
 }

 function displayTopCompanyChart(chartData) {
  var labels = chartData.map(function (data) {
   return data._id.substring(0, Math.min(10, data._id.length));
  });

  var values = chartData.map(function (data) {
   return data.projectCount;
  });

  var data = {
   labels: labels,
   datasets: [
    {
     label: "Projects",
     data: values,
     backgroundColor: graphColors.sort(function () {
      return Math.random() - 0.5;
     }),
    },
   ],
  };

  var chartDiv = document.getElementById("topCompanyProjectWiseChart");

  const existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "pie",
   data: data,
   options: {
    responsive: true,
    plugins: {
     title: {
      display: true,
      text: "Top 5 Companies Project Wise",
     },
     legend: {
      position: "right",
     },
    },
    animation: {
     animateRotate: true,
    },
   },
  });
 }

 function getTotalTickets() {
  var body = {
   startDate:
    $scope.ticketCountFormData.startDate || $scope.formDataInit.startDate,
   endDate: $scope.ticketCountFormData.endDate || $scope.formDataInit.endDate,
  };

  AnalyticsService.getTotalTickets(body).then(function (response) {
   console.log("getTotalTickets", response);
   $scope.totalTickets = formatNumber(response.data?.totalTickets);
  });
 }

 $scope.countTicketDateChanged = function () {
  getTotalTickets();
 };

 function getcompanyWiseTicketCounts() {
  AnalyticsService.companyWiseTicketCounts().then(function (response) {
   console.log("companyWiseTicketCounts", response.data);

   $scope.totalPagesInCPT = Math.ceil(
    response.data.companyWiseTickets.length / 20
   );
   $scope.companyWiseTicketCountsChartData = response.data.companyWiseTickets;
   displayCompanyWiseTicketCounts();
  });
 }

 function displayCompanyWiseTicketCounts() {
  var pageSize = 20;
  var chartData = $scope.companyWiseTicketCountsChartData;
  $scope.totalPagesInCPT = Math.ceil(chartData.length / pageSize);
  var startIndex = ($scope.cptPage - 1) * pageSize;
  chartData = chartData.slice(startIndex, startIndex + pageSize);

  var labels = chartData.map(function (data) {
   return data._id.substring(0, Math.min(10, data._id.length));
  });

  var values = chartData.map(function (data) {
   return data.totalTickets;
  });

  var data = {
   labels: labels,
   datasets: [
    {
     label: "Tickets",
     data: values,
     backgroundColor: graphColors.sort(function () {
      return Math.random() - 0.5;
     }),
     borderColor: graphColors.sort(function () {
      return Math.random() - 0.5;
     }),
    },
   ],
  };

  var config = {
   type: "bar",
   data: data,
   options: {
    scales: {
     x: {
      title: {
       display: true,
       text: "Companies",
      },
     },
     y: {
      beginAtZero: true,
      title: {
       display: true,
       text: "Ticket Count",
      },
     },
    },
   },
  };

  var ctx = document
   .getElementById("companyWiseTicketCountsChart")
   .getContext("2d");

  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(ctx, config);
 }

 $scope.companyWiseTicketCountsPageChange = function (pageNo) {
  $scope.cptPage = pageNo;
  displayCompanyWiseTicketCounts();
 };

 getcompanyWiseTicketCounts();

 getTotalTickets();

 fetchTopCompany();
 fetchprojectCount();







 function fetchlocationWiseCompanyCount() {
  console.log("fetchlocationWiseCompanyCount");
  var option = $scope.locationWiseCompanyFormData.locationOption || "country";
  AnalyticsService.getLocationWiseCompanyCount({
   option: option,
  }).then(
   function (response) {
    console.log(response);
    $scope.locationWiseCompaniesCount = response.data;
    displayLocationWiseCompanyCountChart(response.data);
   },
   function (error) {
    console.log(error);
   }
  );
 }

 function displayLocationWiseCompanyCountChart(chartData) {


  
  var pageSize = 2;
  var totalPages = Math.ceil(chartData.length / pageSize);
  $scope.totalPagesInLWC = totalPages;
  var startIndex = ($scope.currLWCPage - 1) * pageSize;
  chartData = chartData.slice(startIndex, Math.min(startIndex + pageSize, chartData.length));


  var lables = chartData.map(function (data) {
   return data._id;
  });

  var values = chartData.map(function (data) {
   return data.locationWiseCompanies;
  });

  var data = {
   labels: lables,
   datasets: [
    {
     label: "Companies",
     data: values,
     backgroundColor: [
      "#e3e2ff",
      "#d1da90",
      "#ffdcdc",
      "#e9a77e",
      "#6cc5d7",
      "#7e7cf6",
     ],
    },
   ],
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
   },
  };

  var chartDiv = document.querySelector("#locationWiseCompanyCountChart");

  const existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "bar",
   data: data,
  });
 }

 $scope.locationWiseCompanyDateChanged = function () {
  fetchlocationWiseCompanyCount();
 };

 fetchlocationWiseCompanyCount();

 function fetchCompanySize() {
  AnalyticsService.getCompanySize().then(function (response) {
   console.log("fetchCompanySize", response);
   $scope.companyWisePeople = response.data;
   $scope.totalPagesInCWP = Math.ceil($scope.companyWisePeople.length / 20);
   $scope.companyWisepeoplePageChange(1);
  });
 }

 function displayCompanySize(chartData) {
  console.log("displayCompanySize", chartData);
  let labels = chartData.map(function (data) {
   return data._id.substring(0, Math.min(10, data._id.length));
  });
  let values = chartData.map(function (data) {
   return data.totalUsers;
  });

  var data = {
   labels: labels,
   datasets: [
    {
     label: "People",
     data: values,
     backgroundColor: graphColors.sort(function () {
      return Math.random() - 0.5;
     }),
    },
   ],
  };

  var chartDiv = document.getElementById("companyWisePeopleChart");
  console.log("chartDiv", chartDiv);
  const existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "bar",
   data: data,
   options: {
    responsive: true,
    legend: {
     position: "bottom",
    },
    scales: {
     x: {
      title: {
       display: true,
       text: "Companies",
      },
     },
     y: {
      title: {
       display: true,
       text: "People Count",
      },
      ticks: {
       stepSize: 1,
      },
     },
    },
   },
  });
 }

 $scope.companyWisepeoplePageChange = function (pageNo) {
  console.log("Page changed: ", pageNo);
  var pageSize = 20;

  var data = $scope.companyWisePeople;

  var start = (pageNo - 1) * pageSize;
  var end = start + pageSize;
  data = data.slice(start, end);

  $scope.currtCWPpage = pageNo;

  console.log("data", data);

  displayCompanySize(data);
 };

 fetchCompanySize();
}

trackflow.controller("companyStatsController", [
 "$scope",
 "AnalyticsService",
 companyStatsController,
]);
