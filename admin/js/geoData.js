/**
 * Tea Geographical Data API Integration
 * Handles integration with OpenMeteo API for tea origin weather and location data
 */

// OpenMeteo Weather Data Retriever Class
class OpenMeteoWeatherAPI {
    constructor(options) {
        this.corsProxy = (options && options.corsProxy) || 'https://cors-anywhere.herokuapp.com/';
        this.baseUrl = 'https://archive-api.open-meteo.com/v1/archive';
        this.elevationUrl = 'https://api.open-elevation.com/api/v1/lookup';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.chart = null;
        this.useCorsProxy = false; // Default to not using CORS proxy
    }

    // Helper method to try request with and without CORS proxy
    async tryFetchWithFallback(url, options = {}) {
        try {
            // First try without CORS proxy
            console.log(`[API] Attempting direct request to: ${url}`);
            const directResponse = await fetch(url, options);
            console.log(`[API] Direct request successful!`);
            this.useCorsProxy = false; // Remember that direct requests work
            return directResponse;
        } catch (error) {
            console.log(`[API] Direct request failed: ${error.message}`);
            console.log(`[API] Falling back to CORS proxy...`);
            
            // If direct request fails, try with CORS proxy
            const proxyUrl = this.corsProxy + url;
            console.log(`[API] Attempting proxy request to: ${proxyUrl}`);
            const proxyResponse = await fetch(proxyUrl, options);
            console.log(`[API] Proxy request successful!`);
            this.useCorsProxy = true; // Remember that we need to use the proxy
            return proxyResponse;
        }
    }

    async searchLocation(locationName) {
        try {
            const url = `${this.geocodingUrl}?name=${encodeURIComponent(locationName)}&count=5&language=en&format=json`;
            console.log(`[API] Searching for location: "${locationName}" - URL: ${url}`);
            
            if (!locationName.trim()) {
                throw new Error('Please enter a location name');
            }
            
            const response = await this.tryFetchWithFallback(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }
            
            const data = await response.json();
            console.log(`[API] Location search returned ${data.results ? data.results.length : 0} results`);
            
            if (!data.results || data.results.length === 0) {
                throw new Error('Location not found. Please try a different name.');
            }
            
            return data.results.map(location => ({
                latitude: location.latitude,
                longitude: location.longitude,
                elevation: location.elevation || null,
                name: location.name,
                country: location.country || 'Unknown',
                admin1: location.admin1 || 'Unknown',
                admin2: location.admin2 || ''
            }));
        } catch (error) {
            console.error('Location search error:', error);
            throw error;
        }
    }

    async getElevation(latitude, longitude) {
        try {
            const requestBody = JSON.stringify({
                locations: [
                    {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude)
                    }
                ]
            });
            
            console.log(`[API] Fetching elevation for coordinates: ${latitude}, ${longitude}`);
            
            const response = await this.tryFetchWithFallback(this.elevationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            if (!response.ok) {
                throw new Error('Failed to fetch elevation data');
            }

            const data = await response.json();
            console.log(`[API] Elevation data received: ${data.results[0].elevation} meters`);
            return Math.round(data.results[0].elevation);
        } catch (error) {
            console.error('Elevation fetch error:', error);
            throw error;
        }
    }

    async fetchWeatherData(latitude, longitude, altitude, autoEstimate, locationInfo) {
        try {
            console.log(`[API] Fetching weather data for: ${latitude}, ${longitude}`);
            console.log(`[API] Auto-estimate altitude: ${autoEstimate}, Provided altitude: ${altitude}`);
            
            // Validate inputs
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon)) {
                throw new Error('Please enter valid latitude and longitude');
            }

            // Get elevation if auto-estimating or no altitude provided
            let finalAltitude;
            if (autoEstimate || !altitude) {
                if (locationInfo && locationInfo.elevation) {
                    console.log(`[API] Using location API elevation: ${locationInfo.elevation}`);
                    finalAltitude = locationInfo.elevation;
                } else {
                    console.log(`[API] Requesting elevation from elevation API`);
                    finalAltitude = await this.getElevation(lat, lon);
                }
            } else {
                finalAltitude = parseFloat(altitude);
            }
            console.log(`[API] Final altitude used: ${finalAltitude} meters`);
            
            // Construct API URL
            const apiUrl = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&start_date=2022-01-01&end_date=2024-12-31&hourly=shortwave_radiation,relative_humidity_2m,temperature_2m&elevation=${finalAltitude}`;
            console.log(`[API] Weather API URL: ${apiUrl}`);

            // Fetch data
            console.log(`[API] Sending weather data request`);
            const response = await this.tryFetchWithFallback(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            console.log(`[API] Weather data received successfully`);
            const data = await response.json();

            // Process hourly data
            const solarRadiation = data.hourly.shortwave_radiation;
            const humidity = data.hourly.relative_humidity_2m;
            const temperature = data.hourly.temperature_2m;

            // Calculate averages
            const avgSolarRadiation = solarRadiation.reduce((a, b) => a + b, 0) / solarRadiation.length;
            const avgHumidity = humidity.reduce((a, b) => a + b, 0) / humidity.length;
            const avgTemperature = temperature.reduce((a, b) => a + b, 0) / temperature.length;

            // Convert average solar radiation (W/m²) to solar exposure (kWh/m²/day)
            // Solar radiation is instantaneous power, to get energy we multiply by time
            // Average over 24 hours and convert from W to kW (divide by 1000)
            const avgSolarExposure = (avgSolarRadiation * 24) / 1000;
            console.log(`[API] Converted avg solar radiation ${avgSolarRadiation.toFixed(2)} W/m² to ${avgSolarExposure.toFixed(2)} kWh/m²/day`);

            // Prepare chart data (sampling to reduce points)
            const filteredSolarRadiation = solarRadiation.filter((_, index) => index % 24 === 0);
            const filteredHumidity = humidity.filter((_, index) => index % 24 === 0);
            const filteredTemperature = temperature.filter((_, index) => index % 24 === 0);

            const chartData = {
                labels: filteredSolarRadiation.map((_, index) => `Day ${Math.floor(index / 24) + 1}`),
                datasets: [
                    {
                        label: 'Solar Radiation (W/m²)',
                        data: filteredSolarRadiation,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Humidity (%)',
                        data: filteredHumidity,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                        yAxisID: 'y2'
                    },
                    {
                        label: 'Temperature (°C)',
                        data: filteredTemperature,
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.1,
                        yAxisID: 'y3'
                    }
                ]
            };

            return {
                avgSolarRadiation: avgSolarRadiation.toFixed(2),
                avgSolarExposure: avgSolarExposure.toFixed(2),
                avgHumidity: avgHumidity.toFixed(2),
                avgTemperature: avgTemperature.toFixed(2),
                altitude: finalAltitude,
                chartData
            };
        } catch (error) {
            console.error('Weather data fetch error:', error);
            throw error;
        }
    }

    renderChart(chartData) {
        const ctx = document.getElementById('chart');
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weather Data Visualization'
                    }
                },
                scales: {
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Solar Radiation (W/m²)'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y3: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize the weather API instance
const weatherAPI = new OpenMeteoWeatherAPI(); 