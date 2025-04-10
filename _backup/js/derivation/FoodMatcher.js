// FoodMatcher.js
// Matches a tea's profile to suitable food pairings and identifies meal-based clusters.
// Enhanced to group related foods into meal/occasion-based clusters

export class FoodMatcher {
    constructor(config = {}) {
        // Configuration options
        this.config = {
            // Minimum score (0-100) required to be included in a recommended cluster
            clusterThreshold: config.clusterThreshold || 70,
            // Maximum number of top foods to return
            maxRecommendations: config.maxRecommendations || 5,
            ...config
        };
        
        // Define food clusters with related items
        this.foodClusters = [
            {
                occasion: "Breakfast",
                foods: ["Breakfast Foods", "Toast", "Oatmeal", "Yogurt", "Fruit Salad", "Pancakes", "Pastries", "Scones", "Eggs", "Breakfast Companion"]
            },
            {
                occasion: "Light Lunch",
                foods: ["Salads", "Sandwiches", "Light Soups", "Steamed Vegetables", "Sushi", "Rice Dishes", "Light Cheese", "Wraps", "Quiche"]
            },
            {
                occasion: "Afternoon Tea",
                foods: ["Pastries", "Light Desserts", "Scones", "Cookies", "Cakes", "Biscuits", "Fruit Tarts", "Madeleines", "Tea Cakes"]
            },
            {
                occasion: "Dinner",
                foods: ["Grilled Meats", "Roasted Vegetables", "Stews", "Rich Soups", "Dark Meats", "Mushrooms", "Root Vegetables", "Fish Dishes", "Hearty Dishes"]
            },
            {
                occasion: "Dessert",
                foods: ["Desserts", "Chocolate", "Light Desserts", "Fruit Desserts", "Ice Cream", "Sorbets", "Sweet Pastries", "Rich Desserts", "Custards"]
            },
            {
                occasion: "Asian Cuisine",
                foods: ["Sushi", "Steamed Rice", "Rice Dishes", "Stir-fried Vegetables", "Tofu", "Miso Soup", "Noodles", "Dumplings", "Thai Curry", "Dim Sum"]
            },
            {
                occasion: "Mediterranean Cuisine",
                foods: ["Olive Oil", "Fresh Herbs", "Cheese", "Grilled Fish", "Salads", "Hummus", "Falafel", "Mediterranean Dishes", "Lamb Dishes"]
            },
            {
                occasion: "Cheese Pairing",
                foods: ["Cheese", "Hard Cheese", "Soft Cheese", "Goat Cheese", "Brie", "Cheddar", "Blue Cheese", "Cheese Plates", "Light Cheese"]
            },
            {
                occasion: "Spiced Foods",
                foods: ["Spiced Cakes", "Curries", "Spiced Dishes", "Thai Curry", "Middle Eastern Sweets", "Spiced Tea Cakes", "Chai Spice Desserts", "Spiced Cookies"]
            }
        ];
    }

