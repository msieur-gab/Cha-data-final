/**
 * Tea Geographical Data Interface
 * UI interaction handlers for geographical data component
 */

// DOM Elements for Geo Interface
let locationInput;
let searchButton;
let latitudeInput;
let longitudeInput;
let altitudeInput;
let estimatedLabel;
let autoEstimateCheckbox;
let fetchButton;
let errorDiv;
let resultsContainer;
let avgSolarRadiationDiv;
let avgSolarExposureDiv;
let avgHumidityDiv;
let avgTemperatureDiv;
let estimatedAltitudeDiv;
let locationInfoDiv;
let locationResultsDiv;
let chartCanvas;

// Store current location info
let currentLocationInfo = null;

// Initialize the geo interface
function initGeoInterface() {
    // Get DOM elements
    locationInput = document.getElementById('locationInput');
    searchButton = document.getElementById('searchButton');
    latitudeInput = document.getElementById('latitudeInput');
    longitudeInput = document.getElementById('longitudeInput');
    altitudeInput = document.getElementById('altitudeInput');
    estimatedLabel = document.getElementById('estimatedLabel');
    autoEstimateCheckbox = document.getElementById('autoEstimateCheckbox');
    fetchButton = document.getElementById('fetchButton');
    errorDiv = document.getElementById('error');
    resultsContainer = document.getElementById('resultsContainer');
    avgSolarRadiationDiv = document.getElementById('avgSolarRadiation');
    avgSolarExposureDiv = document.getElementById('avgSolarExposure');
    avgHumidityDiv = document.getElementById('avgHumidity');
    avgTemperatureDiv = document.getElementById('avgTemperature');
    estimatedAltitudeDiv = document.getElementById('estimatedAltitude');
    locationInfoDiv = document.getElementById('locationInfo');
    locationResultsDiv = document.getElementById('locationResults');
    chartCanvas = document.getElementById('chart');

    // Set up event listeners
    if (autoEstimateCheckbox) {
        autoEstimateCheckbox.addEventListener('change', handleAutoEstimateChange);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (locationInput) {
        locationInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                performSearch();
            }
        });
    }
    
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchWeatherData);
    }
}

// Handle auto-estimate checkbox changes
function handleAutoEstimateChange() {
    if (this.checked) {
        altitudeInput.disabled = true;
        estimatedLabel.style.display = 'block';
    } else {
        altitudeInput.disabled = false;
        estimatedLabel.style.display = 'none';
    }
}

// Function to select a location from the results
function selectLocation(location) {
    console.log(`[UI] Location selected: ${location.name}, ${location.country}`);
    currentLocationInfo = location;
    
    // Update coordinate inputs
    latitudeInput.value = location.latitude;
    longitudeInput.value = location.longitude;
    
    if (location.elevation) {
        altitudeInput.value = location.elevation;
        console.log(`[UI] Using elevation from location data: ${location.elevation}`);
    } else {
        altitudeInput.value = '';
        console.log(`[UI] No elevation data available from location`);
    }
    
    // Display the selected location immediately
    locationInfoDiv.textContent = formatLocationDisplay(location);
    
    // Show the results container if it's hidden
    if (resultsContainer) {
        resultsContainer.style.display = 'grid';
    }
    
    // Hide location results
    locationResultsDiv.style.display = 'none';
    
    // Enable fetch button
    fetchButton.disabled = false;
    
    // Update tea form with location details if possible
    updateTeaFormWithLocation(location);
}

// Function to format location display
function formatLocationDisplay(location) {
    let displayText = location.name;
    
    // Add district (admin2) if available
    if (location.admin2 && location.admin2 !== location.name) {
        displayText += `, ${location.admin2}`;
    }
    
    // Add province/state (admin1) if available
    if (location.admin1 && location.admin1 !== location.admin2) {
        displayText += `, ${location.admin1}`;
    }
    
    // Add country
    displayText += `, ${location.country}`;
    
    console.log(`[UI] Formatted location display: "${displayText}"`);
    return displayText;
}

// Update tea form with location details
function updateTeaFormWithLocation(location) {
    // This function can be expanded to update any tea form fields
    // that should use geographic data
    
    // For now, let's check if there's a "originLocation" input field to update
    const originLocationInput = document.getElementById('originLocation');
    if (originLocationInput) {
        originLocationInput.value = formatLocationDisplay(location);
    }
}

