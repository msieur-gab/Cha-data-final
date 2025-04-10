// ActivityMatcher.js
// Matches a tea's profile to suitable activities and identifies activity clusters.
// Enhanced to group related activities into thematic clusters

export class ActivityMatcher {
    constructor(config = {}) {
        // Configuration options
        this.config = {
            // Minimum score (0-100) required to be included in a recommended cluster
            clusterThreshold: config.clusterThreshold || 80,
            // Maximum number of top activities to return
            maxRecommendations: config.maxRecommendations || 3,
            ...config
        };
        
        // Define activity clusters with related activities
        this.activityClusters = [
            {
                theme: "Mindfulness & Relaxation",
                activities: ["Meditation", "Yoga", "Deep Breathing", "Gentle Stretching", "Mindfulness Practice"]
            },
            {
                theme: "Focus & Productivity",
                activities: ["Work", "Study", "Reading", "Writing", "Problem Solving", "Coding", "High-Focus Work", "Productivity Sessions"]
            },
            {
                theme: "Creative Pursuits",
                activities: ["Art", "Journaling", "Creative Writing", "Music", "Crafting", "Brainstorming", "Creative Projects"]
            },
            {
                theme: "Social Engagement",
                activities: ["Social Gatherings", "Conversation", "Hosting", "Meetings", "Group Activities", "Tea Ceremony", "Social Events"]
            },
            {
                theme: "Active & Energetic",
                activities: ["Exercise", "Walking", "Light Exercise", "Sports", "Dance", "Active Outdoor Activities", "Morning Routines"]
            },
            {
                theme: "Evening Wind-Down",
                activities: ["Reading Before Bed", "Evening Ritual", "Relaxation", "Light Reading", "Evening Wind-Down", "Sleep Preparation"]
            },
            {
                theme: "Contemplative & Reflective",
                activities: ["Contemplation", "Reflection", "Journaling", "Deep Thinking", "Planning", "Self-Reflection", "Mindful Observation"]
            },
            {
                theme: "Everyday Rituals",
                activities: ["Daily Rituals", "Morning Routines", "Afternoon Break", "Breakfast Companion", "Casual Sipping", "General Enjoyment", "Everyday Activities"]
            }
        ];
        
        // Helper mapping for string levels to numbers
        this.levelMap = {
            "none": 0, "very low": 1, "low": 2,
            "moderate": 3, "medium": 3, // Alias medium
            "medium-high": 4,
            "high": 4,
            "very high": 5
        };
    }