    /**
     * Matches the tea's profile to suitable food pairings.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator.
     * @param {object} processingAnalysis - The 'analysis' object from ProcessingCalculator.
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator.
     * @returns {Object} - Results with recommended foods and meal-based clusters
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
            flavorImpact: processingFlavorImpacts = [],
            roastLevel = "None"
        } = processingAnalysis;

        const {
            dominantFlavorCategories: typeFlavorCategories = []
        } = teaTypeAnalysis;

        // Use a Map to track food pairing scores
        const pairingScores = new Map();

        // --- Logic for Food Pairing ---

        // 1. Start with direct hints from FlavorCalculator (derived from reference data)
        flavorFoodHints.forEach(hint => {
            this.addPairing(pairingScores, hint, 6); // High confidence from direct hints
        });

        // 2. Add general pairings based on Dominant Flavor Categories (from both Flavor and TeaType)
        const allCategories = new Set([...dominantFlavorCategories, ...typeFlavorCategories]);
        allCategories.forEach(category => {
            switch (category.toLowerCase()) {
                case 'floral':
                    this.addPairing(pairingScores, "Light Desserts", 2);
                    this.addPairing(pairingScores, "Pastries", 2);
                    this.addPairing(pairingScores, "Fruit Salad", 2);
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
                    this.addPairing(pairingScores, "Sushi", 2);
                    this.addPairing(pairingScores, "Rice Dishes", 2);
                    this.addPairing(pairingScores, "Salads", 2);
                    break;
                case 'nutty/toasty':
                case 'roasted': // Grouping roasted here
                case 'nutty':
                    this.addPairing(pairingScores, "Baked Goods", 2);
                    this.addPairing(pairingScores, "Roasted Vegetables", 2);
                    this.addPairing(pairingScores, "Cheese", 2);
                    this.addPairing(pairingScores, "Light Meats", 2);
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
                    this.addPairing(pairingScores, "Dark Meats", 2);
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
            }
        });

        // 3. Refine based on Mouthfeel (from Processing)
        switch (mouthFeel.toLowerCase()) {
            case 'lighter':
            case 'delicate':
            case 'smooth':
                this.addPairing(pairingScores, "Delicate Foods", 1);
                this.addPairing(pairingScores, "Light Desserts", 1);
                this.addPairing(pairingScores, "Steamed Vegetables", 1);
                // Remove heavy foods
                this.removePairing(pairingScores, "Rich Stews");
                this.removePairing(pairingScores, "Dark Meats");
                break;
            case 'fuller':
            case 'much fuller':
            case 'robust':
            case 'strong':
            case 'thicker':
                this.addPairing(pairingScores, "Richer Foods", 1);
                this.addPairing(pairingScores, "Hearty Dishes", 1);
                this.addPairing(pairingScores, "Dark Meats", 1);
                // Remove lighter foods
                this.removePairing(pairingScores, "Light Salads");
                this.removePairing(pairingScores, "Steamed Vegetables");
                break;
            case 'astringent':
                this.addPairing(pairingScores, "Fatty Foods", 1);
                this.addPairing(pairingScores, "Rich Cheeses", 1);
                break;
            case 'creamy':
                this.addPairing(pairingScores, "Pastries", 1);
                this.addPairing(pairingScores, "Light Desserts", 1);
                break;
        }

        // 4. Refine based on Flavor Intensity
        if (intensityEstimate === "Subtle") {
            this.addPairing(pairingScores, "Subtle Flavored Foods", 1);
            this.addPairing(pairingScores, "White Fish", 1);
            // Remove strongly flavored foods
            this.removePairing(pairingScores, "Spicy Dishes");
            this.removePairing(pairingScores, "Curries");
        } else if (intensityEstimate === "Pronounced") {
            this.addPairing(pairingScores, "Bold Flavored Foods", 1);
            this.addPairing(pairingScores, "Strong Cheese", 1);
            // Remove delicate foods
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
        });
        
        // Modification 4.2: Adjust based on roast level
        if (roastLevel === "Heavy" || roastLevel === "Medium") {
            this.addPairing(pairingScores, "Roasted Nuts", 5);
            this.addPairing(pairingScores, "Dark Chocolate", 4);
            this.addPairing(pairingScores, "Grilled Meats", 4);
            this.addPairing(pairingScores, "Spiced Foods", 3);
            this.addPairing(pairingScores, "Hard Cheese", 3);
            this.addPairing(pairingScores, "Baked Goods", 3);
            this.addPairing(pairingScores, "Root Vegetables", 2);
        }

        // Process the results
        const normalizedScores = this.normalizeFoodScores(pairingScores);
        console.log("Normalized Food Scores for Clustering:", JSON.stringify(normalizedScores, null, 2)); // <--- ADD THIS LOG

        const recommendedFoods = this.getRecommendedFoods(normalizedScores);
        const mealClusters = this.identifyMealClusters(normalizedScores);

        return {
            recommendations: normalizedScores,
            recommendedFoods,
            mealClusters
        };
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
     * Normalize the food scores to a 0-100 scale
     * @param {Map} foodScores - Map of raw food scores
     * @returns {Object} - Object with food names as keys and normalized scores as values
     */
    normalizeFoodScores(foodScores) {
        const result = {};
        
        // Handle empty scores
        if (foodScores.size === 0) {
            return { "Versatile - pairs with many foods": 50 };
        }
        
        // Find maximum score for normalization
        const scores = [...foodScores.values()];
        const maxScore = Math.max(...scores, 1); // Prevent division by zero
        
        // Convert scores to 0-100 scale
        for (const [food, score] of foodScores.entries()) {
            // Scale to 0-100, with max raw score mapping to 100
            result[food] = Math.min(Math.round((score / maxScore) * 100), 100);
        }
        
        return result;
    }
    
