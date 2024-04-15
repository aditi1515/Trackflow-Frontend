function overviewSuperAdminController($scope, AnalyticsService) {
  $scope.formDataInit = {
    startDate: new Date("1999-01-01"),
    endDate: new Date("2050-01-01"),
  };
  $scope.currtCWPpage = 1;
  $scope.totalPagesInCWP = 0;
  $scope.companyCountFormData = {};
  $scope.recentlyEnrolledCompaniesData = {};
  $scope.mostLoyalPartnersData = {};
  $scope.projectCountFormData = {};
  $scope.totalTickets = 0;
  $scope.ticketCountFormData = {};
  $scope.systemUsageTimeData = {};

  $scope.loyalPartnerLimitSelectOption = "5";

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

  function fetchcountCompanies() {
    var startDate = $scope.formDataInit.startDate;
    var endDate = $scope.formDataInit.endDate;

    AnalyticsService.getCountCompanies({
      startDate: startDate,
      endDate: endDate,
    }).then(
      function (response) {
        console.log(response);
        $scope.companiesCount = response.data;
        displayCompanyCountChart(response.data);
      },
      function (error) {
        console.log(error);
      }
    );
  }

  function displayCompanyCountChart(chartData) {
    var chartDiv = document.querySelector("#companyCountChart");

    console.log("chartDiv", chartDiv);
    var data = {
      labels: ["Total", "Enabled", "Disabled"],
      datasets: [
        {
          label: "Companies",
          data: [
            chartData.totalCompanies,
            chartData.enabledCompanies,
            chartData.disabledCompanies,
          ],
          backgroundColor: ["#e3e2ff", "#d1da90", "#ffdcdc"],
        },
      ],
      options: {
        responsive: true,
        legend: {
          position: "bottom",
        },
      },
    };

    const existingChart = Chart.getChart(chartDiv);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(chartDiv, {
      type: "pie",
      data: data,
    });
  }

  fetchcountCompanies();

  fetchprojectCount();

  function fetchprojectCount() {
    var body = {
      startDate: $scope.formDataInit.startDate,
      endDate: $scope.formDataInit.endDate,
    };

    AnalyticsService.getProjectCount(body).then(function (response) {
      console.log("fetchprojectCount", response);
      $scope.projectCount = response.data;
    });
  }

  function recentlyEnrolledCompanies() {
    AnalyticsService.getOldestOrRecentlyEnrolledCompanies("recent").then(
      function (response) {
        $scope.recentlyEnrolledCompaniesData = response.data;
      }
    );
  }
  recentlyEnrolledCompanies();

  function mostLoyalPartners() {
    AnalyticsService.getOldestOrRecentlyEnrolledCompanies("oldest").then(
      function (response) {
        $scope.mostLoyalPartnersData = response.data;
        displayLoyalPartnerChart();
      }
    );
  }
  mostLoyalPartners();

  function getTotalTickets() {
    var body = {
      startDate:
        $scope.ticketCountFormData.startDate || $scope.formDataInit.startDate,
      endDate:
        $scope.ticketCountFormData.endDate || $scope.formDataInit.endDate,
    };

    AnalyticsService.getTotalTickets(body).then(function (response) {
      console.log("getTotalTickets", response);
      $scope.totalTickets = formatNumber(response.data?.totalTickets);
    });
  }

  getTotalTickets();

  // function convertTo12Hours(hours) {
  //   // Example hour in 24-hour format
  //   var converted = [];
  //   for (var hour24 of hours) {
  //     // Convert to 12-hour format
  //     var hour12 = hour24 % 12 || 12; // Takes care of converting "0" to "12"
  //     var amPm = hour24 < 12 ? "AM" : "PM";
  //     var finalHour = `${hour12} ${amPm}`;
  //     converted.push(finalHour);
  //   }

  //   return converted;
  // }

  function convertTo12Hours(hours) {
    // Example hour in 24-hour format
    var converted = [];
    for (var i = 0; i < hours.length; i++) {
      var startHour24 = hours[i] % 24; // Ensure hour is within 24-hour range
      var startHour12 = startHour24 % 12 || 12; // Convert to 12-hour format
      var startAmPm = startHour24 < 12 ? "AM" : "PM";

      var endHour24 = (startHour24 + 1) % 24; // Calculate end hour of slot
      var endHour12 = endHour24 % 12 || 12; // Convert to 12-hour format
      var endAmPm = endHour24 < 12 ? "AM" : "PM";

      var slotLabel = `${startHour12} ${startAmPm}-${endHour12} ${endAmPm}`;
      converted.push(slotLabel);
    }

    return converted;
  }

  function systemUsageTime() {
    AnalyticsService.getSystemUsageTime().then(function (response) {
      $scope.systemUsageTimeData = response.data;
      console.log("getSystemUsageTime", response.data);
      displaySystemUsageTime();
    });
  }
  systemUsageTime();

  function displaySystemUsageTime() {
    var chartData = $scope.systemUsageTimeData;
    var labels = chartData.map(function (data) {
      return data._id;
    });

    labels = convertTo12Hours(labels);

    var values = chartData.map(function (data) {
      return data.ticketCount;
    });

    var data = {
      labels: labels,
      datasets: [
        {
          label: "Ticket Count",
          data: values,
          backgroundColor: graphColors.sort(function () {
            return Math.random() - 0.5;
          }),
        },
      ],
    };

    var chartDiv = document.getElementById("systemUsageTimeChart");

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
        maintainAspectRatio: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Time",
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
}

trackflow.controller("overviewSuperAdminController", [
  "$scope",
  "AnalyticsService",
  overviewSuperAdminController,
]);
