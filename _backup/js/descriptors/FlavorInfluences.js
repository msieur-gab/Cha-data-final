// FlavorInfluences.js
// Defines influences of tea flavors, focusing on pairing and contextual hints.

export const flavorInfluences = {
    // Note: Structure groups flavors under categories for organization.
    // The FlavorCalculator might look up specific flavors directly or by category.

    floral: {
        jasmine: {
            // removed 'effects', 'intensity'
            foodPairingHints: ["Light Desserts", "Steamed Vegetables", "White Fish", "Rice Dishes"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Evening", "Unwinding"],
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        rose: {
            foodPairingHints: ["Pastries", "Fruit Salads", "Middle Eastern Sweets", "Yogurt"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Relaxation", "Social", "Romantic"],
            associatedFlavors: ["sweet", "perfumed", "honey"]
        },
        orchid: {
            foodPairingHints: ["Creamy Desserts", "Light Cakes", "Tropical Fruit", "Subtle Pastries"],
            seasonalAffinityHints: ["Spring", "Anytime (Subtle)"],
            activityHints: ["Relaxation", "Contemplative", "Social"],
            associatedFlavors: ["sweet", "perfumed", "honey", "creamy"]
        },
        lilac: {
            foodPairingHints: ["Spring Salads", "Light Fruit Tarts", "Madeleines"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Uplifting", "Social", "Creative"],
            associatedFlavors: ["sweet", "perfumed", "spring-like"]
        },
        osmanthus: {
            foodPairingHints: ["Apricot Pastries", "Moon Cakes", "Jellies", "Light Cookies"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Uplifting", "Social", "Relaxation"],
            associatedFlavors: ["apricot", "sweet", "honey"]
        },
        // Add Elderflower, Honeysuckle etc. similarly
        honeysuckle: {
             foodPairingHints: ["Fruit Salads", "Light Cakes", "Sorbets"],
             seasonalAffinityHints: ["Spring", "Summer"],
             activityHints: ["Uplifting", "Relaxation", "Social"],
             associatedFlavors: ["sweet", "nectar", "floral"]
         }
    },

    fruity: {
        apple: {
            foodPairingHints: ["Cheese Plates", "Pork Dishes", "Oatmeal", "Light Cakes"],
            seasonalAffinityHints: ["Autumn", "Spring"],
            activityHints: ["Social", "Afternoon Break", "Gentle Energy"],
            associatedFlavors: ["sweet", "crisp", "light"]
        },
        // Add Pear, Peach, Apricot, Citrus, Berry, Tropical, Stone Fruit etc.
        citrus: {
             foodPairingHints: ["Seafood", "Salads", "Chicken", "Light Desserts"],
             seasonalAffinityHints: ["Summer", "Spring"],
             activityHints: ["Energy", "Focus", "Morning", "Refreshment"],
             associatedFlavors: ["bright", "tangy", "zesty"]
         },
        berry: {
             foodPairingHints: ["Desserts", "Yogurt", "Breakfast Foods", "Salads"],
             seasonalAffinityHints: ["Summer", "Spring"],
             activityHints: ["Energy", "Social", "Uplifting"],
             associatedFlavors: ["sweet", "tangy", "bright"]
         }
    },

    vegetal: {
        // Using broader category hints, specific notes might refine this
        _categoryDefaults: { // Example of category-level defaults
            foodPairingHints: ["Savory Dishes", "Vegetables", "Rice", "Steamed Foods"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Cleansing", "Refreshment"]
        },
        leafy: { // Specific notes can override or add to defaults
            foodPairingHints: ["Salads", "Steamed Greens", "Light Soups"],
            seasonalAffinityHints: ["Spring"],
            activityHints: ["Focus", "Detox/Cleansing"],
            associatedFlavors: ['spinach', 'kale', 'lettuce', 'grass']
        },
        // Add Cruciferous, Herbaceous etc.
         herbaceous: {
             foodPairingHints: ["Grilled Vegetables", "Savory Pastries", "Cheese", "Soups"],
             seasonalAffinityHints: ["Spring", "Summer"],
             activityHints: ["Focus", "Refreshment", "Calm (Mint)"],
             associatedFlavors: ['parsley', 'thyme', 'mint', 'sage', 'basil']
         }
    },

    nutty_and_toasty: {
        nuts: {
            foodPairingHints: ["Baked Goods", "Cheese", "Roasted Vegetables", "Light Meats", "Roasted Nuts", "Hard Cheese"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Relaxation", "Focus"],
            associatedFlavors: ['almond', 'hazelnut', 'walnut', 'chestnut', 'peanut']
        },
        toasted: {
            foodPairingHints: ["Breakfast Foods (Toast, Grains)", "Roasted Nuts", "Comfort Food", "Baked Goods", "Grilled Meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Routine"],
            associatedFlavors: ['Bread', 'Grain', 'Barley', 'Rice']
        }
    },

    spicy: {
        pungent: { // Warming spices
            foodPairingHints: ["Rich Desserts", "Spiced Cakes", "Curries", "Stews"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Energy", "Digestive"],
            associatedFlavors: ['Pepper', 'Ginger', 'Cinnamon', 'Clove', 'Anise', 'Licorice']
        },
        cooling: { // e.g., Mint
            foodPairingHints: ["Fruit Salads", "Chocolate", "Lamb Dishes", "Yogurt"],
            seasonalAffinityHints: ["Summer", "Spring"],
            activityHints: ["Refreshment", "Focus", "Digestive"],
            associatedFlavors: ['Menthol', 'Camphor', 'Mint']
        }
    },

    sweet: {
        caramelized: {
            foodPairingHints: ["Desserts", "Roasted Foods", "Cheese", "Coffee", "Dark Chocolate", "Baked Goods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Comfort", "Warming", "Relaxation", "Evening"],
            associatedFlavors: ['Honey', 'Caramel', 'Brown Sugar', 'Molasses']
        },
        // Add Vanilla, Chocolate, Malt etc.
        chocolate: {
             foodPairingHints: ["Desserts", "Berries", "Coffee", "Nuts", "Dark Chocolate", "Baked Goods", "Roasted Nuts"],
             seasonalAffinityHints: ["Winter", "Autumn"],
             activityHints: ["Comfort", "Indulgence", "Relaxation"],
             associatedFlavors: ['cocoa', 'dark chocolate']
         },
         malt: {
             foodPairingHints: ["Breakfast Foods", "Baked Goods", "Biscuits", "Caramel", "Hard Cheese"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Warming", "Comfort", "Routine"],
             associatedFlavors: ["sweet", "cereal", "warm"]
         }
    },

    earthy: {
        _categoryDefaults: {
            foodPairingHints: ["Mushrooms", "Root Vegetables", "Stews", "Dark Meats", "Grilled Meats", "Spiced Foods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding (Physical)", "Contemplative", "Warming", "Digestive"]
        },
        soil: { 
            associatedFlavors: ['petrichor', 'loam', 'forest floor'],
            foodPairingHints: ["Mushrooms", "Root Vegetables", "Hearty Soups", "Dark Meats", "Grilled Meats"]
        },
        mineral: {
             foodPairingHints: ["Seafood", "Shellfish", "Light Cheese", "Oysters", "Hard Cheese"],
             seasonalAffinityHints: ["Spring", "Summer", "Autumn"], // Can be year-round
             activityHints: ["Focus", "Refreshment", "Contemplative"],
             associatedFlavors: ['Wet Stone', 'Flint', 'Slate']
        },
        // Add Fungal, Aged etc.
        aged: { // Flavors from aging, like in Puerh
             foodPairingHints: ["Rich Foods", "Game Meats", "Dark Chocolate", "Mushrooms", "Root Vegetables", "Spiced Foods"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Contemplative", "Digestive", "Warming"],
             associatedFlavors: ['Forest Floor', 'Leather', 'Autumn Leaves', 'Camphor']
         }
    },

    woody: {
        _categoryDefaults: {
            foodPairingHints: ["Smoked Foods", "Grilled Meats", "Cheese", "Mushrooms", "Hard Cheese", "Root Vegetables"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Grounding (Physical)", "Contemplative", "Warming"]
        },
        // Add specific woods like Oak, Pine, Cedar, Sandalwood, Bamboo...
        cedar: {
            foodPairingHints: ["Smoked Salmon", "Hard Cheese", "Game Meats", "Grilled Meats"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Focus", "Contemplative"],
            associatedFlavors: ["Aromatic", "Clean", "Dry"]
        }
    },

    roasted: {
        _categoryDefaults: {
            foodPairingHints: ["Grilled/Roasted Meats", "Root Vegetables", "Comfort Foods", "Chocolate", "Dark Chocolate", "Roasted Nuts", "Hard Cheese", "Spiced Foods", "Baked Goods"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Evening", "Relaxation"]
        },
        smoky: { // Lapsang Souchong etc.
            foodPairingHints: ["Smoked Foods", "BBQ", "Strong Cheese", "Bacon", "Grilled Meats", "Dark Chocolate"],
            seasonalAffinityHints: ["Winter", "Autumn"],
            activityHints: ["Warming", "Contemplative", "Bold Experience"],
            associatedFlavors: ['Bonfire', 'Tobacco', 'Burnt', 'Pine Resin']
         },
         nutty: { // Coffee-like notes etc.
             foodPairingHints: ["Desserts", "Baked Goods", "Cheese", "Roasted Nuts", "Dark Chocolate"],
             seasonalAffinityHints: ["Autumn", "Winter"],
             activityHints: ["Warming", "Comfort", "Focus"],
             associatedFlavors: ['Roasted Nuts', 'Coffee', 'Chicory']
         }
    },

    umami: { // Savory
        marine: {
            foodPairingHints: ["Seafood", "Sushi", "Rice Dishes", "Light vegetables"],
            seasonalAffinityHints: ["Spring", "Summer"],
            activityHints: ["Focus", "Refreshment", "Cleansing"],
            associatedFlavors: ['seaweed', 'nori', 'brine', 'oceanic']
        },
        meaty: { // Brothy, savory
            foodPairingHints: ["Savory Soups", "Stews", "Mushrooms", "Rich Dishes"],
            seasonalAffinityHints: ["Autumn", "Winter"],
            activityHints: ["Warming", "Comfort", "Satiating"],
            associatedFlavors: ['Savory', 'Meaty', 'Broth', 'Mushroom']
        }
    },

    // Add Chemical, Sour categories if needed, likely with fewer positive hints

};

export default flavorInfluences;