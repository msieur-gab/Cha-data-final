// FlavorCalculator.js
// Handles analysis of the tea's flavor profile and associated hints.

import { BaseCalculator } from './BaseCalculator.js';
// Assuming your revised reference data is here:
import { flavorInfluences } from '../descriptors/FlavorInfluences.js'; // Or '../props/...'

// Helper function to get data for a specific flavor note
function getFlavorData(flavorName) {
    const influences = flavorInfluences; // Use imported reference data
    if (!influences || typeof influences !== 'object') return null;

    const normalizedFlavor = flavorName.toLowerCase().trim();

    // Iterate through categories and subcategories (flavor notes)
    for (const categoryKey in influences) {
        const category = influences[categoryKey];
        if (category && typeof category === 'object') {
            for (const subCategoryKey in category) {
                // Check if the subCategoryKey itself matches (e.g., 'jasmine' in 'floral')
                if (subCategoryKey === normalizedFlavor) {
                    return category[subCategoryKey];
                }
                // Check if the flavor is listed within an 'associatedFlavors' or 'flavors' array
                const flavorList = category[subCategoryKey]?.associatedFlavors || category[subCategoryKey]?.flavors;
                if (Array.isArray(flavorList) && flavorList.includes(normalizedFlavor)) {
                     return category[subCategoryKey];
                }
            }
        }
    }
    // Fallback: check if the normalized flavor is a direct key in any category
    for (const categoryKey in influences) {
         if(influences[categoryKey]?.[normalizedFlavor]) {
             return influences[categoryKey][normalizedFlavor];
         }
    }


    // console.warn(`FlavorCalculator: No reference data found for flavor '${normalizedFlavor}'`);
    return null; // No match found
}

// Helper function to estimate intensity
function estimateFlavorIntensity(flavorProfile) {
    const count = Array.isArray(flavorProfile) ? flavorProfile.length : 0;
    if (count === 0) return "N/A";
    if (count <= 2) return "Subtle";
    if (count <= 4) return "Moderate";
    return "Pronounced";
}

// Helper function to get dominant categories (simplified)
function getDominantFlavorCategories(flavorProfile) {
    const categories = new Set();
    if (!Array.isArray(flavorProfile)) return [];

    flavorProfile.forEach(flavor => {
        const normalizedFlavor = flavor.toLowerCase().trim();
        // Basic categorization (improve with reference data lookup if needed)
        if (['jasmine', 'rose', 'orchid', 'lilac', 'osmanthus', 'honeysuckle', 'floral'].includes(normalizedFlavor)) categories.add("Floral");
        else if (['apple', 'pear', 'peach', 'apricot', 'citrus', 'berry', 'tropical', 'stone_fruit', 'fruity'].includes(normalizedFlavor)) categories.add("Fruity");
        else if (['spinach', 'kale', 'grass', 'vegetal', 'leafy', 'broccoli', 'cabbage'].includes(normalizedFlavor)) categories.add("Vegetal");
        else if (['almond', 'hazelnut', 'walnut', 'nutty', 'toasted', 'grainy'].includes(normalizedFlavor)) categories.add("Nutty/Toasty");
        else if (['pepper', 'ginger', 'cinnamon', 'spicy'].includes(normalizedFlavor)) categories.add("Spicy");
        else if (['honey', 'caramel', 'sweet', 'vanilla', 'chocolate', 'malt'].includes(normalizedFlavor)) categories.add("Sweet");
        else if (['earthy', 'mineral', 'wet stone', 'petrichor'].includes(normalizedFlavor)) categories.add("Earthy/Mineral");
        else if (['wood', 'cedar', 'pine', 'woody'].includes(normalizedFlavor)) categories.add("Woody");
        else if (['roasted', 'smoky', 'coffee'].includes(normalizedFlavor)) categories.add("Roasted");
        else if (['umami', 'marine', 'seaweed', 'savory'].includes(normalizedFlavor)) categories.add("Umami/Marine");
        else if (['aged', 'leather', 'compost'].includes(normalizedFlavor)) categories.add("Aged/Earthy");
    });
    return Array.from(categories);
}


