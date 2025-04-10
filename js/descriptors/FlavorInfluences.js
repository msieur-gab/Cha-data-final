// FlavorInfluences.js
// Defines influences of tea flavors, focusing on pairing and contextual hints.

export const flavorInfluences = {
    // Note: Structure groups flavors under categories for organization.
    // The FlavorCalculator might look up specific flavors directly or by category.

    floral: {
        jasmine: {
            // removed 'effects', 'intensity'
            foodPairingHints: ["Light desserts", "Steamed vegetables", "White fish", "Rice dishes"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Evening", "Unwinding"],
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        rose: {
            foodPairingHints: ["Pastries", "Fruit salads", "Middle Eastern sweets", "Yogurt"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Romantic"],
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        orchid: {
            foodPairingHints: ["Creamy desserts", "Light cakes", "Tropical fruit", "Subtle pastries"],
            seasonalAffinityHints: ["Spring", "Anytime (Subtle)"],
            activityHints: ["Relaxation", "Contemplative", "Social"],
            associatedFlavors: ["sweet", "perfumed", "honey", "creamy"]
        },
        lilac: {
            foodPairingHints: ["Spring salads", "Light fruit tarts", "Madeleines"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Uplifting", "Social", "Creative"],
            associatedFlavors: ["sweet", "perfumed", "spring-like"]
        },
        osmanthus: {
            foodPairingHints: ["Apricot pastries", "Moon cakes", "Jellies", "Light cookies"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Uplifting", "Social", "Relaxation"],
            associatedFlavors: ["apricot", "sweet", "honey"]
        },
        // Add Elderflower, Honeysuckle etc. similarly
        honeysuckle: {
             foodPairingHints: ["Fruit salads", "Light cakes", "Sorbets"],
             seasonalAffinityHints: ["Spring", "Summer"],
             activityHints: ["Uplifting", "Relaxation", "Social"],
             associatedFlavors: ["sweet", "nectar", "floral"]
         }
    },

    fruity: {
        apple: {
            foodPairingHints: ["Cheese plates", "Pork dishes", "Oatmeal", "Light cakes"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Social", "Afternoon Break", "Gentle Energy"],
            associatedFlavors: ["sweet", "crisp", "light"]
        },
        // Add Pear, Peach, Apricot, Citrus, Berry, Tropical, Stone Fruit etc.
        citrus: {
             foodPairingHints: ["Seafood", "Salads", "Chicken", "Light desserts"],
             seasonalAffinityHints: ["Summer", "Spring"],
             activityHints: ["Energy", "Focus", "Morning", "Refreshment"],
             associatedFlavors: ["bright", "tangy", "zesty"]
         },
        berry: {
             foodPairingHints: ["Desserts", "Yogurt", "Breakfast foods", "Salads"],
             seasonalAffinityHints: ["Summer", "Spring"],
             activityHints: ["Energy", "Social", "Uplifting"],
             associatedFlavors: ["sweet", "tangy", "bright"]
         }
    },

    vegetal: {
        // Using broader category hints, specific notes might refine this
        _categoryDefaults: { // Example of category-level defaults
            foodPairingHints: ["Savory dishes", "Vegetables", "Rice", "Steamed foods"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Cleansing", "Refreshment"]
        },
        leafy: { // Specific notes can override or add to defaults
            foodPairingHints: ["Salads", "Steamed greens", "Light soups"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Focus", "Detox/Cleansing"],
            associatedFlavors: ['spinach', 'kale', 'lettuce', 'grass']
        },
        // Add Cruciferous, Herbaceous etc.
         herbaceous: {
             foodPairingHints: ["Grilled vegetables", "Savory pastries", "Cheese", "Soups"],
             seasonalAffinityHints: ["Spring", "Summer"],
             activityHints: ["Focus", "Refreshment", "Calm (Mint)"],
             associatedFlavors: ['parsley', 'thyme', 'mint', 'sage', 'basil']
         }
    },

    nutty_and_toasty: {
        nuts: {
            foodPairingHints: ["Baked goods", "Cheese", "Roasted vegetables", "Light meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Relaxation", "Focus"],
            associatedFlavors: ['almond', 'hazelnut', 'walnut', 'chestnut', 'peanut']
        },
        toasted: {
            foodPairingHints: ["Breakfast foods (toast, grains)", "Roasted nuts", "Comfort food"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Routine"],
            associatedFlavors: ['bread', 'grain', 'barley', 'rice']
        }
    },

    spicy: {
        pungent: { // Warming spices
            foodPairingHints: ["Rich desserts", "Spiced cakes", "Curries", "Stews"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Energy", "Digestive"],
            associatedFlavors: ['pepper', 'ginger', 'cinnamon', 'clove', 'anise', 'licorice']
        },
        cooling: { // e.g., Mint
            foodPairingHints: ["Fruit salads", "Chocolate", "Lamb dishes", "Yogurt"],
            seasonalAffinityHints: ["Summer", "Spring"],
            activityHints: ["Refreshment", "Focus", "Digestive"],
            associatedFlavors: ['menthol', 'camphor', 'mint']
        }
    },

    sweet: {
        caramelized: {
            foodPairingHints: ["Desserts", "Roasted foods", "Cheese", "Coffee"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Comfort", "Warming", "Relaxation", "Evening"],
            associatedFlavors: ['honey', 'caramel', 'brown sugar', 'molasses']
        },
        // Add Vanilla, Chocolate, Malt etc.
        chocolate: {
             foodPairingHints: ["Desserts", "Berries", "Coffee", "Nuts"],
             seasonalAffinityHints: ["Winter", "Autumn"],
             activityHints: ["Comfort", "Indulgence", "Relaxation"],
             associatedFlavors: ['cocoa', 'dark chocolate']
         },
         malt: {
             foodPairingHints: ["Breakfast foods", "Baked goods", "Biscuits", "Caramel"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Warming", "Comfort", "Routine"],
             associatedFlavors: ["sweet", "cereal", "warm"]
         }
    },

    earthy: {
        _categoryDefaults: {
            foodPairingHints: ["Mushrooms", "Root vegetables", "Stews", "Dark meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding (Physical)", "Contemplative", "Warming", "Digestive"]
        },
        soil: { associatedFlavors: ['petrichor', 'loam', 'forest floor'] },
        mineral: {
             foodPairingHints: ["Seafood", "Shellfish", "Light cheese", "Oysters"],
             seasonalAffinityHints: ["Spring", "Summer", "Autumn"], // Can be year-round
             activityHints: ["Focus", "Refreshment", "Contemplative"],
             associatedFlavors: ['wet stone', 'flint', 'slate']
        },
        // Add Fungal, Aged etc.
        aged: { // Flavors from aging, like in Puerh
             foodPairingHints: ["Rich foods", "Game meats", "Dark chocolate", "Mushrooms"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Contemplative", "Digestive", "Warming"],
             associatedFlavors: ['forest floor', 'leather', 'autumn leaves', 'camphor']
         }
    },

    woody: {
        _categoryDefaults: {
            foodPairingHints: ["Smoked foods", "Grilled meats", "Cheese", "Mushrooms"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding (Physical)", "Contemplative", "Warming"]
        },
        // Add specific woods like Oak, Pine, Cedar, Sandalwood, Bamboo...
        cedar: {
            foodPairingHints: ["Smoked salmon", "Hard cheese", "Game"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Focus", "Contemplative"],
            associatedFlavors: ["aromatic", "clean", "dry"]
        }
    },

    roasted: {
        _categoryDefaults: {
            foodPairingHints: ["Grilled/Roasted meats", "Root vegetables", "Comfort foods", "Chocolate"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Evening", "Relaxation"]
        },
        smoky: { // Lapsang Souchong etc.
            foodPairingHints: ["Smoked foods", "BBQ", "Strong cheese", "Bacon"],
            seasonalAffinityHints: ["Winter", "Autumn"],
            activityHints: ["Warming", "Contemplative", "Bold Experience"],
            associatedFlavors: ['bonfire', 'tobacco', 'burnt', 'pine resin']
         },
         nutty: { // Coffee-like notes etc.
             foodPairingHints: ["Desserts", "Baked goods", "Cheese"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Warming", "Comfort", "Focus"],
             associatedFlavors: ['roasted nuts', 'coffee', 'chicory']
         }
    },

    umami: { // Savory
        marine: {
            foodPairingHints: ["Seafood", "Sushi", "Rice dishes", "Light vegetables"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Refreshment", "Cleansing"],
            associatedFlavors: ['seaweed', 'nori', 'brine', 'oceanic']
        },
        meaty: { // Brothy, savory
            foodPairingHints: ["Savory soups", "Stews", "Mushrooms", "Rich dishes"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Satiating"],
            associatedFlavors: ['savory', 'meaty', 'broth', 'mushroom']
        }
    },

    // Add Chemical, Sour categories if needed, likely with fewer positive hints

};

export default flavorInfluences;