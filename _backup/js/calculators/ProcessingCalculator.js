// ProcessingCalculator.js
// Handles analysis of processing methods and their impact on tea characteristics.

import { BaseCalculator } from './BaseCalculator.js';
// Assuming your revised reference data is here:
import { processingInfluences } from '../descriptors/ProcessingInfluences.js'; // Or '../props/...'

// Helper function to get data for a specific processing method
function getMethodData(methodName) {
    const influences = processingInfluences; // Use imported reference data
    const normalizedMethod = methodName.toLowerCase().trim();

    // Direct match
    if (influences[normalizedMethod]) {
        return influences[normalizedMethod];
    }

    // Partial match (e.g., "heavy-roast" might be in "charcoal-heavy-roast")
    // More robust matching logic might be needed depending on reference data keys
    for (const key in influences) {
        if (key.includes(normalizedMethod) || normalizedMethod.includes(key)) {
            // console.log(`ProcessingCalculator: Partial match found for '${methodName}' -> '${key}'`);
            return influences[key];
        }
    }
    return null; // No match found
}

// Helper to determine standardized roast level from methods array
function determineRoastLevel(methods) {
    if (!Array.isArray(methods)) return "Unknown";
    const methodStr = methods.join(' ').toLowerCase();
    if (methodStr.includes('charcoal')) return "Charcoal";
    if (methodStr.includes('heavy-roast')) return "Heavy";
    if (methodStr.includes('medium-roast')) return "Medium";
    if (methodStr.includes('light-roast')) return "Light";
    if (methodStr.includes('minimal-roast')) return "Minimal";
    if (methodStr.includes('roast')) return "Unknown Roast"; // Generic roast mentioned
    return "None"; // No explicit roasting method found
}


