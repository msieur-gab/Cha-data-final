// FoodMatcher.js
// Matches a tea's profile to suitable food pairings.

export class FoodMatcher {
    constructor(config = {}) {
        // Config options could include pairing rules, databases, etc.
        this.config = config;
    }

    /**
     * Matches the tea's profile to suitable food pairings.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator.
     * Expected: foodPairingHints, identifiedFlavors, dominantFlavorCategories, intensityEstimate.
     * @param {object} processingAnalysis - The 'analysis' object from ProcessingCalculator.
     * Expected: mouthFeel, flavorImpact.
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator.
     * Expected: dominantFlavorCategories (as baseline).
     * @returns {Array<object>} - An array of suggested food pairing objects with name and score.
     */
    matchFood(flavorAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}) {

        const {
            foodPairingHints: flavorFoodHints = [],
            identifiedFlavors = [],
            dominantFlavorCategories = [],
            intensityEstimate = "Moderate"
        } = flavorAnalysis;

        const {
            mouthFeel = "medium", // Defaulting mouthFeel if not present
            flavorImpact: processingFlavorImpacts = []
        } = processingAnalysis;

        const {
            dominantFlavorCategories: typeFlavorCategories = []
        } = teaTypeAnalysis;

        // Use a Map to track food pairing scores
        const pairingScores = new Map();

        // --- Logic for Food Pairing ---

        // 1. Start with direct hints from FlavorCalculator (derived from reference data)
        flavorFoodHints.forEach(hint => {
            this.addPairing(pairingScores, hint, 3); // High confidence from direct hints
        });

        // 2. Add general pairings based on Dominant Flavor Categories (from both Flavor and TeaType)
        const allCategories = new Set([...dominantFlavorCategories, ...typeFlavorCategories]);
        allCategories.forEach(category => {
            switch (category.toLowerCase()) {
                case 'floral':
                    this.addPairing(pairingScores, "Light Desserts", 2);
                    this.addPairing(pairingScores, "Pastries", 2);
                    this.addPairing(pairingScores, "Fruit Salads", 2);
                    break;
                case 'fruity':
                case 'citrus':
                    this.addPairing(pairingScores, "Salads", 2);
                    this.addPairing(pairingScores, "Chicken", 2);
                    this.addPairing(pairingScores, "Seafood", 2);
                    this.addPairing(pairingScores, "Light Cheese", 2);
                    break;
                case 'vegetal':
                case 'marine':
                case 'grassy':
                    this.addPairing(pairingScores, "Steamed Vegetables", 2);
                    this.addPairing(pairingScores, "Sushi/Sashimi", 2);
                    this.addPairing(pairingScores, "Rice Dishes", 2);
                    this.addPairing(pairingScores, "Salads", 2);
                    break;
                case 'nutty/toasty':
                case 'roasted': // Grouping roasted here
                case 'nutty':
                    this.addPairing(pairingScores, "Baked Goods", 2);
                    this.addPairing(pairingScores, "Roasted Vegetables", 2);
                    this.addPairing(pairingScores, "Cheese", 2);
                    this.addPairing(pairingScores, "Light Meats (Pork/Chicken)", 2);
                    break;
                case 'spicy':
                    this.addPairing(pairingScores, "Spiced Cakes", 2);
                    this.addPairing(pairingScores, "Rich Stews", 2);
                    this.addPairing(pairingScores, "Curries", 2);
                    this.addPairing(pairingScores, "Grilled Meats", 2);
                    break;
                case 'sweet': // Includes honey, caramel, malt, chocolate
                case 'chocolate':
                case 'malt':
                    this.addPairing(pairingScores, "Desserts", 2);
                    this.addPairing(pairingScores, "Pastries", 2);
                    this.addPairing(pairingScores, "Breakfast Foods", 2);
                    this.addPairing(pairingScores, "Fruits", 2);
                    break;
                case 'earthy/mineral':
                case 'earthy':
                case 'mineral':
                case 'aged/earthy': // Grouping aged puerh-like flavors
                    this.addPairing(pairingScores, "Mushrooms", 2);
                    this.addPairing(pairingScores, "Root Vegetables", 2);
                    this.addPairing(pairingScores, "Dark Meats (Beef/Lamb)", 2);
                    this.addPairing(pairingScores, "Rich Stews", 2);
                    break;
                case 'woody':
                    this.addPairing(pairingScores, "Smoked Foods", 2);
                    this.addPairing(pairingScores, "Grilled Meats", 2);
                    this.addPairing(pairingScores, "Hard Cheese", 2);
                    break;
                case 'umami/marine':
                case 'umami':
                    this.addPairing(pairingScores, "Seafood", 2);
                    this.addPairing(pairingScores, "Sushi", 2);
                    this.addPairing(pairingScores, "Savory Dishes", 2);
                    this.addPairing(pairingScores, "Miso Soup", 2);
                    break;
                // Add more category mappings
            }
        });

        // 3. Refine based on Mouthfeel (from Processing)
        switch (mouthFeel.toLowerCase()) {
            case 'lighter':
            case 'delicate':
            case 'smooth':
                this.addPairing(pairingScores, "Delicate Foods", 1);
                // Maybe remove hints for very heavy foods if present?
                this.removePairing(pairingScores, "Rich Stews");
                this.removePairing(pairingScores, "Dark Meats (Beef/Lamb)");
                break;
            case 'fuller':
            case 'much fuller':
            case 'robust':
            case 'strong':
            case 'thicker':
                this.addPairing(pairingScores, "Richer Foods", 1);
                this.addPairing(pairingScores, "Hearty Dishes", 1);
                // Maybe remove hints for very delicate foods?
                this.removePairing(pairingScores, "Light Salads");
                this.removePairing(pairingScores, "Steamed Vegetables");
                break;
             case 'astringent':
                 this.addPairing(pairingScores, "Fatty Foods (cuts through)", 1);
                 break;
             case 'creamy':
                 this.addPairing(pairingScores, "Pastries", 1);
                 this.addPairing(pairingScores, "Light Desserts", 1);
                 break;
        }

        // 4. Refine based on Flavor Intensity
        if (intensityEstimate === "Subtle") {
             this.addPairing(pairingScores, "Subtle Flavored Foods", 1);
             // Remove hints for very strong foods
             this.removePairing(pairingScores, "Spicy Dishes");
             this.removePairing(pairingScores, "Curries");
        } else if (intensityEstimate === "Pronounced") {
             this.addPairing(pairingScores, "Bold Flavored Foods", 1);
             // Remove hints for very delicate foods
             this.removePairing(pairingScores, "Steamed Vegetables");
        }

        // 5. Consider processing flavor impacts (e.g., if roasting added nutty notes)
         processingFlavorImpacts.forEach(impact => {
             if(impact.includes("nutty")) {
                 this.addPairing(pairingScores, "Baked Goods", 1);
                 this.addPairing(pairingScores, "Cheese", 1);
             }
             if(impact.includes("caramel")) {
                 this.addPairing(pairingScores, "Desserts", 1);
             }
             if(impact.includes("smoky")) {
                 this.addPairing(pairingScores, "Smoked Foods", 1);
                 this.addPairing(pairingScores, "BBQ", 1);
             }
             // Add more based on possible impacts
         });

        // Add debugging log
        console.log("Food pairing scores:", Object.fromEntries(pairingScores));

        // --- Select top food pairings ---
        const sortedPairings = [...pairingScores.entries()]
            .sort((a, b) => b[1] - a[1]); // Sort by score descending

        let finalPairings = [];
        if (sortedPairings.length > 0) {
            const maxScore = sortedPairings[0][1];
            const threshold = 1; // Pairings within 1 point of max score

            // Filter to only include pairings with scores close to the max
            finalPairings = sortedPairings
                .filter(([pairing, score]) => score >= maxScore - threshold)
                // Changed to return objects with name and score instead of just names
                .map(([pairing, score]) => ({ name: pairing, score: this.normalizeScore(score) }));

            // Limit to a reasonable number of suggestions
            if (finalPairings.length > 7) {
                finalPairings = finalPairings.slice(0, 7);
            }
        }

        // Simple filtering: remove very generic terms if specific ones exist
        if (finalPairings.some(p => p.name === "Desserts") && finalPairings.some(p => p.name === "Light Desserts")) {
             finalPairings = finalPairings.filter(p => p.name !== "Desserts");
        }
        if (finalPairings.some(p => p.name === "Richer Foods") && finalPairings.some(p => p.name === "Dark Meats (Beef/Lamb)")) {
             finalPairings = finalPairings.filter(p => p.name !== "Richer Foods");
        }

        if (finalPairings.length === 0) {
             finalPairings = [{ name: "Versatile - pairs with many foods", score: 50 }];
        }

        return finalPairings;
    }

    /**
     * Helper to add a food pairing with a score
     * @param {Map} scoreMap - Map tracking pairing scores
     * @param {string} pairing - Food pairing to add
     * @param {number} score - Score to assign
     */
    addPairing(scoreMap, pairing, score) {
        if (!pairing) return;
        const currentScore = scoreMap.get(pairing) || 0;
        scoreMap.set(pairing, currentScore + score);
    }

    /**
     * Helper to remove a food pairing
     * @param {Map} scoreMap - Map tracking pairing scores
     * @param {string} pairing - Food pairing to remove
     */
    removePairing(scoreMap, pairing) {
        if (!pairing) return;
        scoreMap.delete(pairing);
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

    // --- Optional: Add format/serialize methods ---
}

// Export the class
export default FoodMatcher;