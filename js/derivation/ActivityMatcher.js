// ActivityMatcher.js
// Matches a tea's profile to suitable activities.

export class ActivityMatcher {
    constructor(config = {}) {
        // Configuration options could be added (e.g., number of suggestions)
        this.config = config;
    }

    /**
     * Matches the tea's profile to suitable activities.
     * @param {object} compoundAnalysis - The 'analysis' object from CompoundCalculator.
     * Expected: stimulationLevel, relaxationLevel, compoundProfile.
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator.
     * Expected: baseActivityHints.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator.
     * Expected: activityHints.
     * @returns {Array<object>} - An array of suggested activity objects with name and score.
     */
    matchActivity(compoundAnalysis = {}, flavorAnalysis = {}, teaTypeAnalysis = {}) {
        // Extract relevant data
        const {
            compoundProfile = "Balanced",
            stimulationLevel = 1,
            relaxationLevel = 1,
            overallCompoundLevel = "moderate"
        } = compoundAnalysis;

        const {
            flavorProfile = "",
            intensityEstimate = "Moderate"
        } = flavorAnalysis;

        const {
            teaTypeName = "",
            teaOrigins = []
        } = teaTypeAnalysis;

        // Use a Map to store activity scores
        const activityScores = new Map();

        // Start with recommendations based on compound profile
        switch (compoundProfile) {
            case "Intense & Sharp":
                this.addActivity(activityScores, "Sports & Exercise", 3);
                this.addActivity(activityScores, "Morning Routines", 3);
                this.addActivity(activityScores, "Productivity Sessions", 2);
                this.addActivity(activityScores, "Active Outdoor Activities", 2);
                break;
            case "Focused & Energized":
                this.addActivity(activityScores, "Work & Study", 3);
                this.addActivity(activityScores, "Creative Projects", 3);
                this.addActivity(activityScores, "Brainstorming", 2);
                this.addActivity(activityScores, "Problem Solving", 2);
                break;
            case "Balanced":
                this.addActivity(activityScores, "Social Gatherings", 2);
                this.addActivity(activityScores, "Casual Reading", 2);
                this.addActivity(activityScores, "Light Exercise", 2);
                this.addActivity(activityScores, "Everyday Activities", 2);
                break;
            case "Calm & Clear":
                this.addActivity(activityScores, "Meditation", 3);
                this.addActivity(activityScores, "Relaxation", 3);
                this.addActivity(activityScores, "Gentle Yoga", 2);
                this.addActivity(activityScores, "Mindfulness Practices", 2);
                break;
            case "Deep & Relaxing":
                this.addActivity(activityScores, "Evening Wind-Down", 3);
                this.addActivity(activityScores, "Reading Before Bed", 3);
                this.addActivity(activityScores, "Relaxation Rituals", 2);
                this.addActivity(activityScores, "Contemplative Practices", 2);
                break;
            default:
                // Default suggestions for unknown profiles
                this.addActivity(activityScores, "General Enjoyment", 1);
                this.addActivity(activityScores, "Casual Sipping", 1);
        }

        // Refine based on stimulation and relaxation levels
        if (stimulationLevel >= 3) {
            this.addActivity(activityScores, "High-Focus Work", 2);
            this.addActivity(activityScores, "Morning Routines", 2);
            // Remove contradictory suggestions
            this.removeActivity(activityScores, "Evening Wind-Down");
            this.removeActivity(activityScores, "Meditation");
        } else if (stimulationLevel <= 1) {
            // Remove high-energy activities
            this.removeActivity(activityScores, "Sports & Exercise");
            this.removeActivity(activityScores, "Active Outdoor Activities");
        }

        if (relaxationLevel >= 3) {
            this.addActivity(activityScores, "Stress Relief", 2);
            this.addActivity(activityScores, "Evening Wind-Down", 2);
            // Remove contradictory suggestions
            this.removeActivity(activityScores, "High-Focus Work");
            this.removeActivity(activityScores, "Sports & Exercise");
        } else if (relaxationLevel <= 1) {
            // Remove relaxation-focused activities
            this.removeActivity(activityScores, "Meditation");
            this.removeActivity(activityScores, "Evening Wind-Down");
        }

        // Add hints based on tea type
        if (teaTypeName) {
            if (teaTypeName.toLowerCase().includes('matcha') || 
                teaTypeName.toLowerCase().includes('sencha')) {
                this.addActivity(activityScores, "Mindfulness Practices", 1);
                this.addActivity(activityScores, "Traditional Tea Ceremonies", 1);
            }
            if (teaTypeName.toLowerCase().includes('breakfast') || 
                teaTypeName.toLowerCase().includes('assam')) {
                this.addActivity(activityScores, "Morning Routines", 1);
                this.addActivity(activityScores, "Breakfast Companion", 1);
            }
            if (teaTypeName.toLowerCase().includes('chai')) {
                this.addActivity(activityScores, "Social Gatherings", 1);
                this.addActivity(activityScores, "Cold Weather Comfort", 1);
            }
            if (teaTypeName.toLowerCase().includes('chamomile') || 
                teaTypeName.toLowerCase().includes('lavender')) {
                this.addActivity(activityScores, "Evening Wind-Down", 1);
                this.addActivity(activityScores, "Sleep Preparation", 1);
            }
        }

        // Add hints based on flavor profile
        if (flavorProfile) {
            if (flavorProfile.toLowerCase().includes('floral') || 
                flavorProfile.toLowerCase().includes('delicate')) {
                this.addActivity(activityScores, "Mindful Sipping", 1);
                this.addActivity(activityScores, "Garden Enjoyment", 1);
            }
            if (flavorProfile.toLowerCase().includes('citrus') || 
                flavorProfile.toLowerCase().includes('fresh')) {
                this.addActivity(activityScores, "Morning Routines", 1);
                this.addActivity(activityScores, "Refreshment Breaks", 1);
            }
            if (flavorProfile.toLowerCase().includes('earthy') || 
                flavorProfile.toLowerCase().includes('robust')) {
                this.addActivity(activityScores, "Deep Thinking", 1);
                this.addActivity(activityScores, "Contemplative Practices", 1);
            }
        }

        // Log scores for debugging
        console.log("Activity scores:", Object.fromEntries(activityScores));

        // Select activities based on scores
        const sortedActivities = [...activityScores.entries()]
            .sort((a, b) => b[1] - a[1]); // Sort by score descending

        let recommendedActivities = [];
        if (sortedActivities.length > 0) {
            const maxScore = sortedActivities[0][1];
            const threshold = 1; // Activities within 1 point of max score
            
            // Filter to only include activities with scores close to the max
            recommendedActivities = sortedActivities
                .filter(([activity, score]) => score >= maxScore - threshold)
                // Changed to return objects with name and score instead of just names
                .map(([activity, score]) => ({ name: activity, score: this.normalizeScore(score) }));
            
            // Limit to a maximum of 5 suggestions
            if (recommendedActivities.length > 5) {
                recommendedActivities = recommendedActivities.slice(0, 5);
            }
        }

        // Fallback if no recommendations
        if (recommendedActivities.length === 0) {
            recommendedActivities = [{ name: "General Enjoyment", score: 50 }];
        }

        return recommendedActivities;
    }
    
    /**
     * Helper to add an activity with a score
     * @param {Map} scoreMap - Map tracking activity scores
     * @param {string} activity - Activity to add
     * @param {number} score - Score to assign
     */
    addActivity(scoreMap, activity, score) {
        if (!activity) return;
        const currentScore = scoreMap.get(activity) || 0;
        scoreMap.set(activity, currentScore + score);
    }
    
    /**
     * Helper to remove an activity
     * @param {Map} scoreMap - Map tracking activity scores
     * @param {string} activity - Activity to remove
     */
    removeActivity(scoreMap, activity) {
        if (!activity) return;
        scoreMap.delete(activity);
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

    /**
     * Helper to normalize hint strings (e.g., capitalize)
     * @param {string} hint
     * @returns {string}
     */
    normalizeHint(hint) {
        if (!hint) return '';
        // Simple capitalize first letter
        return hint.charAt(0).toUpperCase() + hint.slice(1).toLowerCase();
    }

    // --- Optional: Add format/serialize methods if needed ---
}

// Export the class
export default ActivityMatcher;
