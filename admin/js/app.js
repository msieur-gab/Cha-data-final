/**
 * Tea Details Recorder Application
 * Vanilla JavaScript implementation for creating and managing tea detail records
 */

// DOM Elements
const teaForm = document.getElementById('teaForm');
const teaTypeSelect = document.getElementById('teaType');
const oxidationLevelInput = document.getElementById('oxidationLevel');
const processingMethodsContainer = document.getElementById('processingMethods');
const suggestedProcessingMethodsContainer = document.getElementById('suggestedProcessingMethods');
const flavorProfilesContainer = document.getElementById('flavorProfiles');
const suggestedFlavorProfilesContainer = document.getElementById('suggestedFlavorProfiles');
const recordsList = document.getElementById('recordsList');
const exportButton = document.getElementById('exportButton');

// Custom input elements
const customProcessingMethod = document.getElementById('customProcessingMethod');
const processingMethodSuggestions = document.getElementById('processingMethodSuggestions');
const customFlavorCategory = document.getElementById('customFlavorCategory');
const customFlavorType = document.getElementById('customFlavorType');
const flavorProfileSuggestions = document.getElementById('flavorProfileSuggestions');

// Direct flavor input elements
const directFlavorTab = document.getElementById('directFlavorTab');
const categoryTypeTab = document.getElementById('categoryTypeTab');
const directFlavorInput = document.getElementById('directFlavorInput');
const categoryTypeInput = document.getElementById('categoryTypeInput');
const customFlavor = document.getElementById('customFlavor');
const flavorSuggestions = document.getElementById('flavorSuggestions');

// Application State
let teaRecords = JSON.parse(localStorage.getItem('teaRecords')) || [];
let selectedProcessingMethods = [];
let selectedFlavorProfiles = [];

// Initialize the application
function init() {
    // Set up event listeners
    teaTypeSelect.addEventListener('change', handleTeaTypeChange);
    teaForm.addEventListener('submit', handleFormSubmit);
    exportButton.addEventListener('click', exportRecords);
    
    // Check for problematic records
    checkRecords();
    
    // Display any existing records
    renderTeaRecords();
}

// Function to check for problematic records
function checkRecords() {
    if (teaRecords.length > 0) {
        console.log(`Loaded ${teaRecords.length} tea records from localStorage`);
        
        // Check for records with invalid tea types
        const invalidTypeRecords = teaRecords.filter(record => 
            !record.type || !teaTypes[record.type]
        );
        
        if (invalidTypeRecords.length > 0) {
            console.warn(`Found ${invalidTypeRecords.length} records with invalid tea types:`);
            invalidTypeRecords.forEach((record, index) => {
                console.warn(`Record ${index + 1}: id=${record.id}, name=${record.name}, type=${record.type || 'undefined'}`);
            });
            
            // Fix records if the user confirms
            if (confirm(`Found ${invalidTypeRecords.length} tea records with invalid data. Would you like to attempt to fix them?`)) {
                fixInvalidRecords();
            }
        }
    }
}

