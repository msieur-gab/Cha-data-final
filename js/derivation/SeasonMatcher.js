// SeasonMatcher.js
// Matches a tea's profile to the most suitable season(s) for consumption.

export class SeasonMatcher {
    constructor(config = {}) {
        // Configuration options could be added (e.g., weighting factors)
        this.config = config;
        this.seasons = ["Spring", "Summer", "Autumn", "Winter"];
    }

    /**
     * Matches the tea's profile to suitable seasons.
     * @param {object} geographyAnalysis - The 'season' and 'climate' objects from GeographyCalculator's output.
     * Expected: harvestSeason, seasonalFlavorProfile, seasonalQualityIndicator, climate.temperatureCategory (optional).
     * @param {object} processingAnalysis - The 'analysis' object from ProcessingCalculator's output.
     * Expected: energeticTendency, flavorImpact (optional).
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator's output.
     * Expected: seasonalTendency, dominantFlavorCategories.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator's output.
     * Expected: seasonalAffinityHints, dominantFlavorCategories.
     * @returns {Array<string>} - An array of recommended seasons, potentially ordered by suitability.
     */
    matchSeason(geographyAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}, flavorAnalysis = {}) {

        const seasonScores = {
            "Spring": 0,
            "Summer": 0,
            "Autumn": 0,
            "Winter": 0
        };

        // --- Inputs ---
        // Geography/Season Info
        const { harvestSeason = "Unknown", seasonalFlavorProfile = "", qualityIndicator = "Standard" } = geographyAnalysis.season || {};
        // const { temperatureCategory = "Moderate" } = geographyAnalysis.climate || {}; // Optional: Use climate info

        // Processing Info
        const { energeticTendency: processingThermalEffect = "neutral" } = processingAnalysis; // e.g., "warming", "cooling"

        // Tea Type Info
        const { seasonalTendency: typeSeasonalTendency = "neutral" } = teaTypeAnalysis; // e.g., "warming", "cooling"

        // Flavor Info
        const { seasonalAffinityHints: flavorSeasonHints = [] } = flavorAnalysis;

        // --- Scoring Logic ---

        // 1. Baseline from Tea Type Tendency
        if (typeSeasonalTendency === "warming") {
            seasonScores["Autumn"] += 3;
            seasonScores["Winter"] += 4;
            seasonScores["Spring"] -= 1;
            seasonScores["Summer"] -= 2;
        } else if (typeSeasonalTendency === "cooling") {
            seasonScores["Spring"] += 3;
            seasonScores["Summer"] += 4;
            seasonScores["Autumn"] -= 1;
            seasonScores["Winter"] -= 2;
        }

        // 2. Modification from Processing Thermal Effect
        if (processingThermalEffect === "warming" || processingThermalEffect === "very warming") {
            seasonScores["Autumn"] += 2;
            seasonScores["Winter"] += 3;
            seasonScores["Summer"] -= 1;
        } else if (processingThermalEffect === "cooling") {
            seasonScores["Spring"] += 2;
            seasonScores["Summer"] += 3;
            seasonScores["Winter"] -= 1;
        }

        // 3. Hints from Flavors
        flavorSeasonHints.forEach(hint => {
            if (seasonScores.hasOwnProperty(hint)) {
                seasonScores[hint] += 2; // Increased score per hint
            }
            // Could add logic for broader terms like "Warm Weather" -> Summer, "Cool Weather" -> Autumn/Winter
        });

        // 4. Consider Harvest Season (Freshness aspect)
        // Teas are often best closer to their harvest, especially greens/whites/light oolongs
        // This logic gives a boost to the harvest season itself and adjacent ones.
        const seasonOrder = ["Early Spring", "Late Spring", "Summer", "Autumn", "Late Autumn", "Winter"]; // Ordered cycle
        const harvestIndex = seasonOrder.indexOf(harvestSeason);

        if (harvestIndex !== -1) {
            const currentSeasonName = seasonOrder[harvestIndex].replace(/Early |Late /,''); // Normalize to Spring, Summer etc.
            if(seasonScores[currentSeasonName] !== undefined) {
                 seasonScores[currentSeasonName] += 2; // Increased boost to harvest season
            }
            // Boost adjacent seasons slightly
            const prevSeasonIndex = (harvestIndex - 1 + seasonOrder.length) % seasonOrder.length;
            const nextSeasonIndex = (harvestIndex + 1) % seasonOrder.length;
            const prevSeasonName = seasonOrder[prevSeasonIndex].replace(/Early |Late /,'');
            const nextSeasonName = seasonOrder[nextSeasonIndex].replace(/Early |Late /,'');

            if(seasonScores[prevSeasonName] !== undefined) seasonScores[prevSeasonName] += 1;
            if(seasonScores[nextSeasonName] !== undefined) seasonScores[nextSeasonName] += 1;

            // Penalize opposite season slightly more if freshness matters (e.g., Spring harvest)
             if (harvestSeason.includes("Spring")) {
                 seasonScores["Autumn"] -= 1;
                 seasonScores["Winter"] -= 1;
             }
        }

        // 5. Consider Seasonal Flavor Profile (descriptive text from Geography/Season output)
        // Example: If profile includes "Robust, malty", boost Autumn/Winter
        if (seasonalFlavorProfile.includes("Robust") || seasonalFlavorProfile.includes("malty") || seasonalFlavorProfile.includes("deep")) {
            seasonScores["Autumn"] += 1;
            seasonScores["Winter"] += 1;
        }
        if (seasonalFlavorProfile.includes("Fresh") || seasonalFlavorProfile.includes("delicate") || seasonalFlavorProfile.includes("floral")) {
             seasonScores["Spring"] += 1;
             seasonScores["Summer"] += 1;
        }

        // --- Determine Recommended Seasons ---
        // Sort seasons by score, descending
        const sortedSeasons = Object.entries(seasonScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

        const maxScore = sortedSeasons[0] ? sortedSeasons[0][1] : 0;
        const threshold = 2.0; // Adjust threshold as needed (e.g., 2 points difference)

        // Include seasons with positive scores OR the top score if all are zero/negative
        let recommendedSeasons = sortedSeasons
            .filter(([season, score], index) => score > 0 || index === 0) // Keep top score even if <= 0
            .filter(([season, score]) => score >= maxScore - threshold) // Filter by threshold relative to max
            .map(([season]) => season);

        // Better Fallback: If filtering leaves nothing (unlikely now), use the top score
        if (recommendedSeasons.length === 0 && sortedSeasons.length > 0) {
            recommendedSeasons = [sortedSeasons[0][0]];
        }
        // Only default to "Anytime" if literally no scores were generated at all
        else if (recommendedSeasons.length === 0) {
            recommendedSeasons = ["Anytime"];
        }

        return recommendedSeasons;
    }

    // --- Optional: Add format/serialize methods ---
}

// Export the class
export default SeasonMatcher;