export class FlavorCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        // Reference data is imported
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        // Ensure flavorProfile is an array of strings
        let flavorProfileInput = tea?.flavorProfile || tea?.flavor?.primary || [];
        if (!Array.isArray(flavorProfileInput)) {
            flavorProfileInput = [];
        }
        const identifiedFlavors = flavorProfileInput.filter(f => typeof f === 'string');

        if (identifiedFlavors.length === 0) {
            return {
                description: 'No flavor profile available.',
                identifiedFlavors: [],
                dominantFlavors: [],
                dominantFlavorCategories: [],
                intensityEstimate: "N/A",
                analysis: { foodPairingHints: [], seasonalAffinityHints: [], activityHints: [] }
            };
        }

        const dominantFlavors = this.getDominantFlavors(identifiedFlavors); // Keep existing helper is fine
        const dominantFlavorCategories = getDominantFlavorCategories(identifiedFlavors);
        const intensityEstimate = estimateFlavorIntensity(identifiedFlavors);

        // --- Aggregate analysis hints from reference data ---
        const analysis = {
            foodPairingHints: new Set(),
            seasonalAffinityHints: new Set(),
            activityHints: new Set()
        };

        identifiedFlavors.forEach(flavor => {
            const flavorData = getFlavorData(flavor);
            if (flavorData) {
                if (Array.isArray(flavorData.foodPairingHints)) {
                    flavorData.foodPairingHints.forEach(hint => analysis.foodPairingHints.add(hint));
                }
                if (Array.isArray(flavorData.seasonalAffinityHints)) {
                     flavorData.seasonalAffinityHints.forEach(hint => analysis.seasonalAffinityHints.add(hint));
                }
                 if (Array.isArray(flavorData.activityHints)) {
                     flavorData.activityHints.forEach(hint => analysis.activityHints.add(hint));
                 }
            }
        });

        // Convert sets back to arrays
        const finalAnalysis = {
            foodPairingHints: Array.from(analysis.foodPairingHints),
            seasonalAffinityHints: Array.from(analysis.seasonalAffinityHints),
            activityHints: Array.from(analysis.activityHints)
        };

        // --- Generate Description ---
        const description = this.generateFlavorDescription(identifiedFlavors, dominantFlavors, dominantFlavorCategories, intensityEstimate);

        return {
            description,
            identifiedFlavors, // Raw input list
            dominantFlavors, // Top 3-5 prominent
            dominantFlavorCategories, // Broad categories present
            intensityEstimate, // Overall strength/complexity sense
            analysis: finalAnalysis // Aggregated hints
        };
    }

    // Generate a description based on flavor analysis
    generateFlavorDescription(flavors, dominant, categories, intensity) {
        let desc = `The flavor profile is perceived as '${intensity.toLowerCase()}'. `;
        if (dominant.length > 0) {
            desc += `Dominant notes include ${dominant.join(', ')}. `;
        }
        if (categories.length > 0) {
             desc += `Overall, it falls into the following flavor categories: ${categories.join(', ')}. `;
        }
         desc += `Contains ${flavors.length} distinct flavor notes provided.`;
        return desc;
    }

    // Keep this helper or similar logic
    getDominantFlavors(flavorProfile, limit = 3) {
        if (!flavorProfile || !Array.isArray(flavorProfile) || flavorProfile.length === 0) {
          return [];
        }
        // Simple approach: return the first 'limit' flavors assuming they are listed in order of prominence
        // More complex: count frequencies if duplicates are possible and meaningful
        return flavorProfile.slice(0, limit);
    }


    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || inference.identifiedFlavors?.length === 0) {
            return '## Flavor Analysis\n\nNo flavor profile available.';
        }

        let md = '## Flavor Analysis\n\n';
        md += `${inference.description}\n\n`;

        md += `### Flavor Details\n`;
        md += `- **Identified Notes:** ${inference.identifiedFlavors.join(', ')}\n`;
        md += `- **Dominant Notes:** ${inference.dominantFlavors.join(', ')}\n`;
        md += `- **Dominant Categories:** ${inference.dominantFlavorCategories.join(', ')}\n`;
        md += `- **Estimated Intensity:** ${inference.intensityEstimate}\n`;

        md += `\n### Flavor Profile Associations (Hints)\n`;
        const { analysis } = inference;
        if (analysis && (analysis.foodPairingHints?.length > 0 || analysis.seasonalAffinityHints?.length > 0 || analysis.activityHints?.length > 0)) {
            if(analysis.foodPairingHints?.length > 0) md += `- **Potential Food Pairings:** ${analysis.foodPairingHints.join(', ')}\n`;
            if(analysis.seasonalAffinityHints?.length > 0) md += `- **Seasonal Affinity:** ${analysis.seasonalAffinityHints.join(', ')}\n`;
            if(analysis.activityHints?.length > 0) md += `- **Potential Activity Associations:** ${analysis.activityHints.join(', ')}\n`;
        } else {
            md += 'No specific associations identified from reference data for the provided flavors.\n';
        }

        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        const description = inference?.description || 'No flavor profile available.';
        const identifiedFlavors = inference?.identifiedFlavors || [];
        const dominantFlavors = inference?.dominantFlavors || [];
        const dominantFlavorCategories = inference?.dominantFlavorCategories || [];
        const intensityEstimate = inference?.intensityEstimate || "N/A";
        const analysis = inference?.analysis || { foodPairingHints: [], seasonalAffinityHints: [], activityHints: [] };

        if (identifiedFlavors.length === 0) {
             return {
                 flavor: {
                     description: description,
                     profile: { identified: [], dominant: [], categories: [], intensity: intensityEstimate },
                     analysis: analysis,
                     _sectionRef: "flavor"
                 }
             };
        }

        return {
             flavor: { // Keep consistent top-level key
                description: description,
                profile: { // Group profile details
                    identified: identifiedFlavors,
                    dominant: dominantFlavors,
                    categories: dominantFlavorCategories,
                    intensity: intensityEstimate
                },
                analysis: analysis, // Serialize the new analysis object with hints
                _sectionRef: "flavor" // Keep if you use references
            }
        };
    }
}