    /**
     * Get recommended foods based on normalized scores
     * @param {Object} normalizedScores - Object with normalized food scores
     * @returns {Array} - Array of recommended food objects with name and score
     */
    getRecommendedFoods(normalizedScores) {
        // Sort by score descending
        const sortedFoods = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Get top foods (within 10 points of maximum)
        if (sortedFoods.length === 0) {
            return [{ name: "Versatile - pairs with many foods", score: 50 }];
        }
        
        const maxScore = sortedFoods[0][1];
        const threshold = 10; // Foods within 10 points of max score
        
        // Include foods that are close to the maximum score
        const topFoods = sortedFoods
            .filter(([food, score]) => score >= maxScore - threshold)
            .map(([food, score]) => ({ name: food, score }));
        
        // Limit to configured maximum number of recommendations
        return topFoods.slice(0, this.config.maxRecommendations);
    }
    
    /**
     * Identify clusters of related foods (meal occasions)
     * @param {Object} normalizedScores - Object with normalized food scores
     * @returns {Array} - Array of meal cluster objects
     */
    identifyMealClusters(normalizedScores) {
        const result = [];
        const threshold = this.config.clusterThreshold || 70;
        console.log(`--- Identifying Meal Clusters (Threshold: ${threshold}) ---`); // Log start
 
        
        // Process each predefined cluster
        this.foodClusters.forEach(cluster => {
            console.log(`Checking Cluster: ${cluster.occasion}`); // Log current cluster

            const matchingFoods = [];
            let totalScore = 0;
            
            // Find foods in this cluster that have scores
            cluster.foods.forEach(food => {
                const score = normalizedScores[food];
                console.log(`  - Checking: "${food}" | Score Found: ${score} | Meets Threshold? ${score >= threshold}`); // Check this log

                if (normalizedScores[food] !== undefined && 
                    normalizedScores[food] >= this.config.clusterThreshold) {
                        console.log(`    --> MATCH! Adding "<span class="math-inline">\{food\}" \(</span>{score})`); // Check this log
                        
                        matchingFoods.push({
                        name: food,
                        score: normalizedScores[food]
                    });
                    totalScore += normalizedScores[food];
                }
            });
            console.log(`  Cluster "${cluster.occasion}" - Found ${matchingFoods.length} foods >= threshold.`); // You likely saw this if the inner loop finished

            // Only include clusters with enough matching foods
            if (matchingFoods.length >= 2) {
                // Sort foods by score
                matchingFoods.sort((a, b) => b.score - a.score);
                
                // Calculate average score for the cluster
                const avgScore = Math.round(totalScore / matchingFoods.length);
                
                result.push({
                    occasion: cluster.occasion,
                    foods: matchingFoods,
                    score: avgScore
                });
            }
        });
        
        // Sort clusters by score
        result.sort((a, b) => b.score - a.score);
        
        return result;
    }
    
    /**
     * Format the meal clusters for display
     * @param {Array} clusters - Array of cluster objects
     * @returns {string} - Formatted display string
     */
    formatMealClusters(clusters) {
        if (clusters.length === 0) {
            return "No specific meal clusters recommended";
        }
        
        // Sort clusters by score
        const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
        
        // Format each cluster
        return sortedClusters.map(cluster => {
            const foodNames = cluster.foods.map(f => f.name).join(", ");
            return `${cluster.occasion} (${cluster.score}%): ${foodNames}`;
        }).join('\n');
    }
    
    /**
     * Generate a description of recommended foods and clusters
     * @param {Object} results - Results from matchFood
     * @param {string} teaName - Name of the tea
     * @returns {string} - Human-readable description
     */
    generateFoodDescription(results, teaName) {
        const { recommendedFoods, mealClusters } = results;
        
        if (recommendedFoods.length === 0) {
            return `${teaName} is versatile and pairs well with a wide variety of foods.`;
        }
        
        let description = `${teaName} pairs especially well with `;
        
        // Add top foods
        if (recommendedFoods.length === 1) {
            description += `${recommendedFoods[0].name.toLowerCase()} (${recommendedFoods[0].score}% match).`;
        } else if (recommendedFoods.length === 2) {
            description += `${recommendedFoods[0].name.toLowerCase()} (${recommendedFoods[0].score}%) and ${recommendedFoods[1].name.toLowerCase()} (${recommendedFoods[1].score}%).`;
        } else {
            const lastFood = recommendedFoods[recommendedFoods.length - 1];
            const topFoods = recommendedFoods.slice(0, -1).map(f => `${f.name.toLowerCase()} (${f.score}%)`).join(', ');
            description += `${topFoods}, and ${lastFood.name.toLowerCase()} (${lastFood.score}%).`;
        }
        
        // Add meal cluster information if available
        if (mealClusters.length > 0) {
            const topCluster = mealClusters[0];
            description += ` It's an excellent choice for "${topCluster.occasion}" (${topCluster.score}% match).`;
        }
        
        return description;
    }
}

// Export the class
export default FoodMatcher;