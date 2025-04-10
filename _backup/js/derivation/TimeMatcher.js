// TimeMatcher.js
// Matches a tea's profile to the most suitable time(s) of day for consumption.

export class TimeMatcher {
    constructor(config = {}) {
        this.config = {
            rangeThreshold: config.rangeThreshold || 70,
            ...config
        };
        this.timePeriods = [
            "Early Morning", "Morning", "Midday",
            "Afternoon", "Evening", "Night"
        ];

        // Helper mapping for string levels to numbers (adjust scores as needed)
        this.levelMap = {
             "none": 0, "very low": 1, "low": 2,
             "moderate": 3, "medium": 3, // Alias medium
             "medium-high": 4, // Add compound levels
             "high": 4,
             "very high": 5
        };
    }

    matchTime(compoundAnalysis = {}, teaTypeAnalysis = {}, processingAnalysis = {}) {
        // --- Extract and CONVERT data ---
        const stimulationStr = compoundAnalysis.stimulationLevel || "moderate"; // e.g., "Low"
        const relaxationStr = compoundAnalysis.relaxationLevel || "moderate"; // e.g., "High"
        const compoundProfile = compoundAnalysis.compoundProfile || "Balanced";

        // Convert string levels to numbers using the map
        const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3; // Default to moderate (3) if unknown
        const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3; // Default to moderate (3) if unknown

        // Get caffeine level string and tea type name correctly
        const typicalCaffeineStr = teaTypeAnalysis.typicalCaffeine || "medium"; // e.g., "Medium-High"
        const primaryTeaType = teaTypeAnalysis.primaryType || ""; // Use primaryType

        // Convert typicalCaffeine string to a simpler category for checks
        let caffeineCategory = "medium"; // Default
        const lowerCaffeineStr = typicalCaffeineStr.toLowerCase();
        if (lowerCaffeineStr.includes("very high") || lowerCaffeineStr.includes("high")) {
            caffeineCategory = "high";
        } else if (lowerCaffeineStr.includes("very low") || lowerCaffeineStr.includes("low") || lowerCaffeineStr.includes("none")) {
            caffeineCategory = "low";
        }
        // --- End Data Extraction/Conversion ---


        const timeScores = new Map();

        // Initialize with a base score (e.g., 50) for all periods
        // This prevents periods from having zero score unless explicitly penalized
        this.timePeriods.forEach(period => timeScores.set(period, 50));


        // Base scores based on compoundProfile (Using larger increments now)
        switch (compoundProfile) {
            case "Intense & Sharp":
                 this.addTime(timeScores, "Early Morning", 25); // Increased score
                 this.addTime(timeScores, "Morning", 35);       // Increased score
                 this.addTime(timeScores, "Midday", 15);        // Increased score
                 this.addTime(timeScores, "Evening", -20);      // Penalty
                 this.addTime(timeScores, "Night", -30);        // Penalty
                 break;
            case "Focused & Energized":
                 this.addTime(timeScores, "Morning", 30);
                 this.addTime(timeScores, "Midday", 25);
                 this.addTime(timeScores, "Afternoon", 15);
                 this.addTime(timeScores, "Evening", -15);
                 this.addTime(timeScores, "Night", -25);
                 break;
            case "Balanced":
                 // Balanced teas are more versatile, apply smaller adjustments
                 this.addTime(timeScores, "Morning", 10);
                 this.addTime(timeScores, "Midday", 15);
                 this.addTime(timeScores, "Afternoon", 15);
                 this.addTime(timeScores, "Evening", 5);
                 break;
             case "Calm & Clear":
             case "Smooth & Sustained": // Grouping similar profiles
                 this.addTime(timeScores, "Morning", -10); // Penalize slightly
                 this.addTime(timeScores, "Midday", 10);
                 this.addTime(timeScores, "Afternoon", 25);
                 this.addTime(timeScores, "Evening", 30);
                 this.addTime(timeScores, "Night", 10);
                 break;
             case "Deeply Calm":
                 this.addTime(timeScores, "Morning", -30); // Penalize
                 this.addTime(timeScores, "Midday", -10);  // Penalize
                 this.addTime(timeScores, "Afternoon", 15);
                 this.addTime(timeScores, "Evening", 35);
                 this.addTime(timeScores, "Night", 30);
                 break;
             default:
                 // Less impact for unknown profiles
                 this.addTime(timeScores, "Afternoon", 5);
                 this.addTime(timeScores, "Morning", 5);
        }

        // Adjust based on stimulation level NUMBER (Using larger increments)
        // Example mapping: 0=None, 1=VL, 2=L, 3=M, 4=H, 5=VH
        if (stimulationLevelNum >= 4) { // High or Very High
            this.addTime(timeScores, "Early Morning", 15);
            this.addTime(timeScores, "Morning", 20);
            this.addTime(timeScores, "Midday", 10);
            this.addTime(timeScores, "Evening", -25); // Stronger penalty
            this.addTime(timeScores, "Night", -35);   // Stronger penalty
        } else if (stimulationLevelNum <= 1) { // Very Low or None
            this.addTime(timeScores, "Morning", -15); // Penalize morning
            this.addTime(timeScores, "Afternoon", 10);
            this.addTime(timeScores, "Evening", 15);
            this.addTime(timeScores, "Night", 10);
        }

        // Adjust based on relaxation level NUMBER (Using larger increments)
        if (relaxationLevelNum >= 4) { // High or Very High
            this.addTime(timeScores, "Afternoon", 10);
            this.addTime(timeScores, "Evening", 25);
            this.addTime(timeScores, "Night", 20);
            this.addTime(timeScores, "Early Morning", -20); // Penalize
            this.addTime(timeScores, "Morning", -15); // Penalize
        } else if (relaxationLevelNum <= 1) { // Very Low or None
            this.addTime(timeScores, "Evening", -15); // Penalize evening/night
            this.addTime(timeScores, "Night", -20);
        }

        // Adjust based on caffeine CATEGORY (high/medium/low)
        if (caffeineCategory === "high") {
            this.addTime(timeScores, "Early Morning", 10);
            this.addTime(timeScores, "Morning", 15);
            this.addTime(timeScores, "Midday", 5);
            this.addTime(timeScores, "Evening", -30); // Strong penalty
            this.addTime(timeScores, "Night", -40);   // Strong penalty
        } else if (caffeineCategory === "low") {
            this.addTime(timeScores, "Afternoon", 10);
            this.addTime(timeScores, "Evening", 15);
            this.addTime(timeScores, "Night", 15);
        }

        // Adjust based on primaryTeaType (using the correct variable)
        if (primaryTeaType) {
            const lowerTeaType = primaryTeaType.toLowerCase();
             if (lowerTeaType.includes("breakfast") || lowerTeaType.includes("assam") || lowerTeaType.includes("black")) { // Example grouping
                 this.addTime(timeScores, "Early Morning", 15);
                 this.addTime(timeScores, "Morning", 15);
             }
             if (lowerTeaType.includes("green") && !lowerTeaType.includes("hojicha")){ // Hojicha is often evening
                 this.addTime(timeScores,"Morning", 10);
                 this.addTime(timeScores,"Midday", 5);
                 this.addTime(timeScores,"Afternoon", 5);
                 this.addTime(timeScores,"Evening", -5);
             }
             if (lowerTeaType.includes("white")) {
                 this.addTime(timeScores,"Afternoon", 10);
                 this.addTime(timeScores,"Evening", 5);
             }
            if (lowerTeaType.includes("herbal") || lowerTeaType.includes("tisane") || lowerTeaType.includes("hojicha") || lowerTeaType.includes("chamomile") || lowerTeaType.includes("lavender")) { // Grouping low/no caffeine
                 this.addTime(timeScores, "Evening", 15);
                 this.addTime(timeScores, "Night", 15);
            }
            
            // Modification 1.1: Apply penalty to gyokuro and matcha for evening/night
            if (lowerTeaType.includes("gyokuro") || lowerTeaType.includes("matcha")) {
                this.addTime(timeScores, "Evening", -20); // Further penalize evening
                this.addTime(timeScores, "Night", -25);   // Further penalize night
                this.addTime(timeScores, "Afternoon", 10); // Boost Afternoon slightly
            }
            
            // Modification 1.2: Boost Afternoon for Ripe Puerh
            if (lowerTeaType.includes("puerh-shou") || (lowerTeaType.includes("puerh") && lowerTeaType.includes("ripe"))) {
                this.addTime(timeScores, "Afternoon", 10); // Ensure Afternoon gets a boost
            }
            
            // Add more specific type adjustments if needed
        }

        // --- Final Processing ---
        // Remove periods if their score dropped too low (e.g., below 20)
         for (const [time, score] of timeScores.entries()) {
             if (score < 20) {
                 timeScores.delete(time);
             }
         }

        console.log(`Raw Time Scores for tea (${primaryTeaType || 'Unknown'}):`, timeScores); // Log before normalization

        const normalizedScores = this.normalizeTimeScores(timeScores);
        const recommendedTimes = this.getRecommendedTimes(normalizedScores);
        const timeRanges = this.identifyTimeRanges(normalizedScores);

        return {
            recommendations: normalizedScores,
            recommendedTimes,
            idealRanges: timeRanges
        };
    }

