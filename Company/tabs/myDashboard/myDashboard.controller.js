function MyDashboardController($scope, AnalyticsService) {


 $scope.myTicketAnalytics = {};
 $scope.projectWiseMyTickets = [];
 $scope.pwtPage = 1;
 $scope.totalPagesInPWT = 0;

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

 function getMyTicketsAnalytics() {
  AnalyticsService.getMyTicketsAnalytics().then(function (response) {
   /// undefined as dont want to filter on projectId
   $scope.myTicketAnalytics = response.data[0];
   displayStatusWiseChart();
   displayPriorityWiseChart();
   console.log("My tickets analytics: ", $scope.myTicketAnalytics);
  });
 }
 getMyTicketsAnalytics();

 function displayStatusWiseChart() {
  var data = $scope.myTicketAnalytics.statusCounts;

  var labels = Object.keys(data);
  var values = Object.values(data);

  var chartData = {
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

  var chartDiv = document.getElementById("statusWiseChart");

  var existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "pie",
   data: chartData,
   options: {
    responsive: true,
    maintainAspectRatio: false,
   },
  });
 }

 function displayPriorityWiseChart() {
  var data = $scope.myTicketAnalytics.priorityCounts;

  var labels = Object.keys(data);
  var values = Object.values(data);

  var chartData = {
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

  var chartDiv = document.getElementById("priorityWiseChart");

  var existingChart = Chart.getChart(chartDiv);
  if (existingChart) {
   existingChart.destroy();
  }

  new Chart(chartDiv, {
   type: "pie",
   data: chartData,
   options: {
    responsive: true,
    maintainAspectRatio: false,
   },
  });
 }

 function getProjectWiseMyTickets(){
  AnalyticsService.getprojectWiseTickets({userId : $scope.profile._id}).then(function(response){
    $scope.projectWiseMyTickets = response.data;
    displayprojectWiseTicketsChart()
    console.log("Project wise my tickets: ", $scope.projectWiseMyTickets);
  });
 
 }

 getProjectWiseMyTickets()

 $scope.projectWiseTicketsPageChange = function (page) {
  $scope.pwtPage = page;
  displayprojectWiseTicketsChart();
 };

 function displayprojectWiseTicketsChart() {
  var data = $scope.projectWiseMyTickets;
  var chartDiv = document.getElementById("projectWiseTicketsChart");
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
    responsive: true,
    maintainAspectRatio: false,
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

}

trackflow.controller("MyDashboardController", [
 "$scope",
 "AnalyticsService",
 MyDashboardController,
]);
