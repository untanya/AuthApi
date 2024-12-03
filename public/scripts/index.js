const fetchDataButton = document.getElementById('fetchData');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const modeSelect = document.getElementById('mode');
const dateControls = document.getElementById('dateControls');
const ctx = document.getElementById('sensorChart').getContext('2d');

let sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Light Intensity (Lux)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Timestamp',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Lux',
                },
                beginAtZero: true,
            },
        },
    },
});

fetchDataButton.addEventListener('click', async () => {
    const mode = modeSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    try {
        let response;
        if (mode === 'range') {
            if (!startDate || !endDate) {
                alert('Please select both start and end dates.');
                return;
            }

            response = await fetch('/sensor/range', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });
        } else {
            response = await fetch('/sensor', {
                method: 'GET',
            });
        }

        const { data } = await response.json();

        // Update the chart
        sensorChart.data.labels = data.map(item => new Date(item.timestamp).toLocaleString());
        sensorChart.data.datasets[0].data = data.map(item => item.value_lux);
        sensorChart.update();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
