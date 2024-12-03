// Get DOM elements for interacting with the page
// These constants are used throughout the code to manipulate the UI elements
const fetchDataButton = document.getElementById('fetchData');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const modeSelect = document.getElementById('mode');
const dateControls = document.getElementById('dateControls');
const ctx = document.getElementById('sensorChart').getContext('2d');

// Initialize Chart.js with custom configuration
// This setup defines the chart's appearance and behavior
let sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Intensité Lumineuse par Capteur',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // Animation configuration for smooth transitions
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        transitions: {
            active: {
                animation: {
                    duration: 750
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            // Custom tooltip to display sensor information
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Capteur ${context.raw.sensor_id}: ${context.raw.value_lux} Lux`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Horodatage',
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

// Converts ISO date format to SQL compatible format
// This is necessary because our backend expects dates in a specific SQL format
function isoToSqlDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0') + ' ' + 
           String(date.getHours()).padStart(2, '0') + ':' + 
           String(date.getMinutes()).padStart(2, '0') + ':' + 
           '00.000';
}

// Handle mode changes (Range/All Data)
// This event listener manages the UI updates when switching modes
modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'all') {
        dateControls.classList.add('hidden');
    } else {
        dateControls.classList.remove('hidden');
    }

    // Reset chart data with animation when changing modes
    sensorChart.data.labels = [];
    sensorChart.data.datasets[0].data = [];
    sensorChart.options.plugins.title = {
        display: true,
        text: 'Données du Capteur de Luminosité (0 mesures)'
    };
    
    sensorChart.update({
        duration: 750,
        easing: 'easeInOutQuart'
    });
});

// Main data fetching function triggered by the Fetch button
// This handles both Range and All Data modes
fetchDataButton.addEventListener('click', async () => {
    console.log('Bouton de récupération cliqué');
    
    const mode = modeSelect.value;
    const rawStartDate = startDateInput.value;
    const rawEndDate = endDateInput.value;
    
    try {
        let response;
        let startDate, endDate;

        // Handle different API endpoints based on selected mode
        if (mode === 'range') {
            startDate = isoToSqlDate(rawStartDate);
            endDate = isoToSqlDate(rawEndDate);
            
            console.log('Dates de la requête :', { rawStartDate, rawEndDate, startDate, endDate });

            if (!startDate || !endDate) {
                alert(`Erreur de date : Date de début = "${rawStartDate}", Date de fin = "${rawEndDate}". Les deux dates doivent être spécifiées.`);
                return;
            }

            const requestBody = {
                startDate,
                endDate
            };
            console.log('Corps de la requête :', JSON.stringify(requestBody, null, 2));

            response = await fetch('/sensor/range', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
        } else {
            response = await fetch('/sensor', {
                method: 'GET',
            });
        }

        // Process and validate API response
        const responseText = await response.text();
        console.log('Réponse brute :', responseText);
        
        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('Données de réponse analysées :', responseData);
        } catch (e) {
            throw new Error(`Échec de l'analyse de la réponse : ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(`Erreur serveur ${response.status} : ${responseText}`);
        }

        const { data, success } = responseData;
        
        if (!success) {
            throw new Error(`L'API a retourné success: false - ${responseData.error || 'Erreur inconnue'}`);
        }

        // Validate received data
        if (!data || !Array.isArray(data) || data.length === 0) {
            const periodMessage = mode === 'range' ? ` pour la période ${startDate} à ${endDate}` : '';
            throw new Error(`Aucune donnée retournée${periodMessage}`);
        }

        console.log(`${data.length} points de données reçus`);

        // Update chart title with measurement count
        const measurementCount = data.length;
        sensorChart.options.plugins.title = {
            display: true,
            text: `Données du Capteur de Luminosité (${measurementCount} mesures)`
        };

        // Process and format data for the chart
        sensorChart.data.labels = data.map(item => {
            const date = new Date(item.timestamp);
            return date.toLocaleString();
        });
        
        sensorChart.data.datasets[0].data = data.map(item => ({
            x: new Date(item.timestamp),
            y: item.value_lux,
            sensor_id: item.sensor_id,
            value_lux: item.value_lux
        }));
        
        console.log('Données du graphique préparées :', {
            labels: sensorChart.data.labels,
            data: sensorChart.data.datasets[0].data
        });

        // Update chart with animation
        sensorChart.update({
            duration: 750,
            easing: 'easeInOutQuart'
        });
        console.log('Graphique mis à jour');

    } catch (error) {
        console.error('Détails complets de l\'erreur :', error);
        alert(`Échec de la récupération des données : ${error.message}\n\nConsultez la console pour plus de détails.`);
    }
});

// Initialize date controls visibility based on initial mode
// This ensures the UI is in the correct state when the page loads
modeSelect.dispatchEvent(new Event('change'));