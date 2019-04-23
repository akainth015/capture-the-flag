new Chart(document.querySelector("#balance-history canvas"), {
    data: {
        datasets: [{
            backgroundColor: "#79c2ff",
            borderColor: "#33a6ff",
            data: [1000, 200, 1100, 800, 1000],
            label: "Balance History"
        }],
        labels: ["January", "February", "March", "April", "May"]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    },
    type: "line"
});

new Chart(document.querySelector("#credit-card canvas"), {
    data: {
        datasets: [{
            backgroundColor: ["#2162c2", "#33a6ff"],
            data: [300, 4700]
        }],
        labels: ["Used", "Remaining"],
    },
    type: "pie"
});

const fakeServerError = new Error();
fakeServerError.message = "Failed to open 'package.json' for reading";
fakeServerError.name = "EACCES";
fakeServerError.description = "This service does not have permission to read 'package.json'";
console.error(fakeServerError);