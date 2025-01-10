const apiUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=UT';

// Set your desired platform (e.g., "12")
const specificPlatform = '20';

// Function to fetch train data and update the board
function fetchTrainData() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '6efe8b15f76e49c8b019e7639be187e1' // Replace with your actual API key
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Filter trains for the specific platform
            const filteredTrains = data.payload.arrivals.filter(train => train.plannedTrack === specificPlatform);

            if (filteredTrains.length > 0) {
                const nextTrain = filteredTrains[0]; // Get only the first train

                // Destination
                document.getElementById('WaarNaartoeHoofd').innerText = nextTrain.origin;

                // Platform
                document.getElementById('Platform').textContent = specificPlatform;

                // Calculate time until departure in minutes
                const departureTime = new Date(nextTrain.plannedDateTime);
                const currentTime = new Date();
                const timeDiff = Math.ceil((departureTime - currentTime) / 60000); // Difference in minutes

                document.getElementById('TimeTillDeparture').innerText = timeDiff > 0 ? timeDiff : '0';
            } else {
                // If no trains are available for the specified platform
                document.getElementById('WaarNaartoeHoofd').innerText = 'Geen trein beschikbaar';
                document.getElementById('Platform').innerText = specificPlatform;
                document.getElementById('TimeTillDeparture').innerText = '--';
                document.getElementById('TreinStyle').textContent = nextTrain.trainCategory
            }
        })
        .catch(error => {
            console.error('Error fetching train data:', error);
        });
}

// Fetch train data every 30 seconds
setInterval(fetchTrainData, 30000);

// Initial fetch
fetchTrainData();
