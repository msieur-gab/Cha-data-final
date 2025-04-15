/**
 * Tea Suggestions Module
 * Contains suggestion mappings for processing methods and flavor profiles
 * based on tea types
 */

// Mapping of tea types to suggested processing methods
const teaProcessingMethods = {
    white: [
        'minimal-processing',
        'sun-dried',
        'withered',
        'light-roast'  // Some aged white teas
    ],
    green: [
        'steamed',     // Japanese style
        'pan-fired',   // Chinese style
        'kill-green',
        'rolled'       // For gunpowder tea
    ],
    yellow: [
        'minimal-processing',
        'light-roast',
        'kill-green',
        'withered',
        'rolled'       // Gentle shaping
    ],
    oolong: [
        'partial-oxidation',
        'pan-fired',
        'light-roast',
        'medium-roast',
        'withered',
        'rolled',      // For ball-rolled oolongs
        'tumbled'      // For strip-style oolongs
    ],
    black: [
        'full-oxidation',
        'withered',
        'oxidised',
        'rolled',
        'heavy-roast'  // For some Fujian blacks
    ],
    pu_er: [
        'fermented',   // For shou pu'er
        'aged',
        'withered',
        'sun-dried',   // For maocha
        'tumbled',     // For loose leaf
        'oxidised'     // For sheng pu'er
    ]
};

// Direct mapping of tea types to suggested flavor types
// Each entry is in format: { category, type } to maintain compatibility with existing code
const teaFlavorProfiles = {
    white: [
        { category: 'floral', type: 'white_floral' },
        { category: 'fruity', type: 'stone_fruit' },
        { category: 'sweet', type: 'honey' },
        { category: 'vegetal', type: 'leafy' }
    ],
    green: [
        { category: 'vegetal', type: 'leafy' },
        { category: 'vegetal', type: 'marine' },
        { category: 'vegetal', type: 'herbaceous' },
        { category: 'nutty_and_toasty', type: 'grain' },
        { category: 'floral', type: 'herbal_floral' }
    ],
    yellow: [
        { category: 'sweet', type: 'honey' },
        { category: 'vegetal', type: 'leafy' },
        { category: 'floral', type: 'white_floral' },
        { category: 'nutty_and_toasty', type: 'grain' }
    ],
    oolong: [
        { category: 'floral', type: 'exotic_floral' },
        { category: 'fruity', type: 'stone_fruit' },
        { category: 'woody', type: 'fresh' },
        { category: 'nutty_and_toasty', type: 'roasted' },
        { category: 'sweet', type: 'caramelized' }
    ],
    black: [
        { category: 'sweet', type: 'caramelized' },
        { category: 'sweet', type: 'honey' },
        { category: 'fruity', type: 'berry' },
        { category: 'fruity', type: 'citrus' },
        { category: 'spicy', type: 'warm_spice' },
        { category: 'earthy', type: 'soil' }
    ],
    pu_er: [
        { category: 'earthy', type: 'soil' },
        { category: 'woody', type: 'aged' },
        { category: 'aged', type: 'fermented' },
        { category: 'sweet', type: 'caramelized' },
        { category: 'aged', type: 'mellow' }
    ]
};

