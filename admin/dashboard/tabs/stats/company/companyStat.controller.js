function CompanyStatController($scope, AnalyticsService) {
  $scope.formDataInit = {
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
    startYear: new Date().getFullYear() - 1,
    endYear: new Date().getFullYear(),
    startMonth: new Date().getMonth(),
    endMonth: new Date().getMonth() + 1,
  };

  $scope.currentMonth = new Date().getMonth() + 1;
  $scope.currentDate = new Date();
  $scope.currentYear = new Date().getFullYear();

  $scope.timeWarning = false;

  $scope.companyTrendPage = 1;
  $scope.totalPagesInCompanyTrend = 0;

  $scope.projectTrendPage = 1;
  $scope.totalPagesInProjectTrend = 0;

  $scope.ticketTrendPage = 1;
  $scope.totalPagesInTicketTrend = 0;

  $scope.trendCountFormData = {
    startDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
    startYear: new Date().getFullYear() - 1,
    endYear: new Date().getFullYear(),
    startMonth: new Date().getMonth(),
    endMonth: new Date().getMonth() + 1,
  };

  $scope.companyCountFormData = {};
  $scope.trendCountOption = "day";

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

  //company count Trend
  function companyCountTrend() {
    var data = {
      option: $scope.trendCountOption,
      startDate:
        $scope.trendCountFormData.startDate || $scope.formDataInit.startDate,
      endDate: $scope.trendCountFormData.endDate || $scope.formDataInit.endDate,
    };

    AnalyticsService.getcompanyCountTrend(data).then(function (response) {
      $scope.companyTrendData = response.data;
      $scope.totalPagesInCompanyTrend = Math.ceil(
        $scope.companyTrendData.length / 20
      );
      displayCompanyTrendDataChart();
    });
  }

  $scope.companyTrendPageChange = function (pageNo) {
    $scope.companyTrendPage = pageNo;
    displayCompanyTrendDataChart();
  };

  function displayCompanyTrendDataChart() {
    var pageSize = 20;
    var chartData = $scope.companyTrendData;
    $scope.totalPagesInCompanyTrend = Math.ceil(chartData.length / pageSize);
    var startIndex = ($scope.companyTrendPage - 1) * pageSize;
    chartData = chartData.slice(
      startIndex,
      Math.min(startIndex + pageSize, chartData.length)
    );

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var chartData = $scope.companyTrendData;
    if ($scope.trendCountOption == "day") {
      var labels = chartData.map(function (data) {
        return (
          data._id.day + " " + months[data._id.month - 1] + " " + data._id.year
        );
      });
    } else if ($scope.trendCountOption == "month") {
      var labels = chartData.map(function (data) {
        return months[data._id.month - 1] + " " + data._id.year;
      });
    } else {
      var labels = chartData.map(function (data) {
        return data._id.year;
      });
    }
    var values = chartData.map(function (data) {
      return data.companyCount;
    });


    var keysAdjusted = labels.map(function (key){
      return key.split(" ");
    })

    var data = {
      labels: keysAdjusted,
      datasets: [
        {
          label: "Companies",
          data: values,
          backgroundColor: graphColors.sort(function () {
            return Math.random() - 0.5;
          }),
        },
      ],
    };

    var chartDiv = document.getElementById("companyCountTrend-chart");

    var existingChart = Chart.getChart(chartDiv);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(chartDiv, {
      type: "line",
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
              text: $scope.companyTrendCountOption,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Company Count",
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  $scope.companyCountTrendOptionChange = function () {
    companyCountTrend();
  };
  //project count trend
  function projectCountTrend() {
    var data = {
      option: $scope.trendCountOption,
      startDate:
        $scope.trendCountFormData.startDate || $scope.formDataInit.startDate,
      endDate: $scope.trendCountFormData.endDate || $scope.formDataInit.endDate,
    };
    AnalyticsService.getProjectCountTrend(data).then(function (response) {
      $scope.projectTrendData = response.data;
      $scope.totalPagesInProjectTrend = Math.ceil(
        $scope.projectTrendData.length / 20
      );
      displayProjectTrendDataChart();
    });
  }

  $scope.projectTrendPageChange = function (pageNo) {
    $scope.projectTrendPage = pageNo;
    displayProjectTrendDataChart();
  };

  function displayProjectTrendDataChart() {
    var pageSize = 20;
    var chartData = $scope.projectTrendData;
    $scope.totalPagesInProjectTrend = Math.ceil(chartData.length / pageSize);
    var startIndex = ($scope.projectTrendPage - 1) * pageSize;
    chartData = chartData.slice(
      startIndex,
      Math.min(startIndex + pageSize, chartData.length)
    );

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if ($scope.trendCountOption == "day") {
      var labels = chartData.map(function (data) {
        return (
          data._id.day + " " + months[data._id.month - 1] + " " + data._id.year
        );
      });
    } else if ($scope.trendCountOption == "month") {
      var labels = chartData.map(function (data) {
        return months[data._id.month - 1] + " " + data._id.year;
      });
    } else {
      var labels = chartData.map(function (data) {
        return data._id.year;
      });
    }
    var values = chartData.map(function (data) {
      return data.projectCount;
    });

    var keysAdjusted = labels.map(function (key){
      return key.split(" ");
    })

    var data = {
      labels: keysAdjusted,
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

    var chartDiv = document.getElementById("projectCountTrend-chart");

    var existingChart = Chart.getChart(chartDiv);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(chartDiv, {
      type: "line",
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
              text: $scope.projectTrendCountOption,
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

  $scope.projectCountTrendOptionChange = function () {
    projectCountTrend();
  };

  function ticketCountTrend() {
    var data = {
      option: $scope.trendCountOption,
      startDate:
        $scope.trendCountFormData.startDate || $scope.formDataInit.startDate,
      endDate: $scope.trendCountFormData.endDate || $scope.formDataInit.endDate,
    };
    AnalyticsService.getticketCountTrend(data).then(function (response) {
      $scope.ticketTrendData = response.data;
      $scope.totalPagesInTicketTrend = Math.ceil(
        $scope.ticketTrendData.length / 20
      );
      displayTicketTrendDataChart();
    });
  }

  $scope.ticketTrendPageChange = function (pageNo) {
    $scope.ticketTrendPage = pageNo;
    displayTicketTrendDataChart();
  };

  function displayTicketTrendDataChart() {
    var chartData = $scope.ticketTrendData;

    var pageSize = 20;
    $scope.totalPagesInTicketTrend = Math.ceil(chartData.length / pageSize);
    var startIndex = ($scope.ticketTrendPage - 1) * pageSize;
    chartData = chartData.slice(
      startIndex,
      Math.min(startIndex + pageSize, chartData.length)
    );

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if ($scope.trendCountOption == "day") {
      var labels = chartData.map(function (data) {
        return (
          data._id.day + " " + months[data._id.month - 1] + " " + data._id.year
        );
      });
    } else if ($scope.trendCountOption == "month") {
      var labels = chartData.map(function (data) {
        return months[data._id.month - 1] + " " + data._id.year;
      });
    } else {
      var labels = chartData.map(function (data) {
        return data._id.year;
      });
    }
    var values = chartData.map(function (data) {
      return data.ticketCount;
    });

    var keysAdjusted = labels.map(function (key){
      return key.split(" ");
    })

    var data = {
      labels: keysAdjusted,
      datasets: [
        {
          label: "Tickets",
          data: values,
          backgroundColor: graphColors.sort(function () {
            return Math.random() - 0.5;
          }),
        },
      ],
    };

    var chartDiv = document.getElementById("ticketCountTrend-chart");

    var existingChart = Chart.getChart(chartDiv);
    if (existingChart) {
      existingChart.destroy();
    }


    new Chart(chartDiv, {
      type: "line",
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
              text: $scope.ticketTrendCountOption,
            },
           
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Ticket Count",
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  $scope.ticketCountTrendOptionChange = function () {
    ticketCountTrend();
  };

  $scope.countTrendOptionChange = function () {
  

    if ($scope.trendCountOption == "year") {
      $scope.trendCountFormData.startDate = new Date(
        $scope.trendCountFormData.startYear,
        0,
        1
      );
      $scope.trendCountFormData.endDate = new Date(
        $scope.trendCountFormData.endYear,
        11,
        31
      );
    } else if ($scope.trendCountOption == "month") {
      $scope.trendCountFormData.startDate = new Date(
        $scope.trendCountFormData.startYear,
        $scope.trendCountFormData.startMonth,
        1
      );
      $scope.trendCountFormData.endDate = new Date(
        $scope.trendCountFormData.endYear,
        $scope.trendCountFormData.endMonth,
        0
      );
    }

    console.log("trendCountFormData", $scope.trendCountFormData);

   
    companyCountTrend();
    projectCountTrend();
    ticketCountTrend();
  };

  $scope.resetDate = function () {
    $scope.trendCountFormData = {
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      startYear: new Date().getFullYear() - 1,
      endYear: new Date().getFullYear(),
      startMonth: new Date().getMonth(),
      endMonth: new Date().getMonth() + 1,
    };
  };

  $scope.countTrendOptionChange();
}

trackflow.controller("CompanyStatController", [
  "$scope",
  "AnalyticsService",
  CompanyStatController,
]);