// Function to fix invalid records
function fixInvalidRecords() {
    let fixedCount = 0;
    
    // Clone the records array to avoid mutation during iteration
    const updatedRecords = teaRecords.map(record => {
        // Create a copy of the record to modify
        const fixedRecord = {...record};
        let wasFixed = false;
        
        // Fix tea type (example: if 'teaType' was used instead of 'type')
        if (!fixedRecord.type && fixedRecord.teaType && teaTypes[fixedRecord.teaType]) {
            fixedRecord.type = fixedRecord.teaType;
            delete fixedRecord.teaType;
            wasFixed = true;
        }
        
        // Fix processing methods if they're in the wrong format
        if (fixedRecord.processingMethods && Array.isArray(fixedRecord.processingMethods)) {
            const newMethods = [];
            
            fixedRecord.processingMethods.forEach(item => {
                if (typeof item === 'string') {
                    // Already in the correct format
                    newMethods.push(item);
                } else if (item && item.method) {
                    // Old format with { method: "method-name", details: {...} }
                    newMethods.push(item.method);
                    wasFixed = true;
                }
            });
            
            if (wasFixed) {
                fixedRecord.processingMethods = newMethods;
            }
        }
        
        // Fix flavor profiles if they're in the wrong format
        if (fixedRecord.flavorProfiles && Array.isArray(fixedRecord.flavorProfiles)) {
            const newProfiles = [];
            
            fixedRecord.flavorProfiles.forEach(item => {
                if (item && typeof item === 'object') {
                    if (item.category && item.type) {
                        // Check if it has the old format with 'details' property
                        if (item.details) {
                            // Old format with details, create a cleaner version
                            newProfiles.push({
                                category: item.category,
                                type: item.type
                            });
                            wasFixed = true;
                        } else {
                            // Already in the correct format
                            newProfiles.push(item);
                        }
                    }
                }
            });
            
            if (wasFixed) {
                fixedRecord.flavorProfiles = newProfiles;
            }
        }
        
        // Add origin object if it doesn't exist
        if (!fixedRecord.origin) {
            fixedRecord.origin = {
                location: '',
                altitude: '',
                temperature: '',
                humidity: '',
                solarExposure: '',
                latitude: '',
                longitude: ''
            };
            wasFixed = true;
        } else if (fixedRecord.origin && 
                   (typeof fixedRecord.origin.latitude === 'undefined' || 
                    typeof fixedRecord.origin.longitude === 'undefined')) {
            // Add missing coordinates fields to existing origin object
            fixedRecord.origin.latitude = fixedRecord.origin.latitude || '';
            fixedRecord.origin.longitude = fixedRecord.origin.longitude || '';
            wasFixed = true;
        }
        
        // Convert 'createdAt' to 'dateAdded' if needed
        if (!fixedRecord.dateAdded && fixedRecord.createdAt) {
            fixedRecord.dateAdded = fixedRecord.createdAt;
            delete fixedRecord.createdAt;
            wasFixed = true;
        }
        
        if (wasFixed) {
            fixedCount++;
        }
        
        return fixedRecord;
    });
    
    if (fixedCount > 0) {
        // Update records and save to localStorage
        teaRecords = updatedRecords;
        saveRecords();
        console.log(`Fixed ${fixedCount} records and saved to localStorage`);
        alert(`Fixed ${fixedCount} records. The page will now reload to apply the changes.`);
        window.location.reload();
    } else {
        console.log('No records needed fixing');
    }
}

// Handle tea type selection change
function handleTeaTypeChange() {
    const selectedTeaType = teaTypeSelect.value;
    
    if (!selectedTeaType) return;
    
    // Set oxidation level based on tea type
    oxidationLevelInput.value = teaTypes[selectedTeaType].oxidationLevel;
    
    // Clear current selections
    selectedProcessingMethods = [];
    selectedFlavorProfiles = [];
    
    // Update UI
    renderProcessingMethods();
    renderFlavorProfiles();
    
    // Show suggested processing methods
    renderSuggestedProcessingMethods(selectedTeaType);
    
    // Show suggested flavor profiles
    renderSuggestedFlavorProfiles(selectedTeaType);
}

// Render processing methods chips
function renderProcessingMethods() {
    processingMethodsContainer.innerHTML = '';
    
    selectedProcessingMethods.forEach(method => {
        const chip = createChip(method, 'processing');
        processingMethodsContainer.appendChild(chip);
    });
}

// Render suggested processing methods based on tea type
function renderSuggestedProcessingMethods(teaType) {
    suggestedProcessingMethodsContainer.innerHTML = '';
    
    // Use the getSuggestedProcessingMethods function from suggestions.js
    const suggestedMethods = getSuggestedProcessingMethods(teaType);
    
    if (!suggestedMethods || suggestedMethods.length === 0) return;
    
    suggestedMethods.forEach(method => {
        // Skip if already selected
        if (selectedProcessingMethods.includes(method)) return;
        
        const methodInfo = processingMethods[method];
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.textContent = formatMethodName(method);
        suggestion.title = `${methodInfo.description} (${methodInfo.intensity})`;
        
        suggestion.addEventListener('click', () => {
            addProcessingMethod(method);
        });
        
        suggestedProcessingMethodsContainer.appendChild(suggestion);
    });
}

// Add a processing method
function addProcessingMethod(method) {
    if (!selectedProcessingMethods.includes(method)) {
        selectedProcessingMethods.push(method);
        renderProcessingMethods();
        renderSuggestedProcessingMethods(teaTypeSelect.value);
    }
}

// Remove a processing method
function removeProcessingMethod(method) {
    selectedProcessingMethods = selectedProcessingMethods.filter(m => m !== method);
    renderProcessingMethods();
    renderSuggestedProcessingMethods(teaTypeSelect.value);
}