// Map specific flavors to their category and type
// This allows users to input specific flavors they taste
const flavorToCategoryType = {
    // Floral flavors
    'jasmine': { category: 'floral', type: 'white_floral' },
    'lily': { category: 'floral', type: 'white_floral' },
    'honeysuckle': { category: 'floral', type: 'white_floral' },
    'chamomile': { category: 'floral', type: 'herbal_floral' },
    'lavender': { category: 'floral', type: 'herbal_floral' },
    'rose': { category: 'floral', type: 'herbal_floral' },
    'chrysanthemum': { category: 'floral', type: 'herbal_floral' },
    'orchid': { category: 'floral', type: 'exotic_floral' },
    'lotus': { category: 'floral', type: 'exotic_floral' },
    'gardenia': { category: 'floral', type: 'exotic_floral' },
    'magnolia': { category: 'floral', type: 'exotic_floral' },
    
    // Vegetal flavors
    'grass': { category: 'vegetal', type: 'leafy' },
    'spinach': { category: 'vegetal', type: 'leafy' },
    'lettuce': { category: 'vegetal', type: 'leafy' },
    'kale': { category: 'vegetal', type: 'leafy' },
    'thyme': { category: 'vegetal', type: 'herbaceous' },
    'basil': { category: 'vegetal', type: 'herbaceous' },
    'mint': { category: 'vegetal', type: 'herbaceous' },
    'sage': { category: 'vegetal', type: 'herbaceous' },
    'seaweed': { category: 'vegetal', type: 'marine' },
    'ocean': { category: 'vegetal', type: 'marine' },
    'algae': { category: 'vegetal', type: 'marine' },
    'nori': { category: 'vegetal', type: 'marine' },
    'cucumber': { category: 'vegetal', type: 'garden_vegetal' },
    'artichoke': { category: 'vegetal', type: 'garden_vegetal' },
    'asparagus': { category: 'vegetal', type: 'garden_vegetal' },
    'pea': { category: 'vegetal', type: 'garden_vegetal' },
    
    // Fruity flavors
    'lemon': { category: 'fruity', type: 'citrus' },
    'orange': { category: 'fruity', type: 'citrus' },
    'bergamot': { category: 'fruity', type: 'citrus' },
    'yuzu': { category: 'fruity', type: 'citrus' },
    'grapefruit': { category: 'fruity', type: 'citrus' },
    'peach': { category: 'fruity', type: 'stone_fruit' },
    'apricot': { category: 'fruity', type: 'stone_fruit' },
    'plum': { category: 'fruity', type: 'stone_fruit' },
    'cherry': { category: 'fruity', type: 'stone_fruit' },
    'pineapple': { category: 'fruity', type: 'tropical' },
    'mango': { category: 'fruity', type: 'tropical' },
    'coconut': { category: 'fruity', type: 'tropical' },
    'lychee': { category: 'fruity', type: 'tropical' },
    'passion fruit': { category: 'fruity', type: 'tropical' },
    'strawberry': { category: 'fruity', type: 'berry' },
    'blackberry': { category: 'fruity', type: 'berry' },
    'raspberry': { category: 'fruity', type: 'berry' },
    'blueberry': { category: 'fruity', type: 'berry' },
    'apple': { category: 'fruity', type: 'tree_fruit' },
    'pear': { category: 'fruity', type: 'tree_fruit' },
    'quince': { category: 'fruity', type: 'tree_fruit' },
    'raisin': { category: 'fruity', type: 'dried_fruit' },
    'fig': { category: 'fruity', type: 'dried_fruit' },
    'date': { category: 'fruity', type: 'dried_fruit' },
    'dried apricot': { category: 'fruity', type: 'dried_fruit' },
    'grape': { category: 'fruity', type: 'muscatel' },
    'muscat': { category: 'fruity', type: 'muscatel' },
    'wine': { category: 'fruity', type: 'muscatel' },
    
    // Sweet flavors
    'caramel': { category: 'sweet', type: 'caramelized' },
    'brown sugar': { category: 'sweet', type: 'caramelized' },
    'toffee': { category: 'sweet', type: 'caramelized' },
    'molasses': { category: 'sweet', type: 'caramelized' },
    'honey': { category: 'sweet', type: 'honey' },
    'honeycomb': { category: 'sweet', type: 'honey' },
    'nectar': { category: 'sweet', type: 'honey' },
    'vanilla': { category: 'sweet', type: 'vanilla' },
    'cream': { category: 'sweet', type: 'vanilla' },
    'custard': { category: 'sweet', type: 'vanilla' },
    'chocolate': { category: 'sweet', type: 'chocolate' },
    'cocoa': { category: 'sweet', type: 'chocolate' },
    'cacao': { category: 'sweet', type: 'chocolate' },
    'marshmallow': { category: 'sweet', type: 'confectionery' },
    'cotton candy': { category: 'sweet', type: 'confectionery' },
    'marzipan': { category: 'sweet', type: 'confectionery' },
    
    // Nutty and toasty flavors
    'almond': { category: 'nutty_and_toasty', type: 'nuts' },
    'walnut': { category: 'nutty_and_toasty', type: 'nuts' },
    'chestnut': { category: 'nutty_and_toasty', type: 'nuts' },
    'hazelnut': { category: 'nutty_and_toasty', type: 'nuts' },
    'pecan': { category: 'nutty_and_toasty', type: 'nuts' },
    'rice': { category: 'nutty_and_toasty', type: 'grain' },
    'barley': { category: 'nutty_and_toasty', type: 'grain' },
    'wheat': { category: 'nutty_and_toasty', type: 'grain' },
    'oats': { category: 'nutty_and_toasty', type: 'grain' },
    'toast': { category: 'nutty_and_toasty', type: 'roasted' },
    'bread': { category: 'nutty_and_toasty', type: 'roasted' },
    'biscuit': { category: 'nutty_and_toasty', type: 'roasted' },
    'pastry': { category: 'nutty_and_toasty', type: 'roasted' },
    
    // Spicy flavors
    'cinnamon': { category: 'spicy', type: 'warm_spice' },
    'cardamom': { category: 'spicy', type: 'warm_spice' },
    'clove': { category: 'spicy', type: 'warm_spice' },
    'nutmeg': { category: 'spicy', type: 'warm_spice' },
    'star anise': { category: 'spicy', type: 'warm_spice' },
    'pepper': { category: 'spicy', type: 'pungent' },
    'ginger': { category: 'spicy', type: 'pungent' },
    'licorice': { category: 'spicy', type: 'pungent' },
    'menthol': { category: 'spicy', type: 'cooling' },
    'camphor': { category: 'spicy', type: 'cooling' },
    'eucalyptus': { category: 'spicy', type: 'cooling' },
    
    // Earthy flavors
    'soil': { category: 'earthy', type: 'soil' },
    'earth': { category: 'earthy', type: 'soil' },
    'forest floor': { category: 'earthy', type: 'soil' },
    'petrichor': { category: 'earthy', type: 'soil' },
    'stone': { category: 'earthy', type: 'mineral' },
    'slate': { category: 'earthy', type: 'mineral' },
    'mineral': { category: 'earthy', type: 'mineral' },
    'flint': { category: 'earthy', type: 'mineral' },
    'spring water': { category: 'earthy', type: 'mineral' },
    'medicinal': { category: 'earthy', type: 'medicinal' },
    'herbal': { category: 'earthy', type: 'medicinal' },
    'autumn leaves': { category: 'earthy', type: 'compost' },
    'compost': { category: 'earthy', type: 'compost' },
    'humus': { category: 'earthy', type: 'compost' },
    
    // Woody flavors
    'cedar': { category: 'woody', type: 'aged' },
    'oak': { category: 'woody', type: 'aged' },
    'sandalwood': { category: 'woody', type: 'aged' },
    'rosewood': { category: 'woody', type: 'aged' },
    'bamboo': { category: 'woody', type: 'fresh' },
    'pine': { category: 'woody', type: 'fresh' },
    'stems': { category: 'woody', type: 'fresh' },
    'resin': { category: 'woody', type: 'resinous' },
    'frankincense': { category: 'woody', type: 'resinous' },
    'myrrh': { category: 'woody', type: 'resinous' },
    
    // Roasted flavors
    'smoke': { category: 'roasted', type: 'smoky' },
    'campfire': { category: 'roasted', type: 'smoky' },
    'charcoal': { category: 'roasted', type: 'smoky' },
    'lapsang': { category: 'roasted', type: 'smoky' },
    'bonfire': { category: 'roasted', type: 'smoky' },
    'toasted': { category: 'roasted', type: 'toasted' },
    'popcorn': { category: 'roasted', type: 'toasted' },
    'coffee': { category: 'roasted', type: 'toasted' },
    'burnt sugar': { category: 'roasted', type: 'charred' },
    'charred': { category: 'roasted', type: 'charred' },
    
    // Aged flavors
    'leather': { category: 'aged', type: 'fermented' },
    'whiskey': { category: 'aged', type: 'fermented' },
    'bourbon': { category: 'aged', type: 'fermented' },
    'old books': { category: 'aged', type: 'mellow' },
    'antique': { category: 'aged', type: 'mellow' },
    'library': { category: 'aged', type: 'mellow' },
    'warehouse': { category: 'aged', type: 'storage' },
    'cellar': { category: 'aged', type: 'storage' },
    'attic': { category: 'aged', type: 'storage' },
    
    // Umami flavors
    'broth': { category: 'umami', type: 'savory' },
    'mushroom': { category: 'umami', type: 'savory' },
    'stock': { category: 'umami', type: 'savory' },
    'kombu': { category: 'umami', type: 'marine_umami' },
    'dashi': { category: 'umami', type: 'marine_umami' },
    'seafood': { category: 'umami', type: 'marine_umami' },
    'bean': { category: 'umami', type: 'protein' },
    'tofu': { category: 'umami', type: 'protein' },
    'soy': { category: 'umami', type: 'protein' },
    'miso': { category: 'umami', type: 'protein' },
    
    // Mouthfeel
    'astringent': { category: 'mouthfeel', type: 'astringency' },
    'tannic': { category: 'mouthfeel', type: 'astringency' },
    'puckering': { category: 'mouthfeel', type: 'astringency' },
    'silky': { category: 'mouthfeel', type: 'texture' },
    'creamy': { category: 'mouthfeel', type: 'texture' },
    'thick': { category: 'mouthfeel', type: 'texture' },
    'smooth': { category: 'mouthfeel', type: 'texture' },
    'mineral water': { category: 'mouthfeel', type: 'minerality' },
    'crisp': { category: 'mouthfeel', type: 'minerality' },
    
    // Bitter flavors
    'bitter chocolate': { category: 'bitter', type: 'pleasant_bitter' },
    'bitter coffee': { category: 'bitter', type: 'pleasant_bitter' },
    'dandelion': { category: 'bitter', type: 'herbal_bitter' },
    'chicory': { category: 'bitter', type: 'herbal_bitter' },
    'endive': { category: 'bitter', type: 'vegetable_bitter' },
    'radicchio': { category: 'bitter', type: 'vegetable_bitter' },
    
    // Dairy flavors
    'milk': { category: 'dairy', type: 'milk' },
    'butter': { category: 'dairy', type: 'milk' },
    'yogurt': { category: 'dairy', type: 'fermented' },
    'cheese': { category: 'dairy', type: 'fermented' },
    'ghee': { category: 'dairy', type: 'buttery' }
};

