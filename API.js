const apiKey = "dff5cb85045446f9861e81fdda13a5d2"; // API key
const station = "UT"; // Stationcode 
const platform = "11"; // Specifiek perron 
const nsApiUrl = `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${station}`; // URL voor de API-oproep

let digital; 

// Functie om vertrektijden op te halen van de NS API
async function fetchDepartures() {
    try {
        const response = await fetch(nsApiUrl, {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey, // Stelt de benodigde API-sleutel in als header
            },
        });

        if (!response.ok) {
            throw new Error(`API-oproep mislukt: ${response.statusText}`); 
        }

        const data = await response.json();
        displayDepartures(data.payload.departures); // Toon de vertrektijden op het bord
    } catch (error) {
        console.error("Fout bij het ophalen van vertrektijden:", error); // Logt eventuele fouten naar de console
    }
}

// Functie om de opgehaalde vertrektijden te tonen
function displayDepartures(departures) {
    const filteredDepartures = departures.filter(
        (departure) => departure.plannedTrack === platform // Filter alleen treinen die vanaf het juiste perron vertrekken
    );

    if (filteredDepartures.length > 0) {
        const firstDeparture = filteredDepartures[0]; // Eerste vertrekkende trein
        const nextDeparture = filteredDepartures[1]; // Volgende vertrekkende trein (indien beschikbaar)

        const now = new Date();
        const departureTime = new Date(firstDeparture.actualDateTime); // Werkelijke vertrektijd van de trein
        const departureTimeFormatted = departureTime.toTimeString().split(" ")[0]; // Formatteert de tijd

        const minutesUntilArrival = Math.max(
            Math.ceil((departureTime - now) / (1000 * 60)), // Bereken minuten tot vertrek
            0
        );

        const trainTypeMapping = {
            SPR: "Sprinter", // Vertaling voor Sprinter
            IC: "Intercity", // Vertaling voor Intercity
        };
        const trainTypeFull =
            trainTypeMapping[firstDeparture.trainCategory] || firstDeparture.trainCategory; // Haal het type trein op

        const routeStations = firstDeparture.routeStations || []; // Haal de tussenstations op
        const viaText =
            routeStations.length > 0
                ? `via ${routeStations.slice(0, -1).map(station => station.mediumName).join(", ")} en ${routeStations.slice(-1)[0].mediumName}`
                : ""; // maakt een weergaven van tussen stations
        if (digital === true) { // Controleer of de tijd digitaal moet worden weergegeven
            document.getElementById("TimeTillDeparture").textContent = departureTimeFormatted.split(" ")[0].slice(0, -3); // Toon tijd als "HH:MM"
            document.getElementById("Minuten").textContent = ''; // Geen minuten tekst nodig
        } else {
            document.getElementById("TimeTillDeparture").textContent = minutesUntilArrival; // Toon minuten tot vertrek
            document.getElementById("Minuten").textContent = minutesUntilArrival <= 1 ? "minuut" : "minuten"; // Meervoud/minuut aanpassen
        }
        document.getElementById("TreinStyle").textContent = trainTypeFull; // Toon het type trein
        document.getElementById("WaarNaartoeHoofd").textContent = firstDeparture.direction; // Toon de eindbestemming van de trein
        document.getElementById("OverigStations").textContent = viaText; // Toon de tussenstations
        document.getElementById("Platform").textContent = platform; // Toon het perronnummer

        if (nextDeparture) { // Controleer of er een volgende trein beschikbaar is
            const nextDepartureTime = new Date(nextDeparture.actualDateTime);
            const nextDepartureTimeFormatted = nextDepartureTime.toTimeString().split(" ")[0].slice(0, -3); // Formatteer tijd als "HH:MM"

            document.getElementById("NextTrain").textContent =
                `Hierna/next: ${nextDepartureTimeFormatted} ${nextDeparture.direction}`; // Toon de volgende trein
        } else {
            document.getElementById("NextTrain").textContent = "Geen aankomende treinen"; // Geen volgende trein beschikbaar
        }
    } else {
        // Als er geen treinen beschikbaar zijn dan laat hij dat zien
        document.getElementById("TimeTillDeparture").textContent = "--";
        document.getElementById("Minuten").textContent = "minuten";
        document.getElementById("TreinStyle").textContent = "Geen gegevens";
        document.getElementById("WaarNaartoeHoofd").textContent = "Geen gegevens";
        document.getElementById("OverigStations").textContent = "";
    }
}

// Functie om te wisselen tussen digitale tijdweergave en minuten
function TimeSwap() {
    digital = !digital;
    fetchDepartures(); // Haal de vertrektijden opnieuw op om de wijziging te tonen
}

// Functie om het bord te initialiseren
function initBoard() {
    fetchDepartures(); 
    TimeSwap(); 
    setInterval(fetchDepartures, 30000); // haalt elke 30 seconde de departures op
    setInterval(TimeSwap, 5000);
}

// Wacht tot de pagina volledig geladen is, en start dan het bord
document.addEventListener("DOMContentLoaded", initBoard);