export class ProcessingCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        // Reference data is now imported directly
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        const processingInput = tea?.processing || {}; // Check new structure first
        const processingMethods = Array.isArray(processingInput.methods) ? processingInput.methods : (Array.isArray(tea?.processingMethods) ? tea.processingMethods : []);
        const oxidationLevel = typeof processingInput.oxidationLevel === 'number' ? processingInput.oxidationLevel : (typeof tea?.oxidationLevel === 'number' ? tea.oxidationLevel : -1); // Use -1 to indicate unknown/not applicable

        if (processingMethods.length === 0 && oxidationLevel < 0) {
            return {
                description: 'No processing data available.',
                appliedMethods: [],
                oxidationLevel: -1,
                roastLevel: "Unknown",
                analysis: {}
            };
        }

        const appliedMethods = processingMethods;
        const roastLevel = determineRoastLevel(appliedMethods);

        // --- Aggregate analysis from reference data based on applied methods ---
        const analysis = {
            flavorImpact: [],
            bodyImpact: "Unchanged", // Default
            energeticTendency: "neutral", // Default
            alertnessImpactModifier: "neutral", // Default
            compoundImpactNotes: []
        };

        let energeticSum = 0; // To calculate average tendency
        let energeticCount = 0;

        appliedMethods.forEach(method => {
            const methodData = getMethodData(method);
            if (methodData) {
                // Aggregate flavor impacts (avoid duplicates)
                if (Array.isArray(methodData.flavorImpact)) {
                    methodData.flavorImpact.forEach(impact => {
                        if (!analysis.flavorImpact.includes(impact)) {
                            analysis.flavorImpact.push(impact);
                        }
                    });
                }
                // Aggregate body impact (last one wins or use specific logic)
                if (methodData.bodyImpact) {
                    analysis.bodyImpact = methodData.bodyImpact;
                }
                // Aggregate energetic tendency (average or dominant?) - let's average
                if (methodData.energeticTendency) {
                    const tendencyValue = { cooling: -1, neutral: 0, warming: 1 }[methodData.energeticTendency] || 0;
                    energeticSum += tendencyValue;
                    energeticCount++;
                }
                 // Aggregate alertness modifier (last one wins or specific logic)
                if (methodData.alertnessImpactModifier) {
                    analysis.alertnessImpactModifier = methodData.alertnessImpactModifier;
                }
                // Aggregate compound notes
                 if (Array.isArray(methodData.compoundImpactNotes)) {
                    methodData.compoundImpactNotes.forEach(note => {
                        if (!analysis.compoundImpactNotes.includes(note)) {
                            analysis.compoundImpactNotes.push(note);
                        }
                    });
                }
            }
        });

        // Determine final energetic tendency based on average
        if (energeticCount > 0) {
            const avgTendency = energeticSum / energeticCount;
            if (avgTendency > 0.5) analysis.energeticTendency = "warming";
            else if (avgTendency < -0.5) analysis.energeticTendency = "cooling";
            else analysis.energeticTendency = "neutral";
        }

        // Consider oxidation level for energetic tendency (simple override for now)
        if (oxidationLevel >= 70) analysis.energeticTendency = "warming";
        else if (oxidationLevel >= 0 && oxidationLevel < 15) analysis.energeticTendency = "cooling";

        // --- Generate Description ---
        const description = this.generateProcessingDescription(appliedMethods, oxidationLevel, roastLevel, analysis, tea?.type);

        return {
            description,
            appliedMethods,
            oxidationLevel, // Keep raw level
            roastLevel, // Determined roast level
            analysis // The object holding specific impacts
        };
    }

    // Generate a description based on methods and impacts
    generateProcessingDescription(methods, oxidation, roast, analysis, teaType) {
        let desc = `This ${teaType || 'tea'} underwent processing including: ${methods.join(', ') || 'unspecified methods'}. `;
        if (oxidation >= 0) {
             desc += `It has an oxidation level of approximately ${oxidation}%. `;
        }
        if (roast !== "None" && roast !== "Unknown Roast") {
             desc += `It includes a ${roast.toLowerCase()} roast. `;
        } else if (roast === "Unknown Roast") {
             desc += `It involves some roasting. `;
        }

        desc += "These processes typically result in ";
        if (analysis.flavorImpact.length > 0) {
            desc += `flavor impacts such as [${analysis.flavorImpact.join('; ')}], `;
        }
        if (analysis.bodyImpact !== "Unchanged") {
            desc += `a ${analysis.bodyImpact.toLowerCase()} body, `;
        }
        if (analysis.energeticTendency !== "neutral") {
            desc += `and a generally '${analysis.energeticTendency}' energetic tendency. `;
        } else {
             desc += `a relatively neutral energetic tendency. `;
        }
         if (analysis.alertnessImpactModifier !== "neutral") {
             desc += `The way energy is perceived might be affected, often described as '${analysis.alertnessImpactModifier}'.`;
         }

        return desc.trim();
    }


    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || (inference.appliedMethods.length === 0 && inference.oxidationLevel < 0)) {
            return '## Processing Analysis\n\nNo processing data available.';
        }

        let md = '## Processing Analysis\n\n';

        // Add description
        md += `${inference.description}\n\n`;

        // Add Processing Details section
        md += '### Processing Details\n';
        md += `- **Applied Methods:** ${inference.appliedMethods.join(', ') || 'None specified'}\n`;
        if (inference.oxidationLevel >= 0) {
            md += `- **Oxidation Level:** ${inference.oxidationLevel}%\n`;
        }
         if (inference.roastLevel !== "Unknown") {
             md += `- **Determined Roast Level:** ${inference.roastLevel}\n`;
         }


        // Add Processing Impact Analysis section
        md += `\n### Processing Impact Analysis\n`;
        const { analysis } = inference;
        if (analysis && Object.values(analysis).some(v => (Array.isArray(v) ? v.length > 0 : v !== null && v !== "neutral" && v !== "Unchanged"))) {
             if(analysis.flavorImpact?.length > 0) md += `- **Flavor Impact:** ${analysis.flavorImpact.join(', ')}\n`;
             if(analysis.bodyImpact && analysis.bodyImpact !== "Unchanged") md += `- **Body Impact:** ${analysis.bodyImpact}\n`;
             if(analysis.energeticTendency && analysis.energeticTendency !== "neutral") md += `- **Energetic Tendency:** ${analysis.energeticTendency}\n`;
             if(analysis.alertnessImpactModifier && analysis.alertnessImpactModifier !== "neutral") md += `- **Alertness Impact Modifier:** ${analysis.alertnessImpactModifier}\n`;
             if(analysis.compoundImpactNotes?.length > 0) md += `- **Potential Compound Impact Notes:** ${analysis.compoundImpactNotes.join(', ')}\n`;
        } else {
             md += 'No specific processing impacts identified from reference data.\n';
        }

        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        const description = inference?.description || 'No processing data available.';
        const appliedMethods = inference?.appliedMethods || [];
        const oxidationLevel = inference?.oxidationLevel ?? -1;
        const roastLevel = inference?.roastLevel || "Unknown";
        const analysis = inference?.analysis || {};

        if (appliedMethods.length === 0 && oxidationLevel < 0) {
             return {
                 processing: {
                     description: description,
                     appliedMethods: [],
                     oxidationLevel: -1,
                     roastLevel: "Unknown",
                     analysis: {},
                     _sectionRef: "processing"
                 }
             };
        }

        return {
             processing: { // Keep consistent top-level key
                description: description,
                appliedMethods: appliedMethods,
                oxidationLevel: oxidationLevel,
                roastLevel: roastLevel,
                analysis: analysis, // Serialize the new analysis object
                _sectionRef: "processing" // Keep if you use references
            }
        };
    }
}