// Function to get suggested processing methods for a tea type
function getSuggestedProcessingMethods(teaType) {
    return teaType && teaProcessingMethods[teaType] 
        ? teaProcessingMethods[teaType] 
        : [];
}

// Function to get suggested flavor profiles for a tea type
function getSuggestedFlavorProfiles(teaType) {
    return teaType && teaFlavorProfiles[teaType] 
        ? teaFlavorProfiles[teaType] 
        : [];
}

// Helper function to get the category for a given flavor type
function getCategoryForFlavorType(flavorType) {
    for (const category in flavorProfiles) {
        if (flavorProfiles[category][flavorType]) {
            return category;
        }
    }
    return null;
}

// Function to find category and type based on a specific flavor
// Returns { category, type } or null if not found
function getCategoryTypeForFlavor(flavor) {
    const normalizedFlavor = flavor.trim().toLowerCase();
    return flavorToCategoryType[normalizedFlavor] || null;
}

// Function to get all available flavors as an array for autocomplete
function getAllFlavors() {
    return Object.keys(flavorToCategoryType);
}

// Function to search flavors that match a query string
function searchFlavors(query) {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.trim().toLowerCase();
    return Object.keys(flavorToCategoryType).filter(flavor => 
        flavor.toLowerCase().includes(normalizedQuery)
    );
}

// Function to get all available processing methods as an array
function getAllProcessingMethods() {
    return Object.keys(processingMethods);
}

// Function to get all available flavor profiles as an array of {category, type} objects
function getAllFlavorProfiles() {
    const allProfiles = [];
    Object.keys(flavorProfiles).forEach(category => {
        Object.keys(flavorProfiles[category]).forEach(type => {
            allProfiles.push({ category, type });
        });
    });
    return allProfiles;
} 