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
        
        // Define food groups
        this.foodGroups = [
            "Proteins", "Cheeses", "Fruits", "Salads", "Desserts", "Delicate Desserts", 
            "Salty Foods", "Bold Flavors", "Spicy Foods", "Delicate Flavors",
            "Breakfast Foods", "Light Soups", "Pastries", "Light Desserts", "Grilled Meats",
            "Roasted Vegetables", "Chocolate", "Asian Foods", "Mediterranean Foods"
        ];
        
        // Define mapping from flavor categories to food groups
        this.flavorCategoryToFoodGroups = {
            "floral": ["Light Desserts", "Fruits", "Pastries", "Delicate Desserts"],
            "fruity": ["Fruits", "Salads", "Light Desserts", "Desserts"],
            "dark_fruits": ["Dark Chocolate", "Game Meats", "Roasted Meats", "Rich Stews", "Spiced Desserts"],
            "citrus": ["Seafood", "Salads", "Light Cheese", "Chicken"],
            "vegetal": ["Steamed Vegetables", "Salads", "Rice Dishes", "Light Soups"],
            "leafy": ["Salads", "Steamed Vegetables", "Light Soups"],
            "herbaceous": ["Salads", "Grilled Vegetables", "Cheese", "Mediterranean Foods"],
            "nutty_and_toasty": ["Baked Goods", "Cheese", "Roasted Vegetables", "Roasted Nuts"],
            "nutty": ["Baked Goods", "Cheese", "Roasted Vegetables", "Roasted Nuts"],
            "toasty": ["Baked Goods", "Roasted Vegetables", "Grilled Meats", "Breakfast Foods"],
            "roasted": ["Grilled Meats", "Roasted Vegetables", "Dark Chocolate", "Roasted Nuts", "Rich Stews"],
            "coffee_chicory": ["Dark Chocolate", "Desserts", "Baked Goods", "Coffee"],
            "smoky": ["Smoked Foods", "Grilled Meats", "BBQ", "Strong Cheese"],
            "spicy": ["Spiced Cakes", "Curries", "Spiced Dishes", "Spiced Foods"],
            "pungent": ["Spiced Foods", "Curries", "Rich Desserts", "Spiced Cakes"],
            "cooling": ["Fruits", "Chocolate", "Yogurt", "Light Desserts"],
            "sweet": ["Desserts", "Pastries", "Fruits", "Sweet Pastries"],
            "caramel": ["Desserts", "Baked Goods", "Nuts", "Dark Chocolate", "Ice Cream"],
            "chocolate": ["Chocolate", "Rich Desserts", "Pastries", "Dark Chocolate", "Berries"],
            "malt": ["Breakfast Foods", "Baked Goods", "Cereal", "Hard Cheese"],
            "earthy": ["Mushrooms", "Root Vegetables", "Dark Meats", "Stews", "Grilled Meats"],
            "aged": ["Rich Foods", "Game Meats", "Dark Chocolate", "Mushrooms", "Root Vegetables"],
            "soil": ["Mushrooms", "Root Vegetables", "Hearty Soups", "Dark Meats"],
            "mineral": ["Seafood", "Light Cheese", "Roasted Vegetables", "Shellfish"],
            "woody": ["Smoked Foods", "Grilled Meats", "Hard Cheese", "Root Vegetables", "Dark Chocolate"],
            "umami": ["Seafood", "Mushrooms", "Savory Dishes", "Rice Dishes"],
            "marine": ["Seafood", "Sushi", "Rice Dishes", "Light Vegetables"],
            "meaty": ["Savory Soups", "Stews", "Mushrooms", "Rich Dishes", "Dark Meats"]
        };
        
        // Define mapping from individual flavors to specific foods
        this.flavorToSpecificFoods = {
            // Floral
            "jasmine": ["Delicate Desserts", "Light Fruits", "Mild Cheese", "Steamed Fish", "Rice"],
            "rose": ["Pastries", "Middle Eastern Sweets", "Fruit Salads", "Yogurt"],
            "orchid": ["Creamy Desserts", "Light Cakes", "Tropical Fruit", "Subtle Pastries"],
            "lilac": ["Spring Salads", "Light Fruit Tarts", "Madeleines"],
            "osmanthus": ["Apricot Pastries", "Moon Cakes", "Jellies", "Light Cookies"],
            "honeysuckle": ["Fruit Salads", "Light Cakes", "Sorbets"],
            
            // Fruity
            "apple": ["Cinnamon Baked Goods", "Caramel", "Pork", "Cheese"],
            "citrus": ["Seafood", "Light Salads", "Berries", "Chicken"],
            "lemon": ["Seafood", "Light Desserts", "Salads", "Chicken"],
            "orange": ["Chocolate", "Duck", "Game", "Spiced Foods"],
            "berry": ["Desserts", "Yogurt", "Breakfast Foods", "Chocolate"],
            "strawberry": ["Cream", "Chocolate", "Vanilla Desserts"],
            "raspberry": ["Dark Chocolate", "Vanilla", "Almonds"],
            "blackberry": ["Game Meats", "Dark Chocolate", "Spiced Desserts"],
            "black currant": ["Game Meats", "Dark Chocolate", "Sharp Cheese"],
            "cherry": ["Dark Chocolate", "Almonds", "Soft Cheese", "Duck"],
            "plum": ["Duck", "Game Meats", "Cinnamon", "Spiced Desserts"],
            "raisin": ["Cinnamon", "Baked Goods", "Spiced Desserts"],
            "fig": ["Blue Cheese", "Prosciutto", "Honey", "Walnuts"],
            
            // Vegetal
            "spinach": ["Creamy Soups", "Eggs", "Light Cheese", "Nuts"],
            "grass": ["Seafood", "Light Vegetables", "Fresh Herbs"],
            "seaweed": ["Sushi", "Rice", "Seafood", "Mild Fish"],
            "mint": ["Chocolate", "Lamb", "Light Desserts", "Fruits"],
            
            // Nutty & Toasty
            "almond": ["Berries", "Chocolate", "Stone Fruits", "Honey"],
            "hazelnut": ["Chocolate", "Coffee", "Cream", "Berries"],
            "walnut": ["Blue Cheese", "Pears", "Maple", "Honey"],
            "peanut": ["Chocolate", "Caramel", "Asian Sauces"],
            "toast": ["Butter", "Jams", "Breakfast Foods"],
            
            // Spices
            "cinnamon": ["Baked Goods", "Apples", "Sweet Pastries", "Pumpkin"],
            "clove": ["Baked Ham", "Pumpkin", "Spiced Desserts"],
            "ginger": ["Asian Dishes", "Shellfish", "Spiced Desserts", "Pumpkin"],
            "pepper": ["Meats", "Aged Cheese", "Rich Dishes"],
            "anise": ["Shellfish", "Cookies", "Mediterranean Dishes"],
            
            // Sweet
            "caramel": ["Apples", "Ice Cream", "Nuts", "Dark Chocolate", "Cream"],
            "chocolate": ["Dark Chocolate", "Raspberries", "Cherries", "Coffee", "Nuts"],
            "cocoa": ["Berries", "Citrus", "Coffee", "Cream"],
            "honey": ["Yogurt", "Nuts", "Fruits", "Cheese", "Tea Cakes"],
            "malt": ["Breakfast Cereals", "Milk Chocolate", "Baked Goods"],
            
            // Earthy
            "petrichor": ["Mushrooms", "Root Vegetables", "Herbal Dishes"],
            "loam": ["Mushrooms", "Truffles", "Hearty Stews"],
            "leather": ["Game Meats", "Rich Stews", "Dark Chocolate"],
            "camphor": ["Asian Foods", "Spicy Dishes", "Lamb"],
            
            // Woody
            "wood": ["Smoked Foods", "Grilled Meats", "Hard Cheese"],
            "cedar": ["Smoked Salmon", "Game Meats", "Hard Cheese"],
            "pine": ["Game Meats", "Roasted Nuts", "Dark Chocolate"],
            
            // Roasted
            "roasted": ["Grilled Meats", "Dark Chocolate", "Roasted Nuts", "Rich Stews"],
            "smoke": ["Smoked Meats", "BBQ", "Dark Chocolate", "Strong Cheese"],
            "coffee": ["Dark Chocolate", "Caramel", "Cream", "Nuts"],
            "espresso": ["Dark Chocolate", "Caramel", "Vanilla", "Cream"],
            
            // Umami
            "umami": ["Mushrooms", "Aged Cheese", "Soy Sauce", "Rich Meats"],
            "broth": ["Noodles", "Light Meats", "Vegetables"],
            "seaweed": ["Sushi", "Rice", "Light Fish"],
            "brine": ["Olives", "Capers", "Preserved Foods", "Feta"]
        };
    }

    /**
     * Helper to add score to a food with tracing
     */
    addFoodWithTrace(trace, scoreMap, food, score, reasonStep, reasonDetail) {
        if (!food) return; // Skip undefined or empty foods
        const currentScore = scoreMap.get(food) || 0;
        const newScore = currentScore + score;
        scoreMap.set(food, newScore);
        
        trace.push({
            step: reasonStep,
            reason: reasonDetail,
            adjustment: `${score >= 0 ? '+' : ''}${score} ${food}`,
            value: newScore
        });
    }

    /**
     * Match the tea to various foods.
     * @param {Object} flavorAnalysis - Analysis object from FlavorCalculator.
     * @param {Object} processingAnalysis - Analysis object from ProcessingCalculator.
     * @param {Object} teaTypeAnalysis - Analysis object from TeaTypeCalculator.
     * @returns {Object} - Results with recommending food pairings.
     */
    matchFood(flavorAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}) {
        // Initialize the trace array
        let trace = [];
        
        trace.push({
            step: "Input Processing",
            reason: "Analyzing input data",
            adjustment: "Processing flavor, processing, and tea type data",
            value: `Flavor data: ${flavorAnalysis ? 'present' : 'missing'}, Processing data: ${processingAnalysis ? 'present' : 'missing'}, Tea type data: ${teaTypeAnalysis ? 'present' : 'missing'}`
        });
        
        // Extract data from flavor analysis - ensure we handle all possible structures
        const flavorHints = Array.from(flavorAnalysis?.analysis?.foodPairingHints || 
                                      flavorAnalysis?.foodPairingHints || []);
        const seasonalAffinity = Array.from(flavorAnalysis?.analysis?.seasonalAffinityHints || 
                                           flavorAnalysis?.seasonalAffinityHints || []);
        
        // Access raw flavor data - check all possible paths
        const rawFlavorInput = flavorAnalysis?.flavorProfile || 
                              flavorAnalysis?.identifiedFlavors || 
                              flavorAnalysis?.profile?.identified ||
                              flavorAnalysis?.profile?.flavors ||
                              flavorAnalysis?.flavors || [];
        
        // Access dominant flavors - check all possible paths
        const dominantFlavors = flavorAnalysis?.profile?.dominant || 
                               flavorAnalysis?.dominantFlavors ||
                               flavorAnalysis?.dominant || [];
        
        // Access flavor categories - check all possible paths
        const dominantFlavorCategories = flavorAnalysis?.profile?.categories || 
                                         flavorAnalysis?.profile?.dominantFlavorCategories || 
                                         flavorAnalysis?.dominantFlavorCategories ||
                                         flavorAnalysis?.categories || [];
        
        // Get the actual flavors to process - prefer dominant flavors but fall back to all identified flavors
        const flavorsToProcess = dominantFlavors.length > 0 ? dominantFlavors : rawFlavorInput;
        
        // Access flavor intensity
        const flavorIntensity = flavorAnalysis?.profile?.intensity || 
                               flavorAnalysis?.intensityEstimate ||
                               flavorAnalysis?.intensity || "Medium";
        
        trace.push({
            step: "Data Extraction (Flavor)",
            reason: "Extracting key data from flavor analysis",
            adjustment: `Found ${flavorHints.length} food hints, ${seasonalAffinity.length} seasonal hints, ${flavorsToProcess.length} total flavors (${dominantFlavors.length} dominant), ${dominantFlavorCategories.length} categories`,
            value: `Intensity: ${flavorIntensity}, Flavors: ${flavorsToProcess.join(', ')}, Categories: ${dominantFlavorCategories.join(', ')}`
        });
        
        // Extract data from processing analysis
        const processingHints = Array.from(processingAnalysis?.analysis?.foodPairingHints || []);
        const mouthfeel = processingAnalysis?.mouthfeelDescriptors || [];
        const roastLevel = processingAnalysis?.roastLevel || "None";
        
        trace.push({
            step: "Data Extraction (Processing)",
            reason: "Extracting key data from processing analysis",
            adjustment: `Found ${processingHints.length} food hints, ${mouthfeel.length} mouthfeel descriptors`,
            value: `Mouthfeel descriptors: ${mouthfeel.join(', ')}, Roast level: ${roastLevel}`
        });
        
        // Extract data from tea type analysis
        const teaTypeHints = Array.from(teaTypeAnalysis?.analysis?.foodPairingHints || []);
        const teaType = teaTypeAnalysis?.type;
        
        trace.push({
            step: "Data Extraction (Tea Type)",
            reason: "Extracting key data from tea type analysis",
            adjustment: `Found ${teaTypeHints.length} food hints`,
            value: `Tea type: ${teaType || 'Unknown'}`
        });
        
        // Initialize the baseline scores for all food pairings
        const foodScores = new Map();
        
        trace.push({
            step: "Score Initialization",
            reason: "Setting up scoring map",
            adjustment: "Ready to compute food pairings",
            value: "Empty score map created"
        });
        
        // --- Process flavor hints ---
        if (flavorHints.length > 0) {
            trace.push({
                step: "Processing Flavor Hints",
                reason: `${flavorHints.length} flavor hints to process`,
                adjustment: "Beginning flavor hint processing",
                value: flavorHints.join(', ')
            });
            
            flavorHints.forEach(hint => {
                // Handle food groups
                if (!this.isFood(hint)) {
                    const groupFoods = this.foodsInGroup(hint);
                    trace.push({
                        step: "Food Group Processing",
                        reason: `Expanding food group: ${hint}`,
                        adjustment: `Found ${groupFoods.length} foods in group`,
                        value: groupFoods.join(', ')
                    });
                    
                    groupFoods.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 15, "Flavor Group", `From group ${hint}`);
                    });
                } else {
                    // Direct food pairing
                    this.addFoodWithTrace(trace, foodScores, hint, 20, "Direct Flavor Pairing", `Explicit hint: ${hint}`);
                }
            });
        }
        
        // --- Process flavor categories to food mappings ---
        if (dominantFlavorCategories.length > 0) {
            trace.push({
                step: "Processing Flavor Categories",
                reason: `${dominantFlavorCategories.length} flavor categories to process`,
                adjustment: "Mapping categories to food groups",
                value: dominantFlavorCategories.join(', ')
            });
            
            dominantFlavorCategories.forEach(category => {
                const categoryFoodGroups = this.flavorCategoryToFoodGroups[category.toLowerCase()] || [];
                if (categoryFoodGroups.length > 0) {
                    trace.push({
                        step: "Category-Food Group Mapping",
                        reason: `Mapping category: ${category}`,
                        adjustment: `Found ${categoryFoodGroups.length} food groups`,
                        value: categoryFoodGroups.join(', ')
                    });
                    
                    categoryFoodGroups.forEach(foodGroup => {
                        const groupFoods = this.foodsInGroup(foodGroup);
                        
                        trace.push({
                            step: "Category Group Expansion",
                            reason: `From category '${category}' to group '${foodGroup}'`,
                            adjustment: `Found ${groupFoods.length} foods in group`,
                            value: groupFoods.join(', ')
                        });
                        
                        groupFoods.forEach(food => {
                            this.addFoodWithTrace(trace, foodScores, food, 20, "Category-Based Pairing", `From category '${category}' → group '${foodGroup}'`);
                        });
                    });
                }
            });
        }
        
        // --- Process raw flavors directly if needed ---
        // This ensures flavor profiles like Gyokuro (umami, marine, sweet, grass, seaweed) are properly handled
        if (rawFlavorInput.length > 0) {
            const uniqueRawFlavors = new Set(rawFlavorInput.map(f => f.toLowerCase()));
            
            // Special check for flavor profiles like Gyokuro
            const knownGreenTeaFlavors = ['umami', 'marine', 'sweet', 'grass', 'seaweed', 'vegetal', 'green'];
            const matchedSpecialFlavors = [...uniqueRawFlavors].filter(f => knownGreenTeaFlavors.includes(f));
            
            if (matchedSpecialFlavors.length > 0) {
                trace.push({
                    step: "Special Flavor Profile Detection",
                    reason: `Detected ${matchedSpecialFlavors.length} special green tea flavors`,
                    adjustment: "Applying special treatment for green tea flavor profile",
                    value: matchedSpecialFlavors.join(', ')
                });
                
                // Boost Japanese food pairings for umami/marine notes
                if (matchedSpecialFlavors.some(f => ['umami', 'marine', 'seaweed'].includes(f))) {
                    const japanesePairings = ["Sushi", "Rice", "Seafood", "Light Fish", "Miso Soup", "Rice Dishes", "Steamed Vegetables"];
                    
                    trace.push({
                        step: "Japanese Food Boost",
                        reason: "Umami/marine/seaweed notes detected",
                        adjustment: `Boosting ${japanesePairings.length} Japanese food pairings`,
                        value: japanesePairings.join(', ')
                    });
                    
                    japanesePairings.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 30, "Special Profile", "Perfect match for umami/marine tea notes");
                    });
                }
                
                // Handle vegetal/grass notes
                if (matchedSpecialFlavors.some(f => ['grass', 'vegetal', 'green'].includes(f))) {
                    const freshPairings = ["Fresh Vegetables", "Light Salads", "Cucumber", "Steamed Rice", "Light Fish"];
                    
                    trace.push({
                        step: "Fresh Food Boost",
                        reason: "Grass/vegetal notes detected",
                        adjustment: `Boosting ${freshPairings.length} fresh food pairings`,
                        value: freshPairings.join(', ')
                    });
                    
                    freshPairings.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 25, "Special Profile", "Complements grassy/vegetal notes");
                    });
                }
                
                // Handle sweet notes
                if (matchedSpecialFlavors.some(f => ['sweet'].includes(f))) {
                    const sweetBalancers = ["Light Desserts", "Fruit Tarts", "Rice Dishes", "Vanilla Desserts"];
                    
                    trace.push({
                        step: "Sweet Counterpart Boost",
                        reason: "Sweet notes detected",
                        adjustment: `Boosting ${sweetBalancers.length} sweet-complementing foods`,
                        value: sweetBalancers.join(', ')
                    });
                    
                    sweetBalancers.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 20, "Special Profile", "Enhances sweet tea notes");
                    });
                }
            }
        }
        
        // --- Process flavor to specific foods ---
        if (flavorsToProcess.length > 0) {
            trace.push({
                step: "Processing Flavor Mappings",
                reason: `${flavorsToProcess.length} flavors to process`,
                adjustment: "Mapping flavors to specific foods",
                value: flavorsToProcess.join(', ')
            });
            
            flavorsToProcess.forEach(flavor => {
                const flavorLower = flavor.toLowerCase();
                const specificFoods = this.flavorToSpecificFoods[flavorLower] || [];
                
                if (specificFoods.length > 0) {
                    trace.push({
                        step: "Flavor-Food Mapping",
                        reason: `Mapping flavor: ${flavor}`,
                        adjustment: `Found ${specificFoods.length} specific food pairings`,
                        value: specificFoods.join(', ')
                    });
                    
                    specificFoods.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 25, "Flavor-Specific Pairing", `From flavor: ${flavor}`);
                    });
                } else {
                    // Try category lookup for unmapped flavors
                    let categoryFound = false;
                    
                    // Check the flavor against known category members
                    Object.entries(this.flavorCategoryToFoodGroups).forEach(([category, foodGroups]) => {
                        // Simple approach to check if flavor might belong to a category
                        if (this.mightBelongToCategory(flavorLower, category)) {
                            categoryFound = true;
                            
                            trace.push({
                                step: "Category Inference",
                                reason: `No direct mapping for '${flavor}'`,
                                adjustment: `Inferring category '${category}' for unmapped flavor`,
                                value: `Using food groups: ${foodGroups.join(', ')}`
                            });
                            
                            foodGroups.forEach(foodGroup => {
                                const foods = this.foodsInGroup(foodGroup);
                                foods.forEach(food => {
                                    this.addFoodWithTrace(trace, foodScores, food, 15, "Category Inference", `Inferred ${category} → ${foodGroup} for ${flavor}`);
                                });
                            });
                        }
                    });
                    
                    if (!categoryFound) {
                        trace.push({
                            step: "Unmapped Flavor",
                            reason: `No mapping found for flavor: ${flavor}`,
                            adjustment: "No direct food pairings available",
                            value: "Skipped"
                        });
                    }
                }
            });
        }
        
        // --- Process processing hints ---
        if (processingHints.length > 0) {
            trace.push({
                step: "Processing Method Hints",
                reason: `${processingHints.length} processing hints to process`,
                adjustment: "Beginning processing hint evaluation",
                value: processingHints.join(', ')
            });
            
            processingHints.forEach(hint => {
                if (!this.isFood(hint)) {
                    const groupFoods = this.foodsInGroup(hint);
                    trace.push({
                        step: "Processing Group Expansion",
                        reason: `Expanding processing group: ${hint}`,
                        adjustment: `Found ${groupFoods.length} foods in group`,
                        value: groupFoods.join(', ')
                    });
                    
                    groupFoods.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 10, "Processing Group", `From processing group: ${hint}`);
                    });
                } else {
                    this.addFoodWithTrace(trace, foodScores, hint, 15, "Direct Processing Pairing", `Processing hint: ${hint}`);
                }
            });
        }
        
        // --- Process tea type hints ---
        if (teaTypeHints.length > 0) {
            trace.push({
                step: "Tea Type Hints",
                reason: `${teaTypeHints.length} tea type hints to process`,
                adjustment: "Processing tea type specific pairings",
                value: teaTypeHints.join(', ')
            });
            
            teaTypeHints.forEach(hint => {
                if (!this.isFood(hint)) {
                    const groupFoods = this.foodsInGroup(hint);
                    trace.push({
                        step: "Tea Type Group Expansion",
                        reason: `Expanding tea type group: ${hint}`,
                        adjustment: `Found ${groupFoods.length} foods in group`,
                        value: groupFoods.join(', ')
                    });
                    
                    groupFoods.forEach(food => {
                        this.addFoodWithTrace(trace, foodScores, food, 10, "Tea Type Group", `From tea type group: ${hint}`);
                    });
                } else {
                    this.addFoodWithTrace(trace, foodScores, hint, 15, "Direct Tea Type Pairing", `Tea type hint: ${hint}`);
                }
            });
        }
        
        // --- Special case for Japanese green tea like Gyokuro or Matcha ---
        if (teaType && (teaType.toLowerCase() === "gyokuro" || teaType.toLowerCase() === "matcha" || 
           (teaType.toLowerCase() === "green" && rawFlavorInput.some(f => 
               ["umami", "marine", "seaweed"].includes(f.toLowerCase()))))) {
            
            trace.push({
                step: "Japanese Green Tea Detection",
                reason: `Detected ${teaType} with umami/marine characteristics`,
                adjustment: "Applying special Japanese green tea food pairings",
                value: `Tea type: ${teaType}, Flavors: ${rawFlavorInput.join(', ')}`
            });
            
            const japanesePairings = ["Sushi", "Rice Balls", "Mochi", "Light Japanese Sweets", "Seafood", "Tofu", "Edamame"];
            japanesePairings.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, 35, "Japanese Green Tea", `Perfect match for ${teaType}`);
            });
        }
        
        // --- Process mouthfeel ---
        if (mouthfeel.length > 0) {
            trace.push({
                step: "Mouthfeel Processing",
                reason: `${mouthfeel.length} mouthfeel descriptors to process`,
                adjustment: "Adjusting food pairings based on mouthfeel",
                value: mouthfeel.join(', ')
            });
            
            // Adjust for thick/thin mouthfeel
            if (mouthfeel.includes('thick') || mouthfeel.includes('full-bodied') || mouthfeel.includes('heavy')) {
                // Boost hearty foods for thick mouthfeel
                const heartyFoods = ["Rich Desserts", "Dark Chocolate", "Strong Cheese", "Grilled Meats", "Stews", "Hearty Soups"];
                trace.push({
                    step: "Thick Mouthfeel Adjustment",
                    reason: "Thick/full-bodied mouthfeel detected",
                    adjustment: `Boosting ${heartyFoods.length} hearty foods`,
                    value: heartyFoods.join(', ')
                });
                
                heartyFoods.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, 15, "Thick Mouthfeel", "Pairs well with hearty foods");
                });
                
                // Reduce score for delicate foods
                const delicateFoods = ["Light Desserts", "Light Salads", "Delicate Pastries"];
                trace.push({
                    step: "Thick Mouthfeel Reduction",
                    reason: "Thick/full-bodied mouthfeel detected",
                    adjustment: `Reducing ${delicateFoods.length} delicate foods`,
                    value: delicateFoods.join(', ')
                });
                
                delicateFoods.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, -10, "Thick Mouthfeel", "Less suited for delicate foods");
                });
            }
            
            if (mouthfeel.includes('thin') || mouthfeel.includes('light') || mouthfeel.includes('delicate')) {
                // Boost delicate foods for thin mouthfeel
                const delicateFoods = ["Light Salads", "Light Desserts", "Fresh Fruits", "Delicate Pastries", "Seafood"];
                trace.push({
                    step: "Thin Mouthfeel Adjustment",
                    reason: "Thin/light/delicate mouthfeel detected",
                    adjustment: `Boosting ${delicateFoods.length} delicate foods`,
                    value: delicateFoods.join(', ')
                });
                
                delicateFoods.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, 15, "Thin Mouthfeel", "Pairs well with delicate foods");
                });
                
                // Reduce score for heavy foods
                const heavyFoods = ["Rich Stews", "Hearty Soups", "Dark Chocolate", "Strong Cheese"];
                trace.push({
                    step: "Thin Mouthfeel Reduction",
                    reason: "Thin/light/delicate mouthfeel detected",
                    adjustment: `Reducing ${heavyFoods.length} hearty foods`,
                    value: heavyFoods.join(', ')
                });
                
                heavyFoods.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, -10, "Thin Mouthfeel", "Less suited for heavy foods");
                });
            }
        }
        
        // --- Process flavor intensity ---
        trace.push({
            step: "Flavor Intensity Processing",
            reason: `Flavor intensity: ${flavorIntensity}`,
            adjustment: "Adjusting based on flavor strength",
            value: flavorIntensity
        });
        
        // Match flavor intensity to food intensity
        if (flavorIntensity === "Pronounced" || flavorIntensity === "Strong") {
            // Boost bold foods for strong flavors
            const boldFoods = ["Bold Flavors", "Spicy Foods", "Strong Cheese", "Dark Chocolate", "Curries"];
            trace.push({
                step: "Strong Flavor Adjustment",
                reason: "Strong/Pronounced flavor profile",
                adjustment: `Boosting ${boldFoods.length} bold foods`,
                value: boldFoods.join(', ')
            });
            
            boldFoods.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, 15, "Strong Flavor", "Pairs well with bold foods");
            });
            
            // Reduce score for subtle foods
            const subtleFoods = ["Delicate Flavors", "Light Vegetables", "White Fish"];
            trace.push({
                step: "Strong Flavor Reduction",
                reason: "Strong/Pronounced flavor profile",
                adjustment: `Reducing ${subtleFoods.length} subtle foods`,
                value: subtleFoods.join(', ')
            });
            
            subtleFoods.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, -10, "Strong Flavor", "May overwhelm delicate foods");
            });
        }
        
        if (flavorIntensity === "Subtle" || flavorIntensity === "Delicate") {
            // Boost subtle foods for delicate flavors
            const subtleFoods = ["Delicate Flavors", "Light Vegetables", "White Fish", "Light Cheese"];
            trace.push({
                step: "Subtle Flavor Adjustment",
                reason: "Subtle/Delicate flavor profile",
                adjustment: `Boosting ${subtleFoods.length} subtle foods`,
                value: subtleFoods.join(', ')
            });
            
            subtleFoods.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, 15, "Subtle Flavor", "Pairs well with delicate foods");
            });
            
            // Reduce score for bold foods
            const boldFoods = ["Bold Flavors", "Spicy Foods", "Strong Cheese", "Curries"];
            trace.push({
                step: "Subtle Flavor Reduction",
                reason: "Subtle/Delicate flavor profile",
                adjustment: `Reducing ${boldFoods.length} bold foods`,
                value: boldFoods.join(', ')
            });
            
            boldFoods.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, -10, "Subtle Flavor", "May be overwhelmed by bold foods");
            });
        }
        
        // --- Process seasonal affinity ---
        if (seasonalAffinity.length > 0) {
            trace.push({
                step: "Seasonal Affinity Processing",
                reason: `${seasonalAffinity.length} seasonal hints to process`,
                adjustment: "Adjusting based on seasonal characteristics",
                value: seasonalAffinity.join(', ')
            });
            
            seasonalAffinity.forEach(season => {
                const seasonalFoods = this.getSeasonalFoods(season);
                trace.push({
                    step: "Seasonal Foods Mapping",
                    reason: `Season: ${season}`,
                    adjustment: `Found ${seasonalFoods.length} seasonal foods`,
                    value: seasonalFoods.join(', ')
                });
                
                seasonalFoods.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, 15, "Seasonal Affinity", `From season: ${season}`);
                });
            });
        }
        
        // Special case for roasted teas
        if (processingAnalysis?.isRoasted === true || processingHints.includes('Roasted') || 
            (roastLevel && (roastLevel === "Heavy" || roastLevel === "Medium" || roastLevel === "Charcoal"))) {
            const roastedPairings = ["Dark Chocolate", "Nuts", "Spiced Cakes", "Coffee Desserts", "Grilled Meats", "Roasted Nuts"];
            trace.push({
                step: "Roasted Tea Processing",
                reason: `Roasted tea detected (Level: ${roastLevel})`,
                adjustment: `Boosting ${roastedPairings.length} foods that pair with roasted teas`,
                value: roastedPairings.join(', ')
            });
            
            roastedPairings.forEach(food => {
                this.addFoodWithTrace(trace, foodScores, food, 15, "Roasted Tea", "Pairs well with roasted notes");
            });
            
            // Special adjustments for heavy roast
            if (roastLevel === "Heavy" || roastLevel === "Charcoal") {
                const heavyRoastPairings = ["Dark Chocolate", "Spiced Desserts", "Game Meats"];
                trace.push({
                    step: "Heavy Roast Processing",
                    reason: "Heavy/Charcoal roast detected",
                    adjustment: `Extra boost for ${heavyRoastPairings.length} special pairings`,
                    value: heavyRoastPairings.join(', ')
                });
                
                heavyRoastPairings.forEach(food => {
                    this.addFoodWithTrace(trace, foodScores, food, 15, "Heavy Roast", "Special affinity with heavy roast");
                });
            }
        }
        
        // Normalize scores and get recommended pairings
        trace.push({
            step: "Score Normalization",
            reason: `${foodScores.size} raw scores calculated`,
            adjustment: "Normalizing scores to 0-100 scale",
            value: `Total scores: ${foodScores.size}`
        });
        
        const normalizedScores = this.normalizeFoodScores(foodScores);
        trace.push({
            step: "Normalized Scores",
            reason: "Scores normalized to 0-100 scale",
            adjustment: `${Object.keys(normalizedScores).length} normalized scores available`,
            value: JSON.stringify(normalizedScores).slice(0, 100) + (Object.keys(normalizedScores).length > 3 ? "..." : "")
        });
        
        const recommendedPairings = this.getRecommendedPairings(normalizedScores);
        trace.push({
            step: "Recommended Pairings",
            reason: "Selected top recommendations based on scores",
            adjustment: `${recommendedPairings.length} recommended pairings identified`,
            value: recommendedPairings.map(p => `${p.name} (${p.score}%)`).join(', ')
        });
        
        const foodGroups = this.groupFoodPairings(normalizedScores);
        trace.push({
            step: "Food Group Organization",
            reason: "Organizing into thematic food groups",
            adjustment: `${foodGroups.length} food groups identified`,
            value: foodGroups.map(g => g.group).join(', ')
        });
        
        // Generate a human-readable description of the pairings
        const description = this.generateFoodDescription({ 
            recommendedPairings, 
            foodGroups 
        });
        
        trace.push({
            step: "Description Generation",
            reason: "Creating human-readable summary",
            adjustment: "Generated final description",
            value: description
        });
        
        return {
            recommendedPairings,
            foodGroups,
            normalizedScores,
            description,
            trace
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
     * Get recommended food pairings based on normalized scores
     * @param {Object} normalizedScores - Object with normalized food scores
     * @returns {Array} - Array of recommended food objects with name and score
     */
    getRecommendedPairings(normalizedScores) {
        // Sort by score descending
        const sortedFoods = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Handle empty foods
        if (sortedFoods.length === 0) {
            return [{ name: "Versatile - pairs with many foods", score: 50 }];
        }
        
        const maxScore = sortedFoods[0][1];
        const absoluteThreshold = 65; // Only include foods with scores above this
        const relativeThreshold = 15; // Only include foods within this many points of the max
        
        // Include foods that meet thresholds
        const topFoods = sortedFoods
            .filter(([food, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
            .map(([food, score]) => ({ name: food, score }));
        
        // Ensure at least one food is recommended
        if (topFoods.length === 0 && sortedFoods.length > 0) {
            return [ { name: sortedFoods[0][0], score: sortedFoods[0][1] } ];
        }
        
        // Limit to configured maximum number of recommendations
        return topFoods.slice(0, this.config.maxRecommendations);
    }
    
    /**
     * Group food pairings into thematic groups
     * @param {Object} normalizedScores - Object with normalized food scores
     * @returns {Array} - Array of food group objects
     */
    groupFoodPairings(normalizedScores) {
        const result = [];
        const threshold = this.config.clusterThreshold; // Use config threshold
        
        // Process each predefined food cluster
        this.foodClusters.forEach(cluster => {
            const matchingFoods = [];
            let totalScore = 0;
            
            // Find foods in this cluster that have scores above threshold
            cluster.foods.forEach(food => {
                if (normalizedScores[food] !== undefined && 
                    normalizedScores[food] >= threshold) {
                        matchingFoods.push({
                        name: food,
                        score: normalizedScores[food]
                    });
                    totalScore += normalizedScores[food];
                }
            });

            // Only include clusters with enough matching foods
            if (matchingFoods.length >= 2) {
                // Sort foods by score
                matchingFoods.sort((a, b) => b.score - a.score);
                
                // Calculate average score for the cluster
                const avgScore = Math.round(totalScore / matchingFoods.length);
                
                result.push({
                    group: cluster.occasion,
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
     * Generate a description of recommended foods and clusters
     * @param {Object} results - Results from matchFood
     * @returns {string} - Human-readable description
     */
    generateFoodDescription(results) {
        const { recommendedPairings, foodGroups } = results;
        
        if (recommendedPairings.length === 0) {
            return "This tea is versatile and pairs well with a wide variety of foods.";
        }
        
        let description = "This tea pairs especially well with ";
        
        // Add top foods
        if (recommendedPairings.length === 1) {
            description += `${recommendedPairings[0].name.toLowerCase()} (${recommendedPairings[0].score}% match).`;
        } else if (recommendedPairings.length === 2) {
            description += `${recommendedPairings[0].name.toLowerCase()} (${recommendedPairings[0].score}%) and ${recommendedPairings[1].name.toLowerCase()} (${recommendedPairings[1].score}%).`;
        } else {
            const lastFood = recommendedPairings[recommendedPairings.length - 1];
            const topFoods = recommendedPairings.slice(0, -1).map(f => `${f.name.toLowerCase()} (${f.score}%)`).join(', ');
            description += `${topFoods}, and ${lastFood.name.toLowerCase()} (${lastFood.score}%).`;
        }
        
        // Add food group information if available
        if (foodGroups.length > 0) {
            const topGroup = foodGroups[0];
            description += ` It's an excellent choice for "${topGroup.group}" occasions (${topGroup.score}% match).`;
        }
        
        return description;
    }

    /**
     * Get the numerical intensity level from a string description
     * @param {string} intensityString - Intensity description (e.g., "low", "high")
     * @returns {number} - Numeric intensity level (1-5)
     */
    getIntensityLevel(intensityString) {
        const levelMap = {
            "very low": 1, "low": 2,
            "medium-low": 2,
            "medium": 3, "moderate": 3,
            "medium-high": 4,
            "high": 4, "intense": 4,
            "very high": 5, "very intense": 5
        };
        
        return levelMap[intensityString.toLowerCase()] || 3; // Default to medium (3)
    }
    
    /**
     * Get seasonal foods for a given season
     * @param {string} season - Season name
     * @returns {Array} - Foods associated with the season
     */
    getSeasonalFoods(season) {
        const seasonalFoodMap = {
            "spring": ["Fresh Berries", "Green Vegetables", "Light Salads", "Asparagus", "Peas"],
            "summer": ["Stone Fruits", "Watermelon", "Fresh Salads", "Grilled Vegetables", "Ice Cream"],
            "fall": ["Apples", "Pears", "Root Vegetables", "Pumpkin", "Spiced Desserts"],
            "winter": ["Citrus", "Warm Stews", "Root Vegetables", "Spiced Desserts", "Dark Chocolate"]
        };
        
        return seasonalFoodMap[season.toLowerCase()] || [];
    }
    
    /**
     * Get foods belonging to a specific food group
     * @param {string} group - Food group name
     * @returns {Array} - Foods in the group
     */
    foodsInGroup(group) {
        // Lookup table for foods in each group
        const foodGroupMap = {
            "Proteins": ["Chicken", "Fish", "Beef", "Pork", "Tofu", "Eggs", "Legumes"],
            "Cheeses": ["Cheddar", "Brie", "Goat Cheese", "Blue Cheese", "Parmesan", "Light Cheese", "Hard Cheese", "Soft Cheese"],
            "Fruits": ["Apples", "Berries", "Citrus", "Stone Fruits", "Tropical Fruits", "Dried Fruits"],
            "Salads": ["Green Salad", "Fruit Salad", "Grain Salad", "Light Salads", "Mediterranean Salad"],
            "Desserts": ["Cakes", "Cookies", "Ice Cream", "Puddings", "Chocolate Desserts", "Fruit Desserts"],
            "Delicate Desserts": ["Meringues", "Custards", "Fruit Tarts", "Cream Puffs", "Soufflés"],
            "Salty Foods": ["Chips", "Crackers", "Olives", "Salted Nuts", "Cured Meats", "Pickled Vegetables"],
            "Bold Flavors": ["Strong Cheese", "Spiced Dishes", "Curries", "Smoked Foods", "Fermented Foods"],
            "Spicy Foods": ["Curries", "Hot Peppers", "Spiced Cakes", "Mexican Food", "Thai Curry"],
            "Delicate Flavors": ["Cucumber", "White Fish", "Mild Cheese", "Light Vegetables", "Steamed Rice"],
            "Breakfast Foods": ["Oatmeal", "Toast", "Eggs", "Pancakes", "Yogurt", "Cereal", "Pastries"],
            "Light Soups": ["Vegetable Soup", "Miso Soup", "Broth-Based Soups", "Consommé"],
            "Pastries": ["Croissants", "Scones", "Danish", "Muffins", "Tarts", "Sweet Pastries"],
            "Light Desserts": ["Fruit Tarts", "Sorbets", "Yogurt Parfaits", "Light Cookies"],
            "Grilled Meats": ["Grilled Chicken", "Steak", "Grilled Fish", "BBQ", "Kebabs"],
            "Roasted Vegetables": ["Roasted Root Vegetables", "Roasted Squash", "Roasted Peppers"],
            "Chocolate": ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Chocolate Cake", "Chocolate Truffles"],
            "Asian Foods": ["Sushi", "Dim Sum", "Stir-fry", "Noodles", "Rice Dishes", "Miso Soup"],
            "Mediterranean Foods": ["Hummus", "Falafel", "Olive Oil", "Pita", "Greek Salad", "Lamb Dishes"]
        };
        
        if (!group) return [];
        const normalizedGroup = this.normalizeFood(group);
        return foodGroupMap[normalizedGroup] || [];
    }
    
    /**
     * Check if a string is a food rather than a food group
     * @param {string} item - Food item to check
     * @returns {boolean} - True if it's a specific food
     */
    isFood(item) {
        // This is a simplified check - we're considering it a food
        // if it's not found in the group mapping
        const allGroups = Object.keys(this.flavorCategoryToFoodGroups)
            .flatMap(category => this.flavorCategoryToFoodGroups[category])
            .concat(this.foodGroups);
        
        // If it's not a group, consider it a food
        return !allGroups.includes(item);
    }
    
    /**
     * Normalize a food or group name (e.g., capitalize first letter)
     * @param {string} food - Food name to normalize
     * @returns {string} - Normalized food name
     */
    normalizeFood(food) {
        if (!food) return '';
        
        // Simple normalize: capitalize first letter
        const normalized = food.charAt(0).toUpperCase() + food.slice(1);
        
        // Handle common variations
        const foodMap = {
            "Chocolates": "Chocolate",
            "Chocolate desserts": "Chocolate Desserts",
            "Fresh fruits": "Fruits",
            "Fresh fruit": "Fruits",
            "Savory dishes": "Savory Dishes",
            "Spicy foods": "Spicy Foods",
            "Baked goods": "Baked Goods"
        };
        
        return foodMap[normalized] || normalized;
    }

    /**
     * Helper to check if a flavor might belong to a category
     * @param {string} flavor - The flavor to check
     * @param {string} category - The category to check against
     * @returns {boolean} - True if the flavor might belong to the category
     */
    mightBelongToCategory(flavor, category) {
        // Simple category inference logic
        const categoryKeywords = {
            'floral': ['flower', 'blossom', 'petal', 'floral'],
            'fruity': ['fruit', 'berry', 'citrus', 'apple', 'orange', 'lemon'],
            'vegetal': ['vegetable', 'green', 'leaf', 'grass', 'vegetal'],
            'nutty_and_toasty': ['nut', 'toast', 'roast', 'seed'],
            'spicy': ['spice', 'pepper', 'cinnamon', 'clove', 'ginger'],
            'sweet': ['sweet', 'honey', 'caramel', 'sugar', 'dessert'],
            'earthy': ['earth', 'soil', 'dirt', 'mineral', 'rock', 'stone'],
            'woody': ['wood', 'forest', 'pine', 'cedar', 'bark'],
            'roasted': ['roast', 'toast', 'char', 'burn', 'fire', 'smoke'],
            'umami': ['umami', 'savory', 'broth', 'stock', 'meat', 'mushroom'],
            'marine': ['marine', 'ocean', 'sea', 'seaweed', 'fish', 'salt']
        };
        
        const keywords = categoryKeywords[category.toLowerCase()] || [];
        
        // Check if any of the category keywords are in the flavor name
        return keywords.some(keyword => flavor.includes(keyword));
    }
}

// Export the class
export default FoodMatcher;