    // --- Helper to add score ---
     addTime(scoreMap, time, score) {
         if (!time || !this.timePeriods.includes(time)) return; // Only score defined periods
         const currentScore = scoreMap.get(time) || 0; // Default should be taken care of by init
         scoreMap.set(time, currentScore + score);
     }

    // --- Normalize Scores (Consider revising) ---
     normalizeTimeScores(timeScores) {
         const result = {};
         const scores = [...timeScores.values()];

         if (scores.length === 0) return {}; // Handle empty map

         // Maybe normalize based on a fixed potential range (e.g., 0 to 100 raw) instead of max achieved?
         // Or keep max-based normalization for now.
         const maxScore = Math.max(...scores, 1);
         const minScore = Math.min(...scores, 0); // Get min score

         // If max and min are close, might indicate low differentiation
         // Alternative: Normalize 0-100 based on potential range (e.g. 0 to 100 raw base + adjustments)

         for (const [time, score] of timeScores.entries()) {
             // Option 1: Scale relative to max (current approach)
             // let normalizedScore = Math.max(0, Math.min(Math.round((score / maxScore) * 100), 100));

             // Option 2: Scale relative to observed min/max range
             let normalizedScore = 0;
             if (maxScore > minScore) { // Avoid division by zero if all scores are same
                 normalizedScore = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
             } else if (maxScore > 0) { // If all scores are same and positive
                 normalizedScore = 100;
             }
             normalizedScore = Math.max(0, Math.min(normalizedScore, 100)); // Ensure 0-100 bounds

             result[time] = normalizedScore;
         }
         console.log("Normalized Time Scores:", result); // Log normalized scores
         return result;
     }