    /**
     * Matches the tea's profile to suitable activities.
     * @param {object} compoundAnalysis - The 'analysis' object from CompoundCalculator.
     * Expected: stimulationLevel, relaxationLevel, compoundProfile.
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator.
     * Expected: baseActivityHints.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator.
     * Expected: activityHints.
     * @returns {Object} - Results with recommended activities and activity clusters
     */
    matchActivity(compoundAnalysis = {}, teaTypeAnalysis = {}, flavorAnalysis = {}) {
        // --- Extract and CONVERT data ---
        const compoundProfile = compoundAnalysis.compoundProfile || "Balanced";
        const stimulationStr = compoundAnalysis.stimulationLevel || "moderate";
        const relaxationStr = compoundAnalysis.relaxationLevel || "moderate";

        // Convert string levels to numbers
        const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3;
        const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3;

        // Use correct property names from teaTypeAnalysis
        const baseActivityHints = teaTypeAnalysis.baseActivityHints || [];
        const primaryTeaType = teaTypeAnalysis.primaryType || ""; // Use primaryType

        const activityHints = flavorAnalysis.activityHints || [];
        // Assuming flavorProfile is primarily for flavor-based hints below, keep as is
        const flavorProfile = flavorAnalysis.flavorProfile || "";
        // --- End Data Extraction/Conversion ---

        // Use a Map to store activity scores
        const activityScores = new Map();
        
        // Initialize base scores (e.g., 50) to avoid zero scores unless penalized
        this.activityClusters.forEach(cluster => {
            cluster.activities.forEach(activity => {
                if (!activityScores.has(activity)) { // Avoid overwriting if activity exists in multiple clusters
                    activityScores.set(activity, 50);
                }
            });
        });
        if (!activityScores.has("General Enjoyment")) activityScores.set("General Enjoyment", 50);
        if (!activityScores.has("Casual Sipping")) activityScores.set("Casual Sipping", 50);

        // Start with recommendations based on compound profile
        switch (compoundProfile) {
            case "Intense & Sharp":
                this.addActivity(activityScores, "Sports & Exercise", 25);
                this.addActivity(activityScores, "Morning Routines", 25);
                this.addActivity(activityScores, "Productivity Sessions", 15);
                this.addActivity(activityScores, "Active Outdoor Activities", 15);
                this.addActivity(activityScores, "High-Focus Work", 20);
                this.addActivity(activityScores, "Meditation", -20); // Example penalty
                this.addActivity(activityScores, "Relaxation", -20); // Example penalty
                break;
            case "Focused & Energized":
                this.addActivity(activityScores, "Work", 25);
                this.addActivity(activityScores, "Study", 25);
                this.addActivity(activityScores, "Creative Projects", 20);
                this.addActivity(activityScores, "Brainstorming", 15);
                this.addActivity(activityScores, "Problem Solving", 15);
                this.addActivity(activityScores, "Evening Wind-Down", -15);
                this.addActivity(activityScores, "Sleep Preparation", -15);
                break;
            case "Balanced":
            case "Balanced & Focused":
                this.addActivity(activityScores, "Social Gatherings", 15);
                this.addActivity(activityScores, "Reading", 15);
                this.addActivity(activityScores, "Light Exercise", 15);
                this.addActivity(activityScores, "Everyday Activities", 15);
                this.addActivity(activityScores, "Work", 5); // Reduced from 15 to 5
                
                // Modification 3.2: Boost digestive and relaxation activities for Balanced (for Puerh)
                this.addActivity(activityScores, "Relaxation", 20);
                this.addActivity(activityScores, "Contemplation", 20);
                this.addActivity(activityScores, "Social Gatherings", 20);
                this.addActivity(activityScores, "Digestive", 25);
                this.addActivity(activityScores, "Evening Wind-Down", 15);
                
                // Reduce high-focus work for balanced profile
                this.addActivity(activityScores, "High-Focus Work", -10);
                break;
            case "Calm & Clear":
            case "Smooth & Sustained":
                // Modification 3.1: Enhanced for Matcha/Gyokuro
                this.addActivity(activityScores, "Focus", 25); // Added/Increased
                this.addActivity(activityScores, "Work", 20); // Added/Increased
                this.addActivity(activityScores, "Study", 20); // Added/Increased
                this.addActivity(activityScores, "Creative Projects", 15); // Added/Increased
                
                // Adjust Meditation/Yoga based on stimulation level
                if (stimulationLevelNum >= 3) {
                    this.addActivity(activityScores, "Meditation", 15); // Reduced bonus if stimulating
                } else {
                    this.addActivity(activityScores, "Meditation", 25); // Keep higher bonus if less stimulating
                }
                
                this.addActivity(activityScores, "Yoga", 20);
                this.addActivity(activityScores, "Reading", 15);
                this.addActivity(activityScores, "Gentle Stretching", 15);
                this.addActivity(activityScores, "Contemplation", 20);
                this.addActivity(activityScores, "Sports & Exercise", -15);
                break;
            case "Deeply Calm":
            case "Primarily Relaxing":
                this.addActivity(activityScores, "Evening Wind-Down", 25);
                this.addActivity(activityScores, "Reading Before Bed", 25);
                this.addActivity(activityScores, "Relaxation", 25);
                this.addActivity(activityScores, "Meditation", 20);
                this.addActivity(activityScores, "Deep Breathing", 15);
                this.addActivity(activityScores, "Sports & Exercise", -20);
                this.addActivity(activityScores, "Active Outdoor Activities", -20);
                this.addActivity(activityScores, "High-Focus Work", -15);
                break;
            default:
                // Default suggestions for unknown profiles
                this.addActivity(activityScores, "General Enjoyment", 5);
                this.addActivity(activityScores, "Casual Sipping", 5);
        }

        // Refine based on stimulation and relaxation levels
        if (stimulationLevelNum >= 4) { // High or Very High
            this.addActivity(activityScores, "High-Focus Work", 15);
            this.addActivity(activityScores, "Active Outdoor Activities", 15);
            this.addActivity(activityScores, "Morning Routines", 10);
            this.addActivity(activityScores, "Exercise", 10);
            this.addActivity(activityScores, "Evening Wind-Down", -25); // Penalize
            this.addActivity(activityScores, "Sleep Preparation", -25); // Penalize
            this.addActivity(activityScores, "Relaxation", -15); // Penalize
            this.addActivity(activityScores, "Meditation", -15); // Penalize
        } else if (stimulationLevelNum <= 1) { // Very Low or None
            this.addActivity(activityScores, "Sports & Exercise", -15);
            this.addActivity(activityScores, "Active Outdoor Activities", -15);
            this.addActivity(activityScores, "Morning Routines", -10);
        }

        if (relaxationLevelNum >= 4) { // High or Very High
            this.addActivity(activityScores, "Meditation", 20);
            this.addActivity(activityScores, "Yoga", 15);
            this.addActivity(activityScores, "Deep Breathing", 15);
            this.addActivity(activityScores, "Relaxation", 15);
            this.addActivity(activityScores, "Evening Wind-Down", 10);
            this.addActivity(activityScores, "Sleep Preparation", 10);
            this.addActivity(activityScores, "High-Focus Work", -20); // Penalize
            this.addActivity(activityScores, "Sports & Exercise", -20); // Penalize
            this.addActivity(activityScores, "Active Outdoor Activities", -15); // Penalize
        } else if (relaxationLevelNum <= 1) { // Very Low or None
            this.addActivity(activityScores, "Meditation", -15);
            this.addActivity(activityScores, "Relaxation", -10);
            this.addActivity(activityScores, "Deep Breathing", -10);
        }

        // Add hints based on tea type activity hints
        baseActivityHints.forEach(hint => {
            this.addActivity(activityScores, this.normalizeHint(hint), 15); // Increased score
        });

        // Add hints from flavor analysis
        activityHints.forEach(hint => {
            this.addActivity(activityScores, this.normalizeHint(hint), 10); // Increased score
        });

        // Add hints based on tea type name
        if (primaryTeaType) {
            const lowerTeaType = primaryTeaType.toLowerCase();
            if (lowerTeaType.includes('matcha') || lowerTeaType.includes('sencha')) {
                this.addActivity(activityScores, "Mindfulness Practice", 10);
                this.addActivity(activityScores, "Tea Ceremony", 10);
                this.addActivity(activityScores, "Focus", 5); // From base hints
            }
            if (lowerTeaType.includes('breakfast') || lowerTeaType.includes('assam')) {
                this.addActivity(activityScores, "Morning Routines", 10);
                this.addActivity(activityScores, "Breakfast Companion", 10);
            }
            if (lowerTeaType.includes('chai')) {
                this.addActivity(activityScores, "Social Gatherings", 10);
                this.addActivity(activityScores, "Hosting", 10);
            }
            if (lowerTeaType.includes('chamomile') || lowerTeaType.includes('lavender')) {
                this.addActivity(activityScores, "Evening Wind-Down", 10);
                this.addActivity(activityScores, "Sleep Preparation", 10);
            }
        }

        // Add hints based on flavor profile
        if (flavorProfile) {
            if (typeof flavorProfile === 'string') {
                // Handle string flavor profile
                const profile = flavorProfile.toLowerCase();
                if (profile.includes('floral') || profile.includes('delicate')) {
                    this.addActivity(activityScores, "Mindful Observation", 10);
                    this.addActivity(activityScores, "Gentle Activities", 5);
                }
                if (profile.includes('citrus') || profile.includes('fresh')) {
                    this.addActivity(activityScores, "Morning Routines", 10);
                    this.addActivity(activityScores, "Refreshing Breaks", 5);
                }
                if (profile.includes('earthy') || profile.includes('robust')) {
                    this.addActivity(activityScores, "Deep Thinking", 10);
                    this.addActivity(activityScores, "Contemplation", 10);
                }
            } else if (Array.isArray(flavorProfile)) {
                // Handle array flavor profile
                flavorProfile.forEach(flavor => {
                    if (typeof flavor === 'string') {
                        const flavorLower = flavor.toLowerCase();
                        if (flavorLower.includes('floral') || flavorLower.includes('delicate')) {
                            this.addActivity(activityScores, "Mindful Observation", 10);
                        } else if (flavorLower.includes('citrus') || flavorLower.includes('fresh')) {
                            this.addActivity(activityScores, "Morning Routines", 10);
                        } else if (flavorLower.includes('earthy') || flavorLower.includes('robust')) {
                            this.addActivity(activityScores, "Contemplation", 10);
                        }
                    }
                });
            }
        }
        
        // Optional: Remove activities with very low scores before normalization
        for (const [activity, score] of activityScores.entries()) {
            if (score < 25) { // Example threshold
                activityScores.delete(activity);
            }
        }

        console.log(`Raw Activity Scores for tea (${primaryTeaType || 'Unknown'}):`, activityScores); // Log raw scores
                
        // Process the results
        const normalizedScores = this.normalizeActivityScores(activityScores);
        const recommendedActivities = this.getRecommendedActivities(normalizedScores);
        const activityClusters = this.identifyActivityClusters(normalizedScores);

        return {
            recommendations: normalizedScores,
            recommendedActivities,
            activityClusters
        };
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
     * Normalize the activity scores to a 0-100 scale
     * @param {Map} activityScores - Map of raw activity scores
     * @returns {Object} - Object with activity names as keys and normalized scores as values
     */
    normalizeActivityScores(activityScores) {
        const result = {};
        
        // Handle empty scores
        if (activityScores.size === 0) {
            return { "General Enjoyment": 50 };
        }
        
        // Find maximum and minimum scores for normalization
        const scores = [...activityScores.values()];
        const maxScore = Math.max(...scores, 1); // Prevent division by zero
        const minScore = Math.min(...scores, 0);
        
        // Convert scores to 0-100 scale
        for (const [activity, score] of activityScores.entries()) {
            let normalizedScore = 0;
            if (maxScore > minScore) {
                normalizedScore = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
            } else if (maxScore > 0) {
                normalizedScore = 100;
            }
            result[activity] = Math.max(0, Math.min(normalizedScore, 100));
        }
        
        console.log("Normalized Activity Scores:", result);
        return result;
    }
    
    /**
     * Get recommended activities based on normalized scores
     * @param {Object} normalizedScores - Object with normalized activity scores
     * @returns {Array} - Array of recommended activity objects with name and score
     */
    getRecommendedActivities(normalizedScores) {
        // Sort by score descending
        const sortedActivities = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Handle empty activities
        if (sortedActivities.length === 0) {
            return [{ name: "General Enjoyment", score: 50 }];
        }
        
        const maxScore = sortedActivities[0][1];
        const absoluteThreshold = 65; // Example
        const relativeThreshold = 20; // Example
        
        // Include activities that meet thresholds
        const topActivities = sortedActivities
            .filter(([activity, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
            .map(([activity, score]) => ({ name: activity, score }));
        
        // Ensure at least one activity is recommended
        if (topActivities.length === 0 && sortedActivities.length > 0) {
            return [ { name: sortedActivities[0][0], score: sortedActivities[0][1] } ];
        }
        
        // Limit to configured maximum number of recommendations
        return topActivities.slice(0, this.config.maxRecommendations);
    }
    
    /**
     * Identify clusters of related activities
     * @param {Object} normalizedScores - Object with normalized activity scores
     * @returns {Array} - Array of activity cluster objects
     */
    identifyActivityClusters(normalizedScores) {
        const result = [];
        const threshold = this.config.clusterThreshold; // Use config
        
        // Process each predefined cluster
        this.activityClusters.forEach(cluster => {
            const matchingActivities = [];
            let totalScore = 0;
            
            // Find activities in this cluster that have scores
            cluster.activities.forEach(activity => {
                if (normalizedScores[activity] !== undefined && 
                    normalizedScores[activity] >= threshold) {
                    matchingActivities.push({
                        name: activity,
                        score: normalizedScores[activity]
                    });
                    totalScore += normalizedScores[activity];
                }
            });
            
            // Only include clusters with enough matching activities
            if (matchingActivities.length >= 1) { // Changed from >= 2 to show clusters even with 1 match above threshold
                // Sort activities by score
                matchingActivities.sort((a, b) => b.score - a.score);
                
                // Calculate average score for the cluster
                const avgScore = Math.round(totalScore / matchingActivities.length);
                
                result.push({
                    theme: cluster.theme,
                    activities: matchingActivities,
                    score: avgScore
                });
            }
        });
        
        // Sort clusters by score
        result.sort((a, b) => b.score - a.score);
        
        return result;
    }
    
    /**
     * Format the activity clusters for display
     * @param {Array} clusters - Array of cluster objects
     * @returns {string} - Formatted display string
     */
    formatActivityClusters(clusters) {
        if (clusters.length === 0) {
            return "No specific activity clusters recommended";
        }
        
        // Sort clusters by score
        const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
        
        // Format each cluster
        return sortedClusters.map(cluster => {
            const activityNames = cluster.activities.map(a => a.name).join(", ");
            return `${cluster.theme} (${cluster.score}%): ${activityNames}`;
        }).join('\n');
    }
    
    /**
     * Generate a description of recommended activities and clusters
     * @param {Object} results - Results from matchActivity
     * @param {string} teaName - Name of the tea
     * @returns {string} - Human-readable description
     */
    generateActivityDescription(results, teaName) {
        const { recommendedActivities, activityClusters } = results;
        
        if (recommendedActivities.length === 0) {
            return `${teaName} is versatile and can be enjoyed during most activities.`;
        }
        
        let description = `${teaName} pairs especially well with `;
        
        // Add top activities
        if (recommendedActivities.length === 1) {
            description += `${recommendedActivities[0].name.toLowerCase()} (${recommendedActivities[0].score}% match).`;
        } else if (recommendedActivities.length === 2) {
            description += `${recommendedActivities[0].name.toLowerCase()} (${recommendedActivities[0].score}%) and ${recommendedActivities[1].name.toLowerCase()} (${recommendedActivities[1].score}%).`;
        } else {
            const lastActivity = recommendedActivities[recommendedActivities.length - 1];
            const topActivities = recommendedActivities.slice(0, -1).map(a => `${a.name.toLowerCase()} (${a.score}%)`).join(', ');
            description += `${topActivities}, and ${lastActivity.name.toLowerCase()} (${lastActivity.score}%).`;
        }
        
        // Add cluster information if available
        if (activityClusters.length > 0) {
            const topCluster = activityClusters[0];
            description += ` It's especially suited for "${topCluster.theme}" activities (${topCluster.score}% match).`;
        }
        
        return description;
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
}

// Export the class
export default ActivityMatcher;