// Function to perform location search
async function performSearch() {
    if (!locationInput.value.trim()) {
        errorDiv.textContent = 'Please enter a location name';
        return;
    }
    
    console.log(`[UI] Performing search for: "${locationInput.value}"`);
    // Reset previous state
    errorDiv.textContent = '';
    searchButton.disabled = true;
    searchButton.textContent = 'Searching...';
    fetchButton.disabled = true;
    locationResultsDiv.style.display = 'none';

    try {
        const locationResults = await weatherAPI.searchLocation(locationInput.value);
        console.log(`[UI] Search returned ${locationResults.length} locations`);
        
        // Clear previous results
        locationResultsDiv.innerHTML = '';
        
        if (locationResults.length === 1) {
            console.log(`[UI] Single result found, auto-selecting`);
            // If only one result, select it automatically
            selectLocation(locationResults[0]);
        } else {
            console.log(`[UI] Multiple results found, displaying options`);
            // Display multiple results for user to choose
            locationResults.forEach((location, index) => {
                const locationItem = document.createElement('div');
                locationItem.className = 'location-item';
                
                locationItem.textContent = formatLocationDisplay(location);
                
                locationItem.addEventListener('click', () => {
                    console.log(`[UI] User selected location option #${index + 1}`);
                    selectLocation(location);
                });
                
                locationResultsDiv.appendChild(locationItem);
            });
            
            // Show location results
            locationResultsDiv.style.display = 'block';
        }
        
    } catch (error) {
        console.error(`[UI] Search error: ${error.message}`);
        errorDiv.textContent = error.message;
        currentLocationInfo = null;
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Search Location';
    }
}

// Function to fetch weather data
async function fetchWeatherData() {
    console.log(`[UI] Fetch weather button clicked`);
    // Reset previous state
    errorDiv.textContent = '';
    fetchButton.disabled = true;
    fetchButton.textContent = 'Fetching Data...';

    try {
        console.log(`[UI] Requesting weather data for coordinates: ${latitudeInput.value}, ${longitudeInput.value}`);
        const weatherData = await weatherAPI.fetchWeatherData(
            latitudeInput.value, 
            longitudeInput.value,
            altitudeInput.value,
            autoEstimateCheckbox.checked,
            currentLocationInfo
        );

        console.log(`[UI] Weather data received, updating display`);
        // Update weather results
        avgSolarRadiationDiv.textContent = `${weatherData.avgSolarRadiation} W/m²`;
        avgSolarExposureDiv.textContent = `${weatherData.avgSolarExposure} kWh/m²/day`;
        avgHumidityDiv.textContent = `${weatherData.avgHumidity}%`;
        avgTemperatureDiv.textContent = `${weatherData.avgTemperature}°C`;
        estimatedAltitudeDiv.textContent = `${weatherData.altitude} m`;
        
        // Update altitude input 
        if (autoEstimateCheckbox.checked) {
            altitudeInput.value = weatherData.altitude;
            console.log(`[UI] Updated altitude input with estimated value: ${weatherData.altitude}`);
        }
        
        // Render chart
        console.log(`[UI] Rendering chart with weather data`);
        weatherAPI.renderChart(weatherData.chartData);
        
        // Update tea form with climate data if possible
        updateTeaFormWithClimateData(weatherData);
        
    } catch (error) {
        console.error(`[UI] Weather data fetch error: ${error.message}`);
        errorDiv.textContent = error.message;
        
        // Only show CORS proxy help if we needed to use it
        if (weatherAPI.useCorsProxy) {
            const corsHelpText = document.createElement('p');
            corsHelpText.innerHTML = `
                Note: This application is using a CORS proxy. You may need to visit 
                <a href="https://cors-anywhere.herokuapp.com/corsdemo" 
                   target="_blank" 
                   style="color: blue; text-decoration: underline;">
                CORS Anywhere demo page
                </a> and request temporary access to the demo server.
            `;
            errorDiv.appendChild(corsHelpText);
        }
    } finally {
        fetchButton.disabled = false;
        fetchButton.textContent = 'Get Weather Data';
    }
}

// Update tea form with climate data
function updateTeaFormWithClimateData(weatherData) {
    // This function can be expanded to update any tea form fields
    // that should use climate data
    
    // For example, update climate inputs if they exist
    const humidityInput = document.getElementById('originHumidity');
    if (humidityInput) {
        humidityInput.value = `${weatherData.avgHumidity}%`;
    }
    
    const temperatureInput = document.getElementById('originTemperature');
    if (temperatureInput) {
        temperatureInput.value = `${weatherData.avgTemperature}°C`;
    }
    
    const altitudeInfoInput = document.getElementById('originAltitude');
    if (altitudeInfoInput) {
        altitudeInfoInput.value = `${weatherData.altitude} m`;
    }
    
    const solarExposureInput = document.getElementById('originSolarExposure');
    if (solarExposureInput) {
        solarExposureInput.value = `${weatherData.avgSolarExposure} kWh/m²/day`;
    }
}

// Initialize the geo interface when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up UI interactions when the interface is available
    if (document.getElementById('geo-section')) {
        initGeoInterface();
    }
}); 