// Get all DOM elements needed for the application
const fetchDataButton = document.getElementById('fetchData');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const modeSelect = document.getElementById('mode');
const sensorSelect = document.getElementById('sensorSelect');
const dateControls = document.getElementById('dateControls');
const ctx = document.getElementById('sensorChart').getContext('2d');

// Initialize Chart.js instance
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

// Function to convert ISO date to SQL format
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

// Function to load sensors into the select dropdown
async function loadSensors() {
    try {
        const response = await fetch('/sensors');
        const { data: sensors } = await response.json();
        
        // Reset select content
        sensorSelect.innerHTML = '<option value="all">Tous les capteurs</option>';
        
        // Add each sensor as an option
        sensors.forEach(sensor => {
            const option = document.createElement('option');
            option.value = sensor.id;
            option.textContent = `${sensor.name} (${sensor.location})`;
            sensorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des capteurs:', error);
        alert('Impossible de charger la liste des capteurs');
    }
}

// Handle mode changes (Range/All Data)
modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'all') {
        dateControls.classList.add('hidden');
    } else {
        dateControls.classList.remove('hidden');
    }

    // Reset chart data with animation
    sensorChart.data.labels = [];
    sensorChart.data.datasets[0].data = [];
    sensorChart.options.plugins.title = {
        display: true,
        text: 'Données du Capteur de Lumière (0 mesures)'
    };
    
    sensorChart.update({
        duration: 750,
        easing: 'easeInOutQuart'
    });
});

// Main data fetching function
fetchDataButton.addEventListener('click', async () => {
    console.log('Bouton de récupération cliqué');
    
    const mode = modeSelect.value;
    const selectedSensor = sensorSelect.value;
    const rawStartDate = startDateInput.value;
    const rawEndDate = endDateInput.value;
    
    try {
        let response;
        let startDate, endDate;

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
                endDate,
                sensor_id: selectedSensor !== 'all' ? selectedSensor : undefined
            };
            
            console.log('Corps de la requête :', JSON.stringify(requestBody, null, 2));
        
            response = await fetch('/measurements/range', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
        } else {
            if (selectedSensor !== 'all') {
                response = await fetch('/measurements/sensor/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sensor_id: selectedSensor })
                });
            } else {
                response = await fetch('/measurements');
            }
        }

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

        if (!data || !Array.isArray(data) || data.length === 0) {
            const periodMessage = mode === 'range' ? ` pour la période ${startDate} à ${endDate}` : '';
            const sensorMessage = selectedSensor !== 'all' ? ` et le capteur ${selectedSensor}` : '';
            throw new Error(`Aucune donnée retournée${periodMessage}${sensorMessage}`);
        }

        console.log(`${data.length} points de données reçus`);

        const measurementCount = data.length;
        sensorChart.options.plugins.title = {
            display: true,
            text: `Données du Capteur de Lumière (${measurementCount} mesures)`
        };

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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadSensors();
    modeSelect.dispatchEvent(new Event('change'));
});