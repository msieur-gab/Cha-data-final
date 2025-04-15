/**
 * Tea Flavor Wheel Visualization
 * This file handles the rendering and interaction for the flavor wheel
 * Uses D3.js for visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const flavorWheelContainer = document.getElementById('flavor-wheel-container');
    const teaTypeSelect = document.getElementById('tea-type');
    const flavorSearch = document.getElementById('flavor-search');
    const searchButton = document.getElementById('search-button');
    const selectedFlavorName = document.getElementById('selected-flavor-name');
    const flavorCategory = document.getElementById('flavor-category');
    const flavorIntensity = document.getElementById('flavor-intensity');
    const flavorTeaTypes = document.getElementById('flavor-tea-types');
    const complementaryList = document.getElementById('complementary-list');
    const contrastingList = document.getElementById('contrasting-list');

    // Configuration for the wheel
    const config = {
        width: 700,
        height: 700,
        margin: 20,
    };

    // Calculate radius
    const radius = Math.min(config.width, config.height) / 2 - config.margin;

    // Set up the SVG
    const svg = d3.select('#flavor-wheel-container')
        .append('svg')
        .attr('width', config.width)
        .attr('height', config.height)
        .append('g')
        .attr('transform', `translate(${config.width / 2}, ${config.height / 2})`)
        .classed('flavor-wheel-animation', true);

    // Create a tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Create the partition layout
    const partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Create the arc generator
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);

    // Process the data to prepare for visualization
    const root = d3.hierarchy(flavorWheelData.wheel)
        .sum(d => d.children ? 0 : 1)
        .sort((a, b) => b.value - a.value);
    
    // Apply the partition layout
    partition(root);

    // Store the full data for resetting
    let fullData;
    let currentRoot;
    let focusedNode = null;

    function createFlavorWheel(data) {
        // Store the full data for later use
        fullData = data;
        currentRoot = data;
        
        // Clear any existing SVG
        d3.select("#flavor-wheel-container svg").remove();
        
        // Set up dimensions
        const width = 800;
        const height = 800;
        const radius = Math.min(width, height) / 2;
        
        // Create SVG
        const svg = d3.select("#flavor-wheel-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        
        // Add center circle for resetting
        svg.append("circle")
            .attr("r", 40)
            .attr("fill", "#f5f5f5")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("class", "center-circle")
            .style("cursor", "pointer")
            .on("click", () => resetWheel());
        
        // Add text to center circle
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("class", "center-text")
            .text("Reset")
            .style("cursor", "pointer")
            .on("click", () => resetWheel());
        
        // Create partition layout
        const partition = d3.partition()
            .size([2 * Math.PI, radius]);
        
        // Create root hierarchy
        const root = d3.hierarchy(currentRoot)
            .sum(d => d.children ? 0 : 1)
            .sort((a, b) => b.value - a.value);
        
        // Apply partition layout
        partition(root);
        
        // Create arc generator
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);
        
        // Create slices
        const slices = svg.selectAll("path")
            .data(root.descendants())
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => d.data.color || "#ccc")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            .on("click", (event, d) => focusNode(d))
            .append("title")
            .text(d => d.data.name);
        
        // Add labels
        const labels = svg.selectAll("text.label")
            .data(root.descendants().filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("transform", d => {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", d => (d.x0 + d.x1) / 2 < Math.PI ? "start" : "end")
            .text(d => d.data.name)
            .style("font-size", d => {
                // Adjust font size based on depth
                const size = 14 - d.depth * 2;
                return `${Math.max(8, size)}px`;
            })
            .style("cursor", "pointer")
            .on("click", (event, d) => focusNode(d));
    }

    // Function to focus on a node
    function focusNode(node) {
        // Don't focus on leaf nodes
        if (!node.children && !node._children) return;
        
        // Don't refocus on already focused node
        if (focusedNode === node) return;
        
        focusedNode = node;
        
        // Create a new data structure with the selected node as root
        const focusData = {
            name: node.data.name,
            color: node.data.color,
            children: node.data.children
        };
        
        // Update current root
        currentRoot = focusData;
        
        // Animate transition
        d3.selectAll("#flavor-wheel-container svg > g > *").remove();
        
        // Recreate the wheel with the new data
        createFlavorWheel(focusData);
        
        // Update info panel to show category info
        updateInfoPanel(node.data);
    }

    // Function to reset the wheel to full view
    function resetWheel() {
        if (currentRoot === fullData) return;
        
        focusedNode = null;
        currentRoot = fullData;
        
        // Animate transition
        d3.selectAll("#flavor-wheel-container svg > g > *").remove();
        
        // Recreate the wheel with the full data
        createFlavorWheel(fullData);
        
        // Clear info panel
        clearInfoPanel();
    }

    // Function to display flavor details in the info panel
    function displayFlavorDetails(flavorId, node) {
        // Find the flavor in the data
        const flavor = node.data;
        
        // Update the flavor name
        selectedFlavorName.textContent = flavor.name;
        
        // Find category by traversing up the hierarchy
        let category = node.parent;
        while (category && category.depth > 1) {
            category = category.parent;
        }
        
        flavorCategory.textContent = category ? category.data.name : '-';
        
        // Get intensity
        flavorIntensity.textContent = flavorWheelData.flavorIntensity[flavorId] || '-';
        
        // Find which tea types this flavor appears in
        const teaTypesWithFlavor = Object.entries(flavorWheelData.teaTypeToFlavors)
            .filter(([_, flavors]) => flavors.includes(flavorId))
            .map(([teaType, _]) => {
                // Format tea type name
                return teaType.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase());
            });
        
        flavorTeaTypes.textContent = teaTypesWithFlavor.length > 0 ? 
            teaTypesWithFlavor.join(', ') : 'Not specifically associated';
        
        // Update complementary flavors
        complementaryList.innerHTML = '';
        const complementaryFlavors = flavorWheelData.flavorRelationships.complementary[flavorId] || [];
        complementaryFlavors.forEach(compId => {
            const li = document.createElement('li');
            // Find the flavor name from the wheel data
            const flavorName = findFlavorNameById(compId);
            li.textContent = flavorName;
            li.setAttribute('data-id', compId);
            li.addEventListener('click', () => {
                // Find the node in the visualization
                const node = findNodeById(root, compId);
                if (node) {
                    displayFlavorDetails(compId, node);
                }
            });
            complementaryList.appendChild(li);
        });
        
        // Update contrasting flavors
        contrastingList.innerHTML = '';
        const contrastingFlavors = flavorWheelData.flavorRelationships.contrasting[flavorId] || [];
        contrastingFlavors.forEach(contrastId => {
            const li = document.createElement('li');
            const flavorName = findFlavorNameById(contrastId);
            li.textContent = flavorName;
            li.setAttribute('data-id', contrastId);
            li.addEventListener('click', () => {
                const node = findNodeById(root, contrastId);
                if (node) {
                    displayFlavorDetails(contrastId, node);
                }
            });
            contrastingList.appendChild(li);
        });

        // Highlight this flavor in the wheel
        highlightFlavorInWheel(flavorId);
    }

    // Function to display category overview
    function displayCategoryOverview(categoryNode) {
        // Update the flavor name to show category
        selectedFlavorName.textContent = categoryNode.data.name + ' (Category)';
        
        // Update category
        flavorCategory.textContent = categoryNode.data.name;
        
        // Clear other details
        flavorIntensity.textContent = '-';
        flavorTeaTypes.textContent = '-';
        
        // Clear lists
        complementaryList.innerHTML = '';
        contrastingList.innerHTML = '';
        
        // Find all flavors in this category
        const flavorsInCategory = [];
        categoryNode.descendants().forEach(node => {
            if (node.data.id) {
                flavorsInCategory.push({
                    id: node.data.id,
                    name: node.data.name
                });
            }
        });
        
        // Display all flavors in this category as "complementary"
        flavorsInCategory.forEach(flavor => {
            const li = document.createElement('li');
            li.textContent = flavor.name;
            li.setAttribute('data-id', flavor.id);
            li.addEventListener('click', () => {
                const node = findNodeById(root, flavor.id);
                if (node) {
                    displayFlavorDetails(flavor.id, node);
                }
            });
            complementaryList.appendChild(li);
        });
        
        // Highlight this category in the wheel
        highlightCategoryInWheel(categoryNode);
    }

    // Function to highlight a flavor in the wheel
    function highlightFlavorInWheel(flavorId) {
        svg.selectAll('path')
            .classed('dim', true);
        
        // Find and highlight the specific flavor
        const flavorNode = svg.selectAll('path')
            .filter(d => d.data.id === flavorId);
        
        flavorNode
            .classed('dim', false)
            .classed('highlight', true);
        
        // Also highlight the path to root
        let currentNode = findNodeById(root, flavorId);
        while (currentNode && currentNode.parent) {
            const parentPath = svg.selectAll('path')
                .filter(d => d === currentNode.parent);
                
            parentPath
                .classed('dim', false);
                
            currentNode = currentNode.parent;
        }
    }

    // Function to highlight a category in the wheel
    function highlightCategoryInWheel(categoryNode) {
        svg.selectAll('path')
            .classed('dim', true);
        
        // Highlight the category and all its children
        svg.selectAll('path')
            .filter(d => isDescendantOf(d, categoryNode) || d === categoryNode)
            .classed('dim', false);
        
        // Highlight the category itself
        svg.selectAll('path')
            .filter(d => d === categoryNode)
            .classed('highlight', true);
    }

    // Helper to check if a node is a descendant of another
    function isDescendantOf(node, potentialAncestor) {
        let current = node;
        while (current && current.parent) {
            if (current.parent === potentialAncestor) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }

    // Helper to find a flavor name by ID
    function findFlavorNameById(id) {
        // Recursive function to search the wheel data
        function searchWheel(node) {
            if (node.id === id) {
                return node.name;
            }
            
            if (node.children) {
                for (let child of node.children) {
                    const result = searchWheel(child);
                    if (result) return result;
                }
            }
            
            return null;
        }
        
        const result = searchWheel(flavorWheelData.wheel);
        return result || id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Helper to find a node by ID
    function findNodeById(root, id) {
        // Check if this node has the ID
        if (root.data.id === id) {
            return root;
        }
        
        // Check children
        if (root.children) {
            for (let child of root.children) {
                const result = findNodeById(child, id);
                if (result) return result;
            }
        }
        
        return null;
    }

    // Function to filter the wheel based on selected tea type
    function filterWheelByTeaType(teaType) {
        if (teaType === 'all') {
            // Show the full wheel
            renderWheel();
            return;
        }
        
        // Get flavors for this tea type
        const relevantFlavorIds = flavorWheelData.teaTypeToFlavors[teaType] || [];
        
        // Create a deep copy of the data structure
        const filteredData = JSON.parse(JSON.stringify(flavorWheelData.wheel));
        
        // Filter out flavors not relevant to this tea type
        function filterChildren(node) {
            if (!node.children) return false;
            
            node.children = node.children.filter(child => {
                if (child.children) {
                    return filterChildren(child);
                }
                return relevantFlavorIds.includes(child.id);
            });
            
            return node.children.length > 0;
        }
        
        filterChildren(filteredData);
        
        // Create a new hierarchy and render
        const filteredRoot = d3.hierarchy(filteredData)
            .sum(d => d.children ? 0 : 1)
            .sort((a, b) => b.value - a.value);
        
        partition(filteredRoot);
        renderWheel(filteredRoot);
    }

    // Function to search for a flavor
    function searchFlavor(searchTerm) {
        if (!searchTerm) {
            // If search is empty, just render the full wheel
            renderWheel();
            return;
        }
        
        searchTerm = searchTerm.toLowerCase();
        
        // Find all flavors that match the search term
        function findMatchingFlavors(node, matches = []) {
            if (node.data.name.toLowerCase().includes(searchTerm)) {
                matches.push(node);
            }
            
            if (node.children) {
                node.children.forEach(child => {
                    findMatchingFlavors(child, matches);
                });
            }
            
            return matches;
        }
        
        const matches = findMatchingFlavors(root);
        
        if (matches.length > 0) {
            // Highlight matching flavors
            svg.selectAll('path')
                .classed('dim', true);
                
            matches.forEach(match => {
                // Highlight this node
                svg.selectAll('path')
                    .filter(d => d === match)
                    .classed('dim', false)
                    .classed('highlight', true);
                
                // Highlight path to root
                let currentNode = match;
                while (currentNode && currentNode.parent) {
                    const parentPath = svg.selectAll('path')
                        .filter(d => d === currentNode.parent);
                    
                    parentPath.classed('dim', false);
                    
                    currentNode = currentNode.parent;
                }
            });
            
            // If only one match, show its details
            if (matches.length === 1 && matches[0].data.id) {
                displayFlavorDetails(matches[0].data.id, matches[0]);
            }
        } else {
            // If no matches, render the whole wheel again
            renderWheel();
        }
    }

    // Event listeners
    teaTypeSelect.addEventListener('change', function() {
        filterWheelByTeaType(this.value);
    });
    
    searchButton.addEventListener('click', function() {
        searchFlavor(flavorSearch.value);
    });
    
    flavorSearch.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchFlavor(this.value);
        }
    });

    // Initial render
    renderWheel();
}); 