    // --- Get Recommended Times (Consider revising threshold or logic) ---
    getRecommendedTimes(normalizedScores) {
         const sortedTimes = Object.entries(normalizedScores)
             .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

         if (sortedTimes.length === 0) {
             return [{ name: "Anytime", score: 50 }]; // Default fallback
         }

         const maxScore = sortedTimes[0][1];
         // Maybe use an absolute threshold AND a relative one?
         // E.g., score >= 70 AND score >= maxScore - 20
         const absoluteThreshold = 65; // Example: Must score at least 65
         const relativeThreshold = 20; // Example: Must be within 20 points of max

         const recommendedTimes = sortedTimes
             .filter(([time, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
             .map(([time, score]) => ({ name: time, score }));

         // Fallback if filtering leaves nothing
         if (recommendedTimes.length === 0) {
              // Return just the top scoring period if no recommendations meet thresholds
              return [{ name: sortedTimes[0][0], score: sortedTimes[0][1] }];
          }

         return recommendedTimes;
     }


    // --- Identify Time Ranges (Keep as is for now) ---
    identifyTimeRanges(normalizedScores) {
         const ranges = [];
         // Use a potentially lower threshold for ranges if needed, or keep config.rangeThreshold
         const threshold = this.config.rangeThreshold;
         const orderedTimes = this.timePeriods.filter(time =>
             normalizedScores[time] !== undefined &&
             normalizedScores[time] >= threshold
         );

         // (Rest of the range logic remains the same as in your code)
         if (orderedTimes.length === 0) return [];
         if (orderedTimes.length === 1) return [{ start: orderedTimes[0], end: orderedTimes[0], score: normalizedScores[orderedTimes[0]] }];

         let rangeStart = orderedTimes[0];
         let currentRange = [rangeStart];
         let previousIndex = this.timePeriods.indexOf(rangeStart);

         for (let i = 1; i < orderedTimes.length; i++) {
             const currentTime = orderedTimes[i];
             const currentIndex = this.timePeriods.indexOf(currentTime);
             if (currentIndex === previousIndex + 1) {
                 currentRange.push(currentTime);
             } else {
                 ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
                 rangeStart = currentTime;
                 currentRange = [rangeStart];
             }
             previousIndex = currentIndex;
         }
         if (currentRange.length > 0) {
             ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
         }
         return ranges;
     }

     // --- Calculate Average Score (Keep as is) ---
     calculateAverageScore(timeRange, normalizedScores) {
         const sum = timeRange.reduce((acc, time) => acc + (normalizedScores[time] || 0), 0);
         return Math.round(sum / timeRange.length);
     }

     // --- Format Time Ranges (Keep as is) ---
     formatTimeRanges(ranges) {
         // (Keep formatting logic as is)
         if (ranges.length === 0) return "No specific time range recommended";
         const sortedRanges = [...ranges].sort((a, b) => b.score - a.score);
         return sortedRanges.map(range => {
             if (range.start === range.end) return `${range.start} (${range.score}%)`;
             return `${range.start} to ${range.end} (${range.score}%)`;
         }).join(', ');
     }
}

// Export the class
export default TimeMatcher;