// Render flavor profiles chips
function renderFlavorProfiles() {
    flavorProfilesContainer.innerHTML = '';
    
    selectedFlavorProfiles.forEach(profile => {
        const chip = createChip(`${profile.category}: ${formatFlavorType(profile.type)}`, 'flavor', profile);
        flavorProfilesContainer.appendChild(chip);
    });
}

// Render suggested flavor profiles based on tea type
function renderSuggestedFlavorProfiles(teaType) {
    suggestedFlavorProfilesContainer.innerHTML = '';
    
    // Use the getSuggestedFlavorProfiles function from suggestions.js
    const suggestedProfiles = getSuggestedFlavorProfiles(teaType);
    
    if (!suggestedProfiles || suggestedProfiles.length === 0) return;
    
    suggestedProfiles.forEach(profile => {
        // Skip if already selected
        if (selectedFlavorProfiles.some(p => p.category === profile.category && p.type === profile.type)) return;
        
        const flavorInfo = flavorProfiles[profile.category][profile.type];
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.textContent = `${formatCategoryName(profile.category)}: ${formatFlavorType(profile.type)}`;
        suggestion.title = `${flavorInfo.flavors.join(', ')} (${flavorInfo.intensity})`;
        
        suggestion.addEventListener('click', () => {
            addFlavorProfile(profile);
        });
        
        suggestedFlavorProfilesContainer.appendChild(suggestion);
    });
}

// Add a flavor profile
function addFlavorProfile(profile) {
    if (!selectedFlavorProfiles.some(p => p.category === profile.category && p.type === profile.type)) {
        selectedFlavorProfiles.push(profile);
        renderFlavorProfiles();
        renderSuggestedFlavorProfiles(teaTypeSelect.value);
    }
}

// Remove a flavor profile
function removeFlavorProfile(profile) {
    selectedFlavorProfiles = selectedFlavorProfiles.filter(
        p => !(p.category === profile.category && p.type === profile.type)
    );
    renderFlavorProfiles();
    renderSuggestedFlavorProfiles(teaTypeSelect.value);
}

// Create a dismissable chip element
function createChip(text, type, data = null) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    
    const chipText = document.createElement('span');
    chipText.className = 'chip-text';
    chipText.textContent = text;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'chip-close';
    closeBtn.innerHTML = '&times;';
    
    closeBtn.addEventListener('click', () => {
        if (type === 'processing') {
            removeProcessingMethod(text);
        } else if (type === 'flavor') {
            removeFlavorProfile(data);
        }
    });
    
    chip.appendChild(chipText);
    chip.appendChild(closeBtn);
    
    return chip;
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(teaForm);
    const teaName = formData.get('teaName');
    const originalName = formData.get('originalName');
    const teaType = formData.get('teaType');
    const oxidationLevel = formData.get('oxidationLevel');
    const notes = formData.get('teaNotes');
    
    // Get origin information
    const originLocation = formData.get('originLocation') || '';
    const originAltitude = formData.get('originAltitude') || '';
    const originTemperature = formData.get('originTemperature') || '';
    const originHumidity = formData.get('originHumidity') || '';
    const originSolarExposure = formData.get('originSolarExposure') || '';
    
    // Get coordinates from the geo data inputs if available
    const latitudeInput = document.getElementById('latitudeInput');
    const longitudeInput = document.getElementById('longitudeInput');
    const latitude = latitudeInput ? latitudeInput.value : '';
    const longitude = longitudeInput ? longitudeInput.value : '';
    
    // Create tea record object
    const newTeaRecord = {
        id: Date.now().toString(),
        name: teaName,
        originalName: originalName,
        type: teaType,
        oxidationLevel: oxidationLevel,
        processingMethods: [...selectedProcessingMethods],
        flavorProfiles: [...selectedFlavorProfiles],
        notes: notes,
        // Add origin information
        origin: {
            location: originLocation,
            altitude: originAltitude,
            temperature: originTemperature,
            humidity: originHumidity,
            solarExposure: originSolarExposure,
            latitude: latitude,
            longitude: longitude
        },
        dateAdded: new Date().toISOString()
    };
    
    // Add to records array
    teaRecords.push(newTeaRecord);
    
    // Save to localStorage
    saveRecords();
    
    // Reset form
    teaForm.reset();
    teaTypeSelect.value = '';
    oxidationLevelInput.value = '';
    selectedProcessingMethods = [];
    selectedFlavorProfiles = [];
    
    // Clear origin fields
    document.getElementById('originLocation').value = '';
    document.getElementById('originAltitude').value = '';
    document.getElementById('originTemperature').value = '';
    document.getElementById('originHumidity').value = '';
    document.getElementById('originSolarExposure').value = '';
    
    // Reset UI
    renderProcessingMethods();
    renderFlavorProfiles();
    suggestedProcessingMethodsContainer.innerHTML = '';
    suggestedFlavorProfilesContainer.innerHTML = '';
    
    // Reset geo data section
    resetGeoDataUI();
    
    // Update records list
    renderTeaRecords();
}

