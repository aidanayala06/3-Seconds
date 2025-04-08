const Time = 3.0;

let startTime = null;
let attempts = [];
let attemptCount = 0;

let button = document.getElementById("startStopBtn");
let resultText = document.getElementById("resultText");
let attemptsList = document.getElementById("attempts");
let summary = document.getElementById("summary");
let chartCanvas = document.getElementById("attemptChart");

let chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Elapsed Time (s)",
            data: [],
            borderColor: "blue",
            backgroundColor: "lightblue",
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 5
            }
        }
    }
});

button.addEventListener("click", function () {
    if (startTime === null) {
        startTime = new Date();
        resultText.textContent = "";
        button.textContent = "Stop";
        button.classList.remove("btn-primary");
        button.classList.add("btn-danger");
    } else {
        let stopTime = new Date();
        let elapsed = (stopTime - startTime) / 1000;
        attemptCount += 1;

        let difference = Math.abs(elapsed - Time);
        let colorClass = "red";
        if (difference === 0) {
            colorClass = "green";
        } else if (difference <= 0.2) {
            colorClass = "blue";
        } else if (difference <= 0.5) {
            colorClass = "yellow";
        }

        resultText.textContent = "Elapsed time: " + elapsed.toFixed(3) + "s";
        resultText.className = colorClass;

        let attempt = {
            number: attemptCount,
            start: startTime.toLocaleTimeString(),
            stop: stopTime.toLocaleTimeString(),
            elapsed: elapsed
        };
        attempts.push(attempt);

        addAttemptToList(attempt);
        updateSummary();
        updateChart();

        startTime = null;
        button.textContent = "Start";
        button.classList.remove("btn-danger");
        button.classList.add("btn-primary");
    }
});

function addAttemptToList(attempt) {
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = "Attempt " + attempt.number +
        ": Start - " + attempt.start +
        ", Stop - " + attempt.stop +
        ", Elapsed: " + attempt.elapsed.toFixed(3) + "s";
    attemptsList.appendChild(li);
}

function updateSummary() {
    let total = attempts.length;
    let times = attempts.map(function (a) { return a.elapsed; });
    let min = Math.min.apply(null, times);
    let max = Math.max.apply(null, times);
    let sum = times.reduce(function (a, b) { return a + b; }, 0);
    let avg = sum / total;

    summary.innerHTML = "Total Attempts: " + total +
        "<br>Min: " + min.toFixed(3) + "s" +
        "<br>Max: " + max.toFixed(3) + "s" +
        "<br>Average: " + avg.toFixed(3) + "s";
}

function updateChart() {
    chart.data.labels = attempts.map(function (a) {
        return "#" + a.number;
    });
    chart.data.datasets[0].data = attempts.map(function (a) {
        return a.elapsed;
    });
    chart.update();
}
