// SeasonMatcher.js
// Matches a tea's profile to the most suitable season(s) for consumption.
// Updated to identify continuous seasonal ranges

export class SeasonMatcher {
    constructor(config = {}) {
        // Configuration options
        this.config = {
            // Minimum score (0-100) required to be included in the ideal range
            rangeThreshold: config.rangeThreshold || 70,
            ...config
        };
        
        // Define seasons in their natural order for range identification
        this.seasons = [
            "Early Spring",
            "Spring", 
            "Late Spring",
            "Early Summer",
            "Summer", 
            "Late Summer",
            "Early Autumn",
            "Autumn", 
            "Late Autumn",
            "Early Winter",
            "Winter", 
            "Late Winter"
        ];
        
        // Simplified seasons (for legacy compatibility)
        this.simplifiedSeasons = ["Spring", "Summer", "Autumn", "Winter"];
    }

    /**
     * Matches the tea's profile to suitable seasons.
     * @param {object} geographyAnalysis - Analysis from GeographyCalculator
     * @param {object} processingAnalysis - Analysis from ProcessingCalculator
     * @param {object} teaTypeAnalysis - Analysis from TeaTypeCalculator
     * @param {object} flavorAnalysis - Analysis from FlavorCalculator
     * @returns {Object} Results containing recommended seasons and seasonal ranges
     */
    matchSeason(geographyAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}, flavorAnalysis = {}) {
        // --- Extract Relevant Inputs ---
        // Geography/Season Info
        const { harvestSeason = "Unknown", seasonalFlavorProfile = "", qualityIndicator = "Standard" } = geographyAnalysis.season || {};
        const { temperatureCategory = "Moderate" } = geographyAnalysis.climate || {};

        // Processing Info
        const { energeticTendency: processingThermalEffect = "neutral", roastLevel = "None" } = processingAnalysis; 

        // Tea Type Info
        const { seasonalTendency: typeSeasonalTendency = "neutral" } = teaTypeAnalysis; 

        // Flavor Info
        const { seasonalAffinityHints: flavorSeasonHints = [], dominantFlavorCategories = [] } = flavorAnalysis;

        // --- Initialize Season Scores ---
        const seasonScores = new Map();
        
        // Initialize all seasons with a base score
        this.seasons.forEach(season => {
            seasonScores.set(season, 50); // Base score of 50
        });

        // --- Apply Scoring Logic ---

        // 1. Base adjustment from Tea Type Tendency
        if (typeSeasonalTendency === "warming") {
            this.addSeasonScore(seasonScores, "Late Autumn", 20);
            this.addSeasonScore(seasonScores, "Winter", 30);
            this.addSeasonScore(seasonScores, "Early Winter", 25);
            this.addSeasonScore(seasonScores, "Late Winter", 20);
            this.addSeasonScore(seasonScores, "Spring", -10);
            this.addSeasonScore(seasonScores, "Summer", -15);
        } else if (typeSeasonalTendency === "cooling") {
            this.addSeasonScore(seasonScores, "Spring", 20);
            this.addSeasonScore(seasonScores, "Early Summer", 25);
            this.addSeasonScore(seasonScores, "Summer", 30);
            this.addSeasonScore(seasonScores, "Late Summer", 20);
            this.addSeasonScore(seasonScores, "Winter", -15);
        } else if (typeSeasonalTendency === "neutral-warming") {
            this.addSeasonScore(seasonScores, "Autumn", 15);
            this.addSeasonScore(seasonScores, "Early Winter", 10);
        } else if (typeSeasonalTendency === "neutral-cooling") {
            this.addSeasonScore(seasonScores, "Late Spring", 15);
            this.addSeasonScore(seasonScores, "Early Summer", 10);
        }

        // 2. Adjustment from Processing Thermal Effect
        if (processingThermalEffect === "warming" || processingThermalEffect === "very warming") {
            this.addSeasonScore(seasonScores, "Autumn", 15);
            this.addSeasonScore(seasonScores, "Winter", 25);
            this.addSeasonScore(seasonScores, "Late Winter", 15);
            this.addSeasonScore(seasonScores, "Summer", -10);
        } else if (processingThermalEffect === "cooling") {
            this.addSeasonScore(seasonScores, "Spring", 15);
            this.addSeasonScore(seasonScores, "Summer", 25);
            this.addSeasonScore(seasonScores, "Early Autumn", 10);
            this.addSeasonScore(seasonScores, "Winter", -10);
        }
        
        // Modification 2.1: Add roast level adjustments for seasonality
        if (roastLevel === "Heavy" || roastLevel === "Medium") {
            this.addSeasonScore(seasonScores, "Autumn", 25);
            this.addSeasonScore(seasonScores, "Late Autumn", 20);
            this.addSeasonScore(seasonScores, "Winter", 25);
            this.addSeasonScore(seasonScores, "Early Winter", 20);
            this.addSeasonScore(seasonScores, "Spring", -15);
            this.addSeasonScore(seasonScores, "Summer", -20);
        }
        
        // Modification 2.2: Add light oolong with floral flavors adjustments
        if ((roastLevel === "Minimal" || roastLevel === "Light" || roastLevel === "None") && 
            dominantFlavorCategories.includes("Floral")) {
            this.addSeasonScore(seasonScores, "Spring", 25);
            this.addSeasonScore(seasonScores, "Early Spring", 20);
            this.addSeasonScore(seasonScores, "Summer", 20);
            this.addSeasonScore(seasonScores, "Early Summer", 25);
            this.addSeasonScore(seasonScores, "Winter", -10);
        }

        // 3. Adjustment from Flavor Seasonal Hints
        flavorSeasonHints.forEach(hint => {
            // Handle direct season mentions
            this.seasons.forEach(season => {
                if (season.toLowerCase().includes(hint.toLowerCase())) {
                    this.addSeasonScore(seasonScores, season, 15);
                }
            });
            
            // Handle broader terms
            if (hint.toLowerCase().includes('warm weather')) {
                this.addSeasonScore(seasonScores, "Summer", 15);
                this.addSeasonScore(seasonScores, "Late Spring", 10);
                this.addSeasonScore(seasonScores, "Early Autumn", 10);
            } else if (hint.toLowerCase().includes('cool weather')) {
                this.addSeasonScore(seasonScores, "Autumn", 15);
                this.addSeasonScore(seasonScores, "Winter", 15);
                this.addSeasonScore(seasonScores, "Early Spring", 10);
            }
        });

        // 4. Consider Harvest Season (Freshness aspect)
        if (harvestSeason !== "Unknown") {
            // Boost the harvest season itself
            this.seasons.forEach(season => {
                if (season.toLowerCase().includes(harvestSeason.toLowerCase())) {
                    this.addSeasonScore(seasonScores, season, 20);
                }
            });
            
            // Boost adjacent seasons slightly
            const harvestIndex = this.findSeasonIndex(harvestSeason);
            if (harvestIndex !== -1) {
                const prevSeasonIndex = (harvestIndex - 1 + this.seasons.length) % this.seasons.length;
                const nextSeasonIndex = (harvestIndex + 1) % this.seasons.length;
                
                this.addSeasonScore(seasonScores, this.seasons[prevSeasonIndex], 10);
                this.addSeasonScore(seasonScores, this.seasons[nextSeasonIndex], 10);
            }
        }

        // 5. Consider Tea Flavor Profile against Seasonal Characteristics
        if (seasonalFlavorProfile) {
            const profile = seasonalFlavorProfile.toLowerCase();
            
            if (profile.includes('robust') || profile.includes('malty') || profile.includes('deep')) {
                this.addSeasonScore(seasonScores, "Autumn", 10);
                this.addSeasonScore(seasonScores, "Winter", 10);
            }
            if (profile.includes('fresh') || profile.includes('delicate') || profile.includes('floral')) {
                this.addSeasonScore(seasonScores, "Spring", 10);
                this.addSeasonScore(seasonScores, "Early Summer", 10);
            }
            if (profile.includes('bright') || profile.includes('fruity') || profile.includes('sweet')) {
                this.addSeasonScore(seasonScores, "Late Spring", 8);
                this.addSeasonScore(seasonScores, "Summer", 12);
            }
        }

        // --- Process Results ---
        const normalizedScores = this.normalizeSeasonScores(seasonScores);
        const recommendedSeasons = this.getRecommendedSeasons(normalizedScores);
        const seasonalRanges = this.identifySeasonalRanges(normalizedScores);

        // For legacy compatibility, also provide simplified season recommendations
        const simplifiedScores = this.generateSimplifiedScores(normalizedScores);
        const simplifiedRecommended = this.getSimplifiedRecommendations(simplifiedScores);

        return {
            recommendations: normalizedScores,
            recommendedSeasons,
            idealRanges: seasonalRanges,
            // For backwards compatibility
            simplified: {
                scores: simplifiedScores,
                recommended: simplifiedRecommended
            },
            // Direct recommended property for even better backwards compatibility
            recommended: simplifiedRecommended
        };
    }
    
    /**
     * Helper to add a score to a season
     * @param {Map} scoreMap - Map tracking season scores
     * @param {string} season - Season to adjust
     * @param {number} score - Score adjustment
     */
    addSeasonScore(scoreMap, season, score) {
        // Find the closest matching season name
        const matchedSeason = this.findClosestSeason(season);
        if (!matchedSeason) return;
        
        const currentScore = scoreMap.get(matchedSeason) || 50;
        scoreMap.set(matchedSeason, currentScore + score);
    }
    
    /**
     * Find the index of a season in the seasons array
     * @param {string} season - Season name to find
     * @returns {number} - Index of the season or -1 if not found
     */
    findSeasonIndex(season) {
        const normalizedSeason = season.toLowerCase();
        
        // Try exact match first
        const exactIndex = this.seasons.findIndex(s => 
            s.toLowerCase() === normalizedSeason);
        if (exactIndex !== -1) return exactIndex;
        
        // Try partial match
        const partialIndex = this.seasons.findIndex(s => 
            s.toLowerCase().includes(normalizedSeason) || 
            normalizedSeason.includes(s.toLowerCase()));
        
        return partialIndex;
    }
    
    /**
     * Find the closest matching season name
     * @param {string} season - Season name to match
     * @returns {string|null} - Matched season name or null
     */
    findClosestSeason(season) {
        const normalizedSeason = season.toLowerCase();
        
        // Try exact match first
        const exactMatch = this.seasons.find(s => 
            s.toLowerCase() === normalizedSeason);
        if (exactMatch) return exactMatch;
        
        // Try partial match
        const partialMatch = this.seasons.find(s => 
            s.toLowerCase().includes(normalizedSeason) || 
            normalizedSeason.includes(s.toLowerCase()));
        
        return partialMatch || null;
    }
    
    /**
     * Normalize the season scores to a 0-100 scale
     * @param {Map} seasonScores - Map of raw season scores
     * @returns {Object} - Object with season names as keys and normalized scores as values
     */
    normalizeSeasonScores(seasonScores) {
        const result = {};
        
        // Handle empty scores
        if (seasonScores.size === 0) {
            this.seasons.forEach(season => {
                result[season] = 50; // Default score
            });
            return result;
        }
        
        // Process each season's score
        for (const [season, score] of seasonScores.entries()) {
            // Cap scores between 0-100
            result[season] = Math.max(0, Math.min(100, score));
        }
        
        return result;
    }
    
    /**
     * Generate simplified scores for the four main seasons
     * @param {Object} detailedScores - Detailed season scores
     * @returns {Object} - Simplified scores for Spring, Summer, Autumn, Winter
     */
    generateSimplifiedScores(detailedScores) {
        const simplified = {
            "Spring": 0,
            "Summer": 0,
            "Autumn": 0,
            "Winter": 0
        };
        
        // Count how many sub-seasons we find for each main season
        const counts = { ...simplified };
        
        // Aggregate scores for each main season
        Object.entries(detailedScores).forEach(([season, score]) => {
            const seasonLower = season.toLowerCase();
            
            if (seasonLower.includes('spring')) {
                simplified["Spring"] += score;
                counts["Spring"]++;
            } else if (seasonLower.includes('summer')) {
                simplified["Summer"] += score;
                counts["Summer"]++;
            } else if (seasonLower.includes('autumn')) {
                simplified["Autumn"] += score;
                counts["Autumn"]++;
            } else if (seasonLower.includes('winter')) {
                simplified["Winter"] += score;
                counts["Winter"]++;
            }
        });
        
        // Calculate averages
        Object.keys(simplified).forEach(season => {
            if (counts[season] > 0) {
                simplified[season] = Math.round(simplified[season] / counts[season]);
            } else {
                simplified[season] = 50; // Default if no sub-seasons found
            }
        });
        
        return simplified;
    }
    
    /**
     * Get recommended seasons based on normalized scores
     * @param {Object} normalizedScores - Object with normalized season scores
     * @returns {Array} - Array of recommended season objects with name and score
     */
    getRecommendedSeasons(normalizedScores) {
        // Sort by score descending
        const sortedSeasons = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Get top seasons (within 10 points of maximum)
        if (sortedSeasons.length === 0) {
            return [{ name: "Any Season", score: 50 }];
        }
        
        const maxScore = sortedSeasons[0][1];
        const threshold = 10; // Seasons within 10 points of max score
        
        // Include seasons that are close to the maximum score
        return sortedSeasons
            .filter(([season, score]) => score >= maxScore - threshold)
            .map(([season, score]) => ({ name: season, score }));
    }
    
    /**
     * Get simplified season recommendations (for backward compatibility)
     * @param {Object} simplifiedScores - Simplified season scores
     * @returns {Array} - Array of recommended main season names
     */
    getSimplifiedRecommendations(simplifiedScores) {
        // Sort by score descending
        const sortedSeasons = Object.entries(simplifiedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Get top seasons (within 15 points of maximum)
        if (sortedSeasons.length === 0) {
            return ["Any Season"];
        }
        
        const maxScore = sortedSeasons[0][1];
        const threshold = 15; // More generous threshold for simplified
        
        // Return just the season names (no scores)
        return sortedSeasons
            .filter(([season, score]) => score >= maxScore - threshold)
            .map(([season]) => season);
    }
    
    /**
     * Identify continuous ranges of seasons suitable for tea consumption
     * @param {Object} normalizedScores - Object with normalized season scores
     * @returns {Array} - Array of seasonal range objects
     */
    identifySeasonalRanges(normalizedScores) {
        const ranges = [];
        const orderedSeasons = this.seasons.filter(season => 
            normalizedScores[season] !== undefined && 
            normalizedScores[season] >= this.config.rangeThreshold
        );
        
        if (orderedSeasons.length === 0) {
            return [];
        }
        
        // If only one season qualifies
        if (orderedSeasons.length === 1) {
            return [{
                start: orderedSeasons[0],
                end: orderedSeasons[0],
                score: normalizedScores[orderedSeasons[0]]
            }];
        }
        
        // Find continuous ranges
        let rangeStart = orderedSeasons[0];
        let currentRange = [rangeStart];
        let previousIndex = this.seasons.indexOf(rangeStart);
        
        for (let i = 1; i < orderedSeasons.length; i++) {
            const currentSeason = orderedSeasons[i];
            const currentIndex = this.seasons.indexOf(currentSeason);
            
            // Check if seasons are adjacent in the defined order
            // Note: We allow wrapping around (e.g., Winter -> Spring)
            const isAdjacent = currentIndex === previousIndex + 1 || 
                               (previousIndex === this.seasons.length - 1 && currentIndex === 0);
            
            if (isAdjacent) {
                // Continue current range
                currentRange.push(currentSeason);
            } else {
                // End current range and start new one
                const avgScore = this.calculateAverageScore(currentRange, normalizedScores);
                ranges.push({
                    start: currentRange[0],
                    end: currentRange[currentRange.length - 1],
                    score: avgScore
                });
                
                // Start new range
                rangeStart = currentSeason;
                currentRange = [rangeStart];
            }
            
            previousIndex = currentIndex;
        }
        
        // Add the last range if not empty
        if (currentRange.length > 0) {
            const avgScore = this.calculateAverageScore(currentRange, normalizedScores);
            ranges.push({
                start: currentRange[0],
                end: currentRange[currentRange.length - 1],
                score: avgScore
            });
        }
        
        // Special case: Check if there's a range that wraps around the year
        // (e.g., Late Autumn through Early Spring)
        this.checkForWraparoundRange(ranges, normalizedScores);
        
        return ranges;
    }
    
    /**
     * Check if there's a range that wraps around the year end
     * @param {Array} ranges - Existing identified ranges
     * @param {Object} normalizedScores - Object with normalized season scores
     */
    checkForWraparoundRange(ranges, normalizedScores) {
        if (ranges.length < 2) return;
        
        try {
            // Check if first range starts with Early Spring/Spring and 
            // last range ends with Late Autumn/Winter/Late Winter
            const firstRange = ranges[0];
            const lastRange = ranges[ranges.length - 1];
            
            // Safety check - ensure ranges have valid start/end properties
            if (!firstRange.start || !firstRange.end || !lastRange.start || !lastRange.end) return;
            
            const firstIsEarly = firstRange.start === "Early Spring" || firstRange.start === "Spring";
            const lastIsLate = lastRange.end === "Late Autumn" || lastRange.end === "Winter" || lastRange.end === "Late Winter";
            
            if (firstIsEarly && lastIsLate) {
                // Combine the first and last ranges into a wraparound range
                const combinedSeasons = [];
                
                // Safety checks for season indices
                const lastStartIdx = this.seasons.indexOf(lastRange.start);
                const lastEndIdx = this.seasons.indexOf(lastRange.end);
                const firstStartIdx = this.seasons.indexOf(firstRange.start);
                const firstEndIdx = this.seasons.indexOf(firstRange.end);
                
                // Verify that all season names exist in our seasons array
                if (lastStartIdx === -1 || lastEndIdx === -1 || firstStartIdx === -1 || firstEndIdx === -1) {
                    return; // Skip wraparound if any season isn't found
                }
                
                // Add seasons from the last range - with iteration limit for safety
                let idx = lastStartIdx;
                let safetyCounter = 0;
                const maxIterations = this.seasons.length * 2; // Should never need more iterations than this
                
                while (idx !== (lastEndIdx + 1) % this.seasons.length && safetyCounter < maxIterations) {
                    combinedSeasons.push(this.seasons[idx]);
                    idx = (idx + 1) % this.seasons.length;
                    safetyCounter++;
                }
                
                // Break out if loop safety limit reached
                if (safetyCounter >= maxIterations) return;
                
                // Add seasons from the first range - with iteration limit for safety
                idx = firstStartIdx;
                safetyCounter = 0;
                
                while (idx !== (firstEndIdx + 1) % this.seasons.length && safetyCounter < maxIterations) {
                    if (!combinedSeasons.includes(this.seasons[idx])) {
                        combinedSeasons.push(this.seasons[idx]);
                    }
                    idx = (idx + 1) % this.seasons.length;
                    safetyCounter++;
                }
                
                // Break out if loop safety limit reached
                if (safetyCounter >= maxIterations || combinedSeasons.length === 0) return;
                
                // Calculate the average score
                const avgScore = this.calculateAverageScore(combinedSeasons, normalizedScores);
                
                // Create a new array without the first and last ranges, but with the wraparound range
                const newRanges = ranges.filter(range => range !== firstRange && range !== lastRange);
                
                // Add the wraparound range
                newRanges.push({
                    start: lastRange.start,
                    end: firstRange.end,
                    score: avgScore,
                    isWraparound: true
                });
                
                // Replace the original ranges array content
                ranges.length = 0; // Clear the array
                ranges.push(...newRanges); // Add all the elements from newRanges
            }
        } catch (error) {
            // If anything goes wrong, log it and continue without creating wraparound
            console.warn("Error in checkForWraparoundRange:", error);
        }
    }
    
    /**
     * Calculate the average score for a range of seasons
     * @param {Array} seasonRange - Array of season names
     * @param {Object} normalizedScores - Object with normalized scores
     * @returns {number} - Average score for the range
     */
    calculateAverageScore(seasonRange, normalizedScores) {
        const sum = seasonRange.reduce((acc, season) => acc + normalizedScores[season], 0);
        return Math.round(sum / seasonRange.length);
    }

    /**
     * Format the seasonal range for display
     * @param {Array} ranges - Array of range objects
     * @returns {string} - Formatted display string
     */
    formatSeasonalRanges(ranges) {
        if (ranges.length === 0) {
            return "No specific seasonal range recommended";
        }
        
        // Sort ranges by score
        const sortedRanges = [...ranges].sort((a, b) => b.score - a.score);
        
        // Format each range
        return sortedRanges.map(range => {
            if (range.isWraparound) {
                return `${range.start} through ${range.end} (${range.score}%)`;
            }
            if (range.start === range.end) {
                return `${range.start} (${range.score}%)`;
            }
            return `${range.start} to ${range.end} (${range.score}%)`;
        }).join(', ');
    }
}

// Export the class
export default SeasonMatcher;