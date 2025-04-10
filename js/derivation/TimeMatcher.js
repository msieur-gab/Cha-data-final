// TimeMatcher.js
// Determines suitable times of day for consuming a tea based on its characteristics.

// Note: This module doesn't extend BaseCalculator as its primary role
// is derivation based on other calculators' outputs, not direct inference.

export class TimeMatcher {
    constructor(config = {}) {
        // Configuration options could be added later if needed (e.g., strictness)
        this.config = config;
    }

    /**
     * Matches the tea's profile to suitable times of day.
     * @param {object} compoundAnalysis - The 'analysis' object from CompoundCalculator's output.
     * Expected fields: stimulationLevel, relaxationLevel, compoundProfile, energyDurationHint (optional).
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator's output.
     * Expected fields: baseTimeOfDay.
     * @param {object} processingAnalysis - The 'analysis' object from ProcessingCalculator's output.
     * Expected fields: compoundEffectModifier.
     * @returns {Array<object>} - An array of recommended time slots with scores (e.g., [{name: "Morning", score: 5}]).
     */
    matchTime(compoundAnalysis = {}, teaTypeAnalysis = {}) {
        // Extract relevant data
        const {
            stimulationLevel = 1, 
            relaxationLevel = 1,
            compoundProfile = "Balanced",
            overallCompoundLevel = "moderate"
        } = compoundAnalysis;

        const {
            teaTypeName = "",
            caffeineLevel = "medium",
            teaFamily = "",
            teaType = ""
        } = teaTypeAnalysis;

        // Use a Map to track time scores
        const timeScores = new Map();

        // Start with some base suggestions based on compound profile
        switch (compoundProfile) {
            case "Intense & Sharp":
                this.addTime(timeScores, "Morning", 3);
                this.addTime(timeScores, "Early Afternoon", 2);
                break;
            case "Focused & Energized":
                this.addTime(timeScores, "Morning", 3);
                this.addTime(timeScores, "Afternoon", 2);
                break;
            case "Balanced":
                this.addTime(timeScores, "Anytime", 2);
                this.addTime(timeScores, "Afternoon", 2);
                break;
            case "Calm & Clear":
                this.addTime(timeScores, "Afternoon", 2);
                this.addTime(timeScores, "Evening", 3);
                break;
            case "Deep & Relaxing":
                this.addTime(timeScores, "Evening", 3);
                this.addTime(timeScores, "Night", 2);
                break;
            default:
                this.addTime(timeScores, "Anytime", 1);
        }

        // Adjust based on stimulation level
        if (stimulationLevel >= 3) {
            this.addTime(timeScores, "Morning", 2);
            this.addTime(timeScores, "Early Afternoon", 1);
            // Remove contradictory suggestions
            this.removeTime(timeScores, "Night");
            this.removeTime(timeScores, "Late Evening");
        } else if (stimulationLevel <= 1) {
            // Remove morning suggestions for low stimulation
            this.removeTime(timeScores, "Morning");
        }

        // Adjust based on relaxation level
        if (relaxationLevel >= 3) {
            this.addTime(timeScores, "Evening", 2);
            this.addTime(timeScores, "Night", 1);
            // Remove contradictory suggestions
            this.removeTime(timeScores, "Morning");
        } else if (relaxationLevel <= 1) {
            // Remove evening/night suggestions for low relaxation
            this.removeTime(timeScores, "Night");
        }

        // Adjust based on caffeine level
        if (caffeineLevel === "high" || caffeineLevel === "very high") {
            this.addTime(timeScores, "Morning", 2);
            this.addTime(timeScores, "Early Afternoon", 1);
            // Avoid evening for high caffeine
            this.removeTime(timeScores, "Evening");
            this.removeTime(timeScores, "Night");
        } else if (caffeineLevel === "low" || caffeineLevel === "none") {
            this.addTime(timeScores, "Evening", 2);
            this.addTime(timeScores, "Night", 1);
        }

        // Special case for specific tea types
        if (teaTypeName) {
            const lowerTeaName = teaTypeName.toLowerCase();
            if (lowerTeaName.includes("breakfast") || lowerTeaName.includes("morning")) {
                this.addTime(timeScores, "Morning", 2);
            }
            if (lowerTeaName.includes("evening") || lowerTeaName.includes("sleepytime")) {
                this.addTime(timeScores, "Evening", 2);
                this.addTime(timeScores, "Night", 2);
            }
            if (lowerTeaName.includes("bedtime") || lowerTeaName.includes("sleep")) {
                this.addTime(timeScores, "Night", 3);
            }
        }

        // Special case for herbal tea families
        if (teaFamily === "Herbal" || teaType === "Herbal") {
            this.addTime(timeScores, "Evening", 1);
            this.addTime(timeScores, "Night", 1);
        }

        // Log scores for debugging
        console.log("Time scores:", Object.fromEntries(timeScores));

        // Select times based on scores
        const sortedTimes = [...timeScores.entries()]
            .sort((a, b) => b[1] - a[1]); // Sort by score descending

        let recommendedTimes = [];
        if (sortedTimes.length > 0) {
            const maxScore = sortedTimes[0][1];
            const threshold = 1; // Times within 1 point of max score
            
            // Filter to only include times with scores close to the max
            recommendedTimes = sortedTimes
                .filter(([time, score]) => score >= maxScore - threshold)
                // Changed to return objects with name and score instead of just names
                .map(([time, score]) => ({ name: time, score: this.normalizeScore(score) }));
            
            // If "Anytime" is included along with specific times, remove it
            if (recommendedTimes.length > 1 && recommendedTimes.some(item => item.name === "Anytime")) {
                recommendedTimes = recommendedTimes.filter(item => item.name !== "Anytime");
            }
            
            // Limit to a maximum of 3 suggestions
            if (recommendedTimes.length > 3) {
                recommendedTimes = recommendedTimes.slice(0, 3);
            }
        }

        // Fallback if no recommendations
        if (recommendedTimes.length === 0 && sortedTimes.length > 0) {
            // Return the top item with its score if filtering removed everything
            recommendedTimes = [{ name: sortedTimes[0][0], score: this.normalizeScore(sortedTimes[0][1]) }];
        } else if (recommendedTimes.length === 0) {
            // Return a default if no scores were generated
            recommendedTimes = [{ name: "Anytime", score: 50 }];
        }

        return recommendedTimes;
    }
    
    /**
     * Helper to add a time with a score
     * @param {Map} scoreMap - Map tracking time scores
     * @param {string} time - Time to add
     * @param {number} score - Score to assign
     */
    addTime(scoreMap, time, score) {
        if (!time) return;
        const currentScore = scoreMap.get(time) || 0;
        scoreMap.set(time, currentScore + score);
    }
    
    /**
     * Helper to remove a time
     * @param {Map} scoreMap - Map tracking time scores
     * @param {string} time - Time to remove
     */
    removeTime(scoreMap, time) {
        if (!time) return;
        scoreMap.delete(time);
    }
    
    /**
     * Normalize the score to a 0-100 scale
     * @param {number} score - Raw score
     * @returns {number} - Normalized score (0-100)
     */
    normalizeScore(score) {
        // Scaling factor - adjust based on your scoring range
        // Current implementation assumes max raw score around 5-6
        const scalingFactor = 16.67; // To scale up to 100
        return Math.min(Math.round(score * scalingFactor), 100);
    }

    // --- Optional: Add format/serialize methods if needed for consistency ---
    // e.g., formatMatch(matchResult) => "Recommended for: Morning, Midday"
    // e.g., serialize(matchResult) => { timeMatch: ["Morning", "Midday"] }
}

// Export the class
export default TimeMatcher;