// Save records to localStorage
function saveRecords() {
    localStorage.setItem('teaRecords', JSON.stringify(teaRecords));
}

// Render tea records list
function renderTeaRecords() {
    recordsList.innerHTML = '';
    
    if (teaRecords.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No tea records yet. Add one above!';
        recordsList.appendChild(emptyMessage);
        return;
    }
    
    teaRecords.forEach(record => {
        const recordItem = document.createElement('li');
        recordItem.className = 'record-item';
        
        const recordInfo = document.createElement('div');
        recordInfo.className = 'record-info';
        
        const recordTitle = document.createElement('h3');
        recordTitle.textContent = record.name;
        
        const recordType = document.createElement('p');
        if (record.type && teaTypes[record.type] && teaTypes[record.type].name) {
            recordType.textContent = `Type: ${teaTypes[record.type].name}`;
        } else {
            recordType.textContent = `Type: ${record.type || 'Unknown'}`;
        }
        
        recordInfo.appendChild(recordTitle);
        recordInfo.appendChild(recordType);
        
        const recordActions = document.createElement('div');
        recordActions.className = 'record-actions';
        
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', () => viewRecord(record.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteRecord(record.id));
        
        recordActions.appendChild(viewButton);
        recordActions.appendChild(deleteButton);
        
        recordItem.appendChild(recordInfo);
        recordItem.appendChild(recordActions);
        
        recordsList.appendChild(recordItem);
    });
}

// Display a tea record's details
function viewRecord(recordId) {
    const record = teaRecords.find(rec => rec.id === recordId);
    
    if (!record) return;
    
    // Create modal for viewing the record
    const modal = document.createElement('div');
    modal.className = 'record-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'record-modal-content';
    
    // Tea name and original name
    const nameHeading = document.createElement('h2');
    nameHeading.textContent = record.name;
    if (record.originalName) {
        nameHeading.innerHTML += ` <span class="original-name">(${record.originalName})</span>`;
    }
    
    // Tea type and oxidation level
    const typeInfo = document.createElement('p');
    typeInfo.className = 'tea-type-info';
    if (record.type && teaTypes[record.type] && teaTypes[record.type].name) {
        typeInfo.innerHTML = `<strong>${teaTypes[record.type].name}</strong> · ${record.oxidationLevel}`;
    } else {
        typeInfo.innerHTML = `<strong>${record.type || 'Unknown'}</strong> · ${record.oxidationLevel || 'Unknown'}`;
    }
    
    // Origin information (if available)
    let originInfo = '';
    if (record.origin && (record.origin.location || record.origin.altitude || record.origin.latitude || record.origin.longitude)) {
        originInfo = '<div class="tea-origin-info"><h3>Origin Information</h3>';
        
        if (record.origin.location) {
            originInfo += `<p><strong>Location:</strong> ${record.origin.location}</p>`;
        }
        
        // Display coordinates if available
        if (record.origin.latitude && record.origin.longitude) {
            originInfo += `<p><strong>Coordinates:</strong> ${record.origin.latitude}, ${record.origin.longitude}</p>`;
            
            // Add view on map button
            originInfo += `<p><button class="map-view-button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${record.origin.latitude},${record.origin.longitude}', '_blank')">View on Map</button></p>`;
        }
        
        if (record.origin.altitude) {
            originInfo += `<p><strong>Altitude:</strong> ${record.origin.altitude}</p>`;
        }
        
        if (record.origin.temperature) {
            originInfo += `<p><strong>Average Temperature:</strong> ${record.origin.temperature}</p>`;
        }
        
        if (record.origin.humidity) {
            originInfo += `<p><strong>Average Humidity:</strong> ${record.origin.humidity}</p>`;
        }
        
        if (record.origin.solarExposure) {
            originInfo += `<p><strong>Solar Exposure:</strong> ${record.origin.solarExposure}</p>`;
        }
        
        originInfo += '</div>';
    }
    
    // Processing methods
    const processingMethodsSection = document.createElement('div');
    processingMethodsSection.className = 'processing-methods-section';
    processingMethodsSection.innerHTML = '<h3>Processing Methods</h3>';
    
    if (record.processingMethods && record.processingMethods.length > 0) {
        const methodsList = document.createElement('ul');
        methodsList.className = 'methods-list';
        
        record.processingMethods.forEach(method => {
            const li = document.createElement('li');
            // Add error handling for invalid processing methods
            if (method && processingMethods[method]) {
                const methodInfo = processingMethods[method];
                li.innerHTML = `<strong>${formatMethodName(method)}</strong> - ${methodInfo.description} (${methodInfo.intensity})`;
            } else {
                li.innerHTML = `<strong>${method ? formatMethodName(method) : 'Unknown'}</strong> - No detailed information available`;
            }
            methodsList.appendChild(li);
        });
        
        processingMethodsSection.appendChild(methodsList);
    } else {
        processingMethodsSection.innerHTML += '<p>No processing methods specified</p>';
    }
    
    // Flavor profiles
    const flavorProfilesSection = document.createElement('div');
    flavorProfilesSection.className = 'flavor-profiles-section';
    flavorProfilesSection.innerHTML = '<h3>Flavor Profiles</h3>';
    
    if (record.flavorProfiles && record.flavorProfiles.length > 0) {
        const profilesList = document.createElement('ul');
        profilesList.className = 'profiles-list';
        
        record.flavorProfiles.forEach(profile => {
            const li = document.createElement('li');
            
            // Add error handling for invalid flavor profiles
            if (profile && profile.category && profile.type && 
                flavorProfiles[profile.category] && 
                flavorProfiles[profile.category][profile.type]) {
                
                const profileInfo = flavorProfiles[profile.category][profile.type];
                li.innerHTML = `<strong>${formatCategoryName(profile.category)}: ${formatFlavorType(profile.type)}</strong> - ${profileInfo.flavors.join(', ')} (${profileInfo.intensity})`;
            } else {
                const category = profile && profile.category ? formatCategoryName(profile.category) : 'Unknown';
                const type = profile && profile.type ? formatFlavorType(profile.type) : 'Unknown';
                li.innerHTML = `<strong>${category}: ${type}</strong> - No detailed information available`;
            }
            
            profilesList.appendChild(li);
        });
        
        flavorProfilesSection.appendChild(profilesList);
    } else {
        flavorProfilesSection.innerHTML += '<p>No flavor profiles specified</p>';
    }
    
    // Notes
    let notesSection = '';
    if (record.notes) {
        notesSection = `
            <div class="notes-section">
                <h3>Notes</h3>
            <p>${record.notes}</p>
            </div>
        `;
    }
    
    // Date added
    const dateAdded = new Date(record.dateAdded).toLocaleDateString();
    const dateSection = `<div class="date-section"><small>Added on ${dateAdded}</small></div>`;
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Assemble the modal content
    modalContent.appendChild(closeButton);
    modalContent.appendChild(nameHeading);
    modalContent.appendChild(typeInfo);
    modalContent.innerHTML += originInfo;
    modalContent.appendChild(processingMethodsSection);
    modalContent.appendChild(flavorProfilesSection);
    modalContent.innerHTML += notesSection;
    modalContent.innerHTML += dateSection;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listener to close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Delete a record
function deleteRecord(recordId) {
    if (confirm('Are you sure you want to delete this tea record?')) {
        teaRecords = teaRecords.filter(record => record.id !== recordId);
        saveRecords();
        renderTeaRecords();
    }
}

// Export records as JSON file
function exportRecords() {
    if (teaRecords.length === 0) {
        alert('No tea records to export.');
        return;
    }
    
    const dataStr = JSON.stringify(teaRecords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tea-records.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Helper function to format method names
function formatMethodName(method) {
    if (!method || typeof method !== 'string') return 'Unknown';
    return method.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Helper function to format category names
function formatCategoryName(category) {
    if (!category || typeof category !== 'string') return 'Unknown';
    return category.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Helper function to format flavor types
function formatFlavorType(type) {
    if (!type || typeof type !== 'string') return 'Unknown';
    return type.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Reset geo data UI
function resetGeoDataUI() {
    // Clear geo data inputs if they exist
    const locationInput = document.getElementById('locationInput');
    if (locationInput) locationInput.value = '';
    
    const latitudeInput = document.getElementById('latitudeInput');
    if (latitudeInput) latitudeInput.value = '';
    
    const longitudeInput = document.getElementById('longitudeInput');
    if (longitudeInput) longitudeInput.value = '';
    
    const altitudeInput = document.getElementById('altitudeInput');
    if (altitudeInput) altitudeInput.value = '';
    
    // Reset results display
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) resultsContainer.style.display = 'none';
    
    const errorDiv = document.getElementById('error');
    if (errorDiv) errorDiv.textContent = '';
    
    // Disable fetch button
    const fetchButton = document.getElementById('fetchButton');
    if (fetchButton) fetchButton.disabled = true;
    
    // Clear chart
    const chartCanvas = document.getElementById('chart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    }
    
    // Reset location results
    const locationResultsDiv = document.getElementById('locationResults');
    if (locationResultsDiv) {
        locationResultsDiv.innerHTML = '';
        locationResultsDiv.style.display = 'none';
    }
}

// Initialize custom input autocomplete functionality
function initCustomInputs() {
    // Set up tab switching for flavor input methods
    directFlavorTab.addEventListener('click', function(e) {
        e.preventDefault();
        directFlavorTab.classList.add('active');
        categoryTypeTab.classList.remove('active');
        directFlavorInput.style.display = 'block';
        categoryTypeInput.style.display = 'none';
    });
    
    categoryTypeTab.addEventListener('click', function(e) {
        e.preventDefault();
        categoryTypeTab.classList.add('active');
        directFlavorTab.classList.remove('active');
        categoryTypeInput.style.display = 'block';
        directFlavorInput.style.display = 'none';
    });

    // Processing method autocomplete
    customProcessingMethod.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase();
        if (inputValue.length < 2) {
            processingMethodSuggestions.style.display = 'none';
            return;
        }
        
        // Filter all available processing methods
        const allMethods = Object.keys(processingMethods);
        const matchingMethods = allMethods.filter(method => 
            formatMethodName(method).toLowerCase().includes(inputValue)
        );
        
        renderProcessingMethodSuggestions(matchingMethods);
    });
    
    customProcessingMethod.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value) {
            e.preventDefault();
            
            const inputValue = this.value.toLowerCase();
            const allMethods = Object.keys(processingMethods);
            
            // Check if input matches an existing method
            const exactMatch = allMethods.find(method => 
                formatMethodName(method).toLowerCase() === inputValue
            );
            
            if (exactMatch) {
                addProcessingMethod(exactMatch);
            } else {
                // Convert input to kebab-case for new method
                const kebabCaseMethod = inputValue
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                
                if (kebabCaseMethod) {
                    addProcessingMethod(kebabCaseMethod);
                }
            }
            
            this.value = '';
            processingMethodSuggestions.style.display = 'none';
        }
    });
    
    // Direct flavor input autocomplete
    customFlavor.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase();
        if (inputValue.length < 2) {
            flavorSuggestions.style.display = 'none';
            return;
        }
        
        // Find matching flavors using the searchFlavors function from suggestions.js
        const matchingFlavors = searchFlavors(inputValue);
        renderFlavorSuggestions(matchingFlavors);
    });
    
    customFlavor.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value) {
            e.preventDefault();
            
            const inputValue = this.value.trim();
            
            // Try to find a matching flavor in our database
            const exactMatch = getAllFlavors().find(flavor => 
                flavor.toLowerCase() === inputValue.toLowerCase()
            );
            
            if (exactMatch) {
                // If we have an exact match, use the predefined category and type
                const categoryType = getCategoryTypeForFlavor(exactMatch);
                if (categoryType) {
                    addFlavorProfile(categoryType);
                }
            } else {
                // For custom flavors, try to infer a category if possible, 
                // or use a generic custom category
                let inferredCategory = null;
                
                // Check if any known flavor contains this text
                for (const knownFlavor of getAllFlavors()) {
                    if (knownFlavor.toLowerCase().includes(inputValue.toLowerCase()) || 
                        inputValue.toLowerCase().includes(knownFlavor.toLowerCase())) {
                        const categoryType = getCategoryTypeForFlavor(knownFlavor);
                        if (categoryType) {
                            inferredCategory = categoryType.category;
                            break;
                        }
                    }
                }
                
                // If we couldn't infer a category, use "custom"
                const category = inferredCategory || 'custom';
                
                // Create a snake_case type from the input
                const snakeCaseType = inputValue
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                
                if (snakeCaseType) {
                    addFlavorProfile({ category, type: snakeCaseType });
                }
            }
            
            this.value = '';
            flavorSuggestions.style.display = 'none';
        }
    });
    
    // Flavor profile category autocomplete
    customFlavorCategory.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase();
        if (inputValue.length < 2) {
            flavorProfileSuggestions.style.display = 'none';
            return;
        }
        
        // Filter all available flavor categories
        const allCategories = Object.keys(flavorProfiles);
        const matchingCategories = allCategories.filter(category => 
            formatCategoryName(category).toLowerCase().includes(inputValue)
        );
        
        renderFlavorCategorySuggestions(matchingCategories);
    });
    
    // Flavor profile type autocomplete
    customFlavorType.addEventListener('input', function() {
        const categoryValue = customFlavorCategory.value.toLowerCase();
        const typeValue = this.value.toLowerCase();
        
        if (typeValue.length < 2 || !categoryValue) {
            flavorProfileSuggestions.style.display = 'none';
            return;
        }
        
        // Try to match category to one of the existing categories
        const allCategories = Object.keys(flavorProfiles);
        const matchingCategory = allCategories.find(category => 
            formatCategoryName(category).toLowerCase() === categoryValue
        );
        
        if (matchingCategory) {
            // If category matches, show matching types within that category
            const allTypes = Object.keys(flavorProfiles[matchingCategory]);
            const matchingTypes = allTypes.filter(type => 
                formatFlavorType(type).toLowerCase().includes(typeValue)
            );
            
            renderFlavorTypeSuggestions(matchingCategory, matchingTypes);
        } else {
            flavorProfileSuggestions.style.display = 'none';
        }
    });
    
    // Add custom flavor profile on Enter
    customFlavorType.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value && customFlavorCategory.value) {
            e.preventDefault();
            
            const categoryValue = customFlavorCategory.value.toLowerCase();
            const typeValue = this.value.toLowerCase();
            
            // Check if input matches existing category and type
            const allCategories = Object.keys(flavorProfiles);
            const matchingCategory = allCategories.find(category => 
                formatCategoryName(category).toLowerCase() === categoryValue
            );
            
            if (matchingCategory) {
                const allTypes = Object.keys(flavorProfiles[matchingCategory]);
                const matchingType = allTypes.find(type => 
                    formatFlavorType(type).toLowerCase() === typeValue
                );
                
                if (matchingType) {
                    // Exact match for both category and type
                    addFlavorProfile({ category: matchingCategory, type: matchingType });
                } else {
                    // Matching category but custom type - convert to snake_case
                    const snakeCaseType = typeValue
                        .trim()
                        .replace(/\s+/g, '_')
                        .replace(/[^a-z0-9_]/g, '');
                    
                    if (snakeCaseType) {
                        addFlavorProfile({ category: matchingCategory, type: snakeCaseType });
                    }
                }
            } else {
                // Custom category and type - convert both to snake_case
                const snakeCaseCategory = categoryValue
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                
                const snakeCaseType = typeValue
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                
                if (snakeCaseCategory && snakeCaseType) {
                    addFlavorProfile({ category: snakeCaseCategory, type: snakeCaseType });
                }
            }
            
            // Clear inputs
            customFlavorCategory.value = '';
            this.value = '';
            flavorProfileSuggestions.style.display = 'none';
        }
    });
    
    // Close suggestions when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#customProcessingMethod') && 
            !e.target.closest('#processingMethodSuggestions')) {
            processingMethodSuggestions.style.display = 'none';
        }
        
        if (!e.target.closest('#customFlavorCategory') && 
            !e.target.closest('#customFlavorType') && 
            !e.target.closest('#flavorProfileSuggestions')) {
            flavorProfileSuggestions.style.display = 'none';
        }
        
        if (!e.target.closest('#customFlavor') && 
            !e.target.closest('#flavorSuggestions')) {
            flavorSuggestions.style.display = 'none';
        }
    });
}

