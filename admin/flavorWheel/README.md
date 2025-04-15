# Tea Flavor Wheel Experiment

## Overview

This project implements an interactive tea flavor wheel visualization to explore and experiment with a new representation of tea flavors. The goal is to create a more intuitive and comprehensive way to categorize and describe the complex flavor profiles found in different types of tea.

## Features

- **Interactive Visualization**: A circular wheel visualization of tea flavor categories and specific flavors
- **Tea Type Filtering**: Filter the flavor wheel to show only flavors commonly found in specific types of tea (white, green, oolong, black, etc.)
- **Search Functionality**: Search for specific flavors to quickly locate them on the wheel
- **Detailed Information**: View detailed information about each flavor, including:
  - The flavor category
  - Intensity description (e.g., "Delicate", "Strong", "Aromatic")
  - Which tea types commonly exhibit this flavor
- **Complementary & Contrasting Flavors**: For each flavor, see suggestions of complementary flavors that enhance it and contrasting flavors that create interesting combinations
- **Responsive Design**: Works on both desktop and mobile devices

## Data Structure

The flavor wheel is based on a comprehensive JSON structure that organizes flavors into hierarchical categories:

1. **Main Flavor Categories**:
   - Floral
   - Milky
   - Nutty
   - Sweet
   - Spicy
   - Fire/Animal
   - Fruit (with subcategories: Berry, Citrus, Vine, Stone, Tropical)
   - Herbs
   - Vegetables
   - Grass
   - Wood
   - Forest
   - Earth
   - Mineral
   - Marine

2. **Specific Flavors**: Individual flavor entries within each category, such as "Jasmine" in the Floral category or "Cinnamon" in the Spicy category.

3. **Additional Data**:
   - Flavor intensities (e.g., "Delicate", "Strong", "Aromatic")
   - Mapping of flavors to tea types
   - Relationships between flavors (complementary and contrasting pairs)

## Usage

1. **Browse the Wheel**: Click on different sections of the wheel to explore flavor categories and specific flavors.
2. **Filter by Tea Type**: Use the dropdown to filter flavors by tea type (e.g., White, Green, Oolong).
3. **Search for Flavors**: Use the search box to find specific flavors.
4. **View Flavor Details**: Click on a flavor to see detailed information, including which tea types commonly exhibit this flavor.
5. **Explore Related Flavors**: From a flavor's detail view, click on complementary or contrasting flavors to navigate to those flavors.

## Implementation Details

The flavor wheel is implemented using:
- **D3.js**: For the interactive visualization
- **Vanilla JavaScript**: For the application logic
- **CSS3**: For styling and responsive design

The visualization uses a sunburst chart pattern to represent the hierarchical nature of flavor categories and specific flavors.

## Experimental Status

This flavor wheel is currently in an experimental phase. The goal is to test this representation with real tea tasting sessions to validate:

1. Whether the categorization is accurate and comprehensive
2. If the visualization helps in identifying and describing tea flavors
3. How well the intensity descriptors match real-world perceptions
4. The accuracy of the flavor relationships (complementary and contrasting pairs)

If the experiment proves successful, the flavor system may be integrated into the main Tea Details Recorder application.

## Future Enhancements

- Integration with actual tea tasting data
- Ability to add custom flavors to the wheel
- Flavor "heat maps" showing flavor distributions across different tea regions
- Seasonal flavor variations
- Aging effects on flavor profiles 