// Render processing method suggestions for autocomplete
function renderProcessingMethodSuggestions(methods) {
    processingMethodSuggestions.innerHTML = '';
    
    if (methods.length === 0) {
        processingMethodSuggestions.style.display = 'none';
        return;
    }
    
    methods.forEach(method => {
        const suggestion = document.createElement('div');
        suggestion.className = 'autocomplete-suggestion';
        suggestion.textContent = formatMethodName(method);
        
        suggestion.addEventListener('click', () => {
            addProcessingMethod(method);
            customProcessingMethod.value = '';
            processingMethodSuggestions.style.display = 'none';
        });
        
        processingMethodSuggestions.appendChild(suggestion);
    });
    
    processingMethodSuggestions.style.display = 'block';
}

// Render flavor category suggestions for autocomplete
function renderFlavorCategorySuggestions(categories) {
    flavorProfileSuggestions.innerHTML = '';
    
    if (categories.length === 0) {
        flavorProfileSuggestions.style.display = 'none';
        return;
    }
    
    categories.forEach(category => {
        const suggestion = document.createElement('div');
        suggestion.className = 'autocomplete-suggestion';
        suggestion.textContent = formatCategoryName(category);
        
        suggestion.addEventListener('click', () => {
            customFlavorCategory.value = formatCategoryName(category);
            flavorProfileSuggestions.style.display = 'none';
            
            // Focus on the type input
            customFlavorType.focus();
        });
        
        flavorProfileSuggestions.appendChild(suggestion);
    });
    
    flavorProfileSuggestions.style.display = 'block';
}

// Render flavor type suggestions for autocomplete
function renderFlavorTypeSuggestions(category, types) {
    flavorProfileSuggestions.innerHTML = '';
    
    if (types.length === 0) {
        flavorProfileSuggestions.style.display = 'none';
        return;
    }
    
    types.forEach(type => {
        const suggestion = document.createElement('div');
        suggestion.className = 'autocomplete-suggestion';
        suggestion.textContent = formatFlavorType(type);
        
        const flavorInfo = flavorProfiles[category][type];
        if (flavorInfo) {
            suggestion.title = `${flavorInfo.flavors.join(', ')} (${flavorInfo.intensity})`;
        }
        
        suggestion.addEventListener('click', () => {
            customFlavorType.value = formatFlavorType(type);
            flavorProfileSuggestions.style.display = 'none';
            
            // Auto-add if both fields are filled
            if (customFlavorCategory.value) {
                addFlavorProfile({ category, type });
                customFlavorCategory.value = '';
                customFlavorType.value = '';
            }
        });
        
        flavorProfileSuggestions.appendChild(suggestion);
    });
    
    flavorProfileSuggestions.style.display = 'block';
}

// Render flavor suggestions for autocomplete
function renderFlavorSuggestions(flavors) {
    flavorSuggestions.innerHTML = '';
    
    if (flavors.length === 0) {
        flavorSuggestions.style.display = 'none';
        return;
    }
    
    flavors.forEach(flavor => {
        const suggestion = document.createElement('div');
        suggestion.className = 'autocomplete-suggestion';
        suggestion.textContent = flavor;
        
        // If possible, add flavor details as title
        const categoryType = getCategoryTypeForFlavor(flavor);
        if (categoryType && flavorProfiles[categoryType.category] && 
            flavorProfiles[categoryType.category][categoryType.type]) {
            const flavorInfo = flavorProfiles[categoryType.category][categoryType.type];
            if (flavorInfo) {
                const categoryName = formatCategoryName(categoryType.category);
                const typeName = formatFlavorType(categoryType.type);
                suggestion.title = `${categoryName}: ${typeName} (${flavorInfo.intensity})`;
            }
        }
        
        suggestion.addEventListener('click', () => {
            const categoryType = getCategoryTypeForFlavor(flavor);
            if (categoryType) {
                addFlavorProfile(categoryType);
            } else {
                // Fallback for unknown flavors
                const snakeCaseType = flavor
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                
                addFlavorProfile({ category: 'custom', type: snakeCaseType });
            }
            
            customFlavor.value = '';
            flavorSuggestions.style.display = 'none';
        });
        
        flavorSuggestions.appendChild(suggestion);
    });
    
    flavorSuggestions.style.display = 'block';
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    initCustomInputs();
}); 