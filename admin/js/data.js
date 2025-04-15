/**
 * Tea data definitions, including tea types, processing methods, and flavor profiles
 */

// Tea types with their characteristics
const teaTypes = {
    white: {
        name: 'White Tea',
        oxidationLevel: 'Very low (0-5%)',
        keyCharacteristics: [
            'Minimal oxidation', 
            'Least processed tea type', 
            'Typically made from young buds and leaves', 
            'Highest antioxidant content'
        ]
    },
    green: {
        name: 'Green Tea',
        oxidationLevel: 'Very low (0-5%)',
        keyCharacteristics: [
            'Heated immediately after picking', 
            'Retains green color', 
            'Preserves natural plant enzymes', 
            'Varies by region (Japanese vs Chinese styles)'
        ]
    },
    yellow: {
        name: 'Yellow Tea',
        oxidationLevel: 'Low (5-10%)',
        keyCharacteristics: [
            'Rare and expensive', 
            'Limited production mainly in China', 
            'Involves additional step of gentle heating and covering', 
            'Smooth and mellow taste'
        ]
    },
    oolong: {
        name: 'Oolong (Wulong) Tea',
        oxidationLevel: 'Partial (10-80%)',
        keyCharacteristics: [
            'Sits between green and black tea', 
            'Highly skilled processing', 
            'Can be re-steeped multiple times', 
            'Flavor varies dramatically based on oxidation level'
        ]
    },
    black: {
        name: 'Black Tea',
        oxidationLevel: 'Full (80-95%)',
        keyCharacteristics: [
            'Most common in Western countries', 
            'Fully oxidized', 
            'Strong flavor', 
            'High caffeine content'
        ]
    },
    pu_er: {
        name: 'Pu\'er Tea',
        oxidationLevel: 'Post-fermented (unique process)',
        keyCharacteristics: [
            'Aged and fermented', 
            'Can improve with age like wine', 
            'Compressed into cakes or bricks', 
            'Originates from Yunnan, China'
        ]
    }
};

// Processing methods with detailed information
const processingMethods = {
    'minimal-processing': {
        category: 'Basic',
        description: 'Very little processing, preserving the natural state of the leaves',
        effects: 'Preserves natural enzymes and antioxidants',
        intensity: 'Very Low'
    },
    'sun-dried': {
        category: 'Drying',
        description: 'Leaves dried naturally in the sun',
        effects: 'Gentle drying that preserves delicate flavors',
        intensity: 'Low'
    },
    'withered': {
        category: 'Initial Processing',
        description: 'Leaves are allowed to wilt and lose moisture',
        effects: 'Prepares leaves for further processing',
        intensity: 'Low'
    },
    'steamed': {
        category: 'Heat Treatment',
        description: 'Leaves are heated with steam to halt oxidation',
        effects: 'Preserves green color and fresh flavor',
        intensity: 'Medium'
    },
    'pan-fired': {
        category: 'Heat Treatment',
        description: 'Leaves are heated in a wok or pan to halt oxidation',
        effects: 'Creates toasty notes while halting oxidation',
        intensity: 'Medium'
    },
    'kill-green': {
        category: 'Heat Treatment',
        description: 'Process of applying heat to halt oxidation enzymes',
        effects: 'Preserves green character and prevents oxidation',
        intensity: 'Medium'
    },
    'light-roast': {
        category: 'Roasting',
        description: 'Brief roasting at lower temperatures',
        effects: 'Adds light toasty notes while maintaining original character',
        intensity: 'Medium-Low'
    },
    'medium-roast': {
        category: 'Roasting',
        description: 'Moderate roasting to develop deeper flavors',
        effects: 'Develops nutty, toasty notes and reduces grassiness',
        intensity: 'Medium'
    },
    'heavy-roast': {
        category: 'Roasting',
        description: 'Long roasting at higher temperatures',
        effects: 'Creates pronounced roasted, caramelized flavors',
        intensity: 'High'
    },
    'partial-oxidation': {
        category: 'Oxidation',
        description: 'Leaves are allowed to oxidize partly, but process is halted',
        effects: 'Creates unique flavor profiles between green and black tea',
        intensity: 'Variable (10-80%)'
    },
    'full-oxidation': {
        category: 'Oxidation',
        description: 'Leaves are fully oxidized',
        effects: 'Develops rich, robust flavors and darker color',
        intensity: 'High'
    },
    'oxidised': {
        category: 'Oxidation',
        description: 'Controlled exposure to oxygen to change chemical composition',
        effects: 'Darkens the leaves and transforms flavor compounds',
        intensity: 'Variable'
    },
    'fermented': {
        category: 'Fermentation',
        description: 'Microbial activity transforms the tea leaves',
        effects: 'Creates earthy, woody flavors and darker liquor',
        intensity: 'High'
    },
    'aged': {
        category: 'Aging',
        description: 'Tea is stored for extended periods to develop character',
        effects: 'Develops complexity, smoothness, and unique aged notes',
        intensity: 'Variable'
    },
    'rolled': {
        category: 'Shaping',
        description: 'Leaves are rolled into balls or twisted shapes',
        effects: 'Concentrates flavors and creates unique aesthetics',
        intensity: 'Medium'
    },
    'tumbled': {
        category: 'Shaping',
        description: 'Leaves are tumbled to break cell walls gently',
        effects: 'Starts oxidation process and shapes the leaves',
        intensity: 'Medium'
    },
    'shade-grown': {
        category: 'Growing',
        description: 'Plants are grown under shade for weeks before harvest',
        effects: 'Increases chlorophyll, L-theanine, and amino acids',
        intensity: 'High'
    },
    'insect-bitten': {
        category: 'Special',
        description: 'Leaves allowed to be nibbled by specific insects',
        effects: 'Triggers plant defense response creating honey and fruit notes',
        intensity: 'Variable'
    },
    'charcoal-roast': {
        category: 'Roasting',
        description: 'Roasting over traditional charcoal fire',
        effects: 'Imparts distinctive smoky-sweet character',
        intensity: 'High'
    },
    'rock-fired': {
        category: 'Roasting',
        description: 'Traditional Wuyi processing using charcoal in rocky terrain',
        effects: 'Enhances mineral notes and creates unique rocky character',
        intensity: 'High'
    },
    'pile-fermented': {
        category: 'Fermentation',
        description: 'Leaves piled in controlled environment for microbial fermentation',
        effects: 'Creates earthy, mellow character of shou puerh',
        intensity: 'High'
    },
    'compressed': {
        category: 'Shaping',
        description: 'Tea pressed into cakes, bricks, or other shapes',
        effects: 'Concentrates flavors and facilitates aging',
        intensity: 'Medium'
    },
    'anaerobic-fermentation': {
        category: 'Special',
        description: 'Fermentation in oxygen-free environment',
        effects: 'Increases GABA content and creates unique flavor profile',
        intensity: 'High'
    }
};

// Flavor profiles with detailed information
const flavorProfiles = {
    floral: {
        white_floral: {
            flavors: ['Jasmine', 'Lily', 'Honeysuckle'],
            intensity: 'Delicate',
            effects: 'Aromatic, sweet, elegant'
        },
        herbal_floral: {
            flavors: ['Chamomile', 'Lavender', 'Rose', 'Chrysanthemum'],
            intensity: 'Moderate',
            effects: 'Soothing, aromatic, perfumed'
        },
        exotic_floral: {
            flavors: ['Orchid', 'Lotus', 'Gardenia', 'Magnolia'],
            intensity: 'Pronounced',
            effects: 'Complex, heady, aromatic'
        }
    },
    vegetal: {
        leafy: {
            flavors: ['Fresh cut grass', 'Spinach', 'Lettuce', 'Kale'],
            intensity: 'Moderate',
            effects: 'Fresh, green, crisp'
        },
        herbaceous: {
            flavors: ['Thyme', 'Basil', 'Mint', 'Sage'],
            intensity: 'Moderate to strong',
            effects: 'Aromatic, refreshing, complex'
        },
        marine: {
            flavors: ['Seaweed', 'Ocean air', 'Algae', 'Nori'],
            intensity: 'Distinct',
            effects: 'Briny, mineral-rich, umami'
        },
        garden_vegetal: {
            flavors: ['Cucumber', 'Artichoke', 'Asparagus', 'Snap pea'],
            intensity: 'Fresh',
            effects: 'Clean, refreshing, tender'
        }
    },
    fruity: {
        citrus: {
            flavors: ['Lemon', 'Orange', 'Bergamot', 'Yuzu', 'Grapefruit'],
            intensity: 'Bright',
            effects: 'Zesty, refreshing, tangy'
        },
        stone_fruit: {
            flavors: ['Peach', 'Apricot', 'Plum', 'Cherry'],
            intensity: 'Medium to full',
            effects: 'Sweet, juicy, rounded'
        },
        tropical: {
            flavors: ['Pineapple', 'Mango', 'Coconut', 'Lychee', 'Passion fruit'],
            intensity: 'Full',
            effects: 'Exotic, sweet, luscious'
        },
        berry: {
            flavors: ['Strawberry', 'Blackberry', 'Raspberry', 'Blueberry'],
            intensity: 'Medium to full',
            effects: 'Sweet-tart, juicy, vibrant'
        },
        tree_fruit: {
            flavors: ['Apple', 'Pear', 'Quince'],
            intensity: 'Moderate',
            effects: 'Fresh, clean, juicy'
        },
        dried_fruit: {
            flavors: ['Raisin', 'Fig', 'Date', 'Dried apricot'],
            intensity: 'Concentrated',
            effects: 'Sweet, complex, rich'
        },
        muscatel: {
            flavors: ['Muscat grape', 'Wine-like', 'Floral-fruity'],
            intensity: 'Distinctive',
            effects: 'Complex, refined, prized'
        }
    },
    sweet: {
        caramelized: {
            flavors: ['Caramel', 'Brown sugar', 'Toffee', 'Molasses'],
            intensity: 'Rich',
            effects: 'Smooth, indulgent, warming'
        },
        honey: {
            flavors: ['Wildflower honey', 'Honeycomb', 'Nectar', 'Acacia honey', 'Buckwheat honey'],
            intensity: 'Medium',
            effects: 'Mellow sweetness, floral notes'
        },
        vanilla: {
            flavors: ['Vanilla bean', 'Cream', 'Custard'],
            intensity: 'Smooth',
            effects: 'Comforting, creamy, mellow'
        },
        chocolate: {
            flavors: ['Cocoa', 'Dark chocolate', 'Chocolate malt', 'Cacao nibs'],
            intensity: 'Rich',
            effects: 'Deep, satisfying, complex'
        },
        confectionery: {
            flavors: ['Marshmallow', 'Cotton candy', 'Candy floss', 'Marzipan'],
            intensity: 'Sweet',
            effects: 'Nostalgic, playful, dessert-like'
        }
    },
    nutty_and_toasty: {
        nuts: {
            flavors: ['Almond', 'Walnut', 'Chestnut', 'Hazelnut', 'Pecan'],
            intensity: 'Medium',
            effects: 'Warm, comforting, savory-sweet'
        },
        grain: {
            flavors: ['Toasted rice', 'Barley', 'Wheat', 'Oats'],
            intensity: 'Subtle to medium',
            effects: 'Cozy, wholesome, satisfying'
        },
        roasted: {
            flavors: ['Roasted nuts', 'Toasted bread', 'Biscuit', 'Pastry'],
            intensity: 'Medium to strong',
            effects: 'Comforting, homey, depth'
        }
    },
    spicy: {
        warm_spice: {
            flavors: ['Cinnamon', 'Cardamom', 'Clove', 'Nutmeg', 'Star anise'],
            intensity: 'Warming',
            effects: 'Comforting, aromatic, complex'
        },
        pungent: {
            flavors: ['Black pepper', 'Ginger', 'Licorice', 'White pepper'],
            intensity: 'Assertive',
            effects: 'Stimulating, warming, distinctive'
        },
        cooling: {
            flavors: ['Menthol', 'Camphor', 'Eucalyptus'],
            intensity: 'Refreshing',
            effects: 'Cooling, invigorating, clearing'
        }
    },
    earthy: {
        soil: {
            flavors: ['Forest floor', 'Wet earth', 'Petrichor', 'Loam'],
            intensity: 'Deep',
            effects: 'Grounding, complex, musty'
        },
        mineral: {
            flavors: ['Slate', 'Stone', 'Volcanic rock', 'Wet stone', 'Flint', 'Spring water'],
            intensity: 'Subtle to pronounced',
            effects: 'Clean, refined, elegant, distinctive of certain terroirs'
        },
        medicinal: {
            flavors: ['Herbs', 'Roots', 'Traditional medicine', 'Eucalyptus'],
            intensity: 'Distinctive',
            effects: 'Therapeutic, complex, traditional'
        },
        compost: {
            flavors: ['Autumn leaves', 'Compost', 'Humus', 'Leaf pile'],
            intensity: 'Complex',
            effects: 'Rich, seasonal, evolving'
        }
    },
    woody: {
        aged: {
            flavors: ['Cedar', 'Oak', 'Sandalwood', 'Rosewood'],
            intensity: 'Medium to strong',
            effects: 'Mellow complexity, depth, maturity'
        },
        fresh: {
            flavors: ['Fresh cut wood', 'Bamboo', 'Green stems', 'Pine'],
            intensity: 'Light to medium',
            effects: 'Clean, subtle, natural'
        },
        resinous: {
            flavors: ['Pine resin', 'Cedar', 'Frankincense', 'Myrrh'],
            intensity: 'Distinctive',
            effects: 'Aromatic, long-lasting, complex'
        }
    },
    roasted: {
        smoky: {
            flavors: ['Campfire', 'Charcoal', 'Lapsang', 'Bonfire'],
            intensity: 'Strong',
            effects: 'Bold, distinctive, polarizing'
        },
        toasted: {
            flavors: ['Toast', 'Roasted grain', 'Popcorn', 'Coffee'],
            intensity: 'Medium',
            effects: 'Comforting, accessible, appealing'
        },
        charred: {
            flavors: ['Burnt sugar', 'Charred wood', 'Grilled'],
            intensity: 'Strong',
            effects: 'Robust, dramatic, deep'
        }
    },
    aged: {
        fermented: {
            flavors: ['Leather', 'Must', 'Wine', 'Whiskey', 'Aged spirits'],
            intensity: 'Complex',
            effects: 'Deep, multi-layered, acquired taste'
        },
        mellow: {
            flavors: ['Aged wood', 'Old books', 'Antiques', 'Library'],
            intensity: 'Subtle',
            effects: 'Smooth, refined, nuanced'
        },
        storage: {
            flavors: ['Warehouse', 'Cedar chest', 'Attic', 'Cellar'],
            intensity: 'Distinctive',
            effects: 'Nostalgic, evolving, unique'
        }
    },
    umami: {
        savory: {
            flavors: ['Broth', 'Meat', 'Mushroom', 'Vegetable stock'],
            intensity: 'Rich',
            effects: 'Mouth-filling, satisfying, savory'
        },
        marine_umami: {
            flavors: ['Kombu', 'Dashi', 'Seafood', 'Dried fish'],
            intensity: 'Pronounced',
            effects: 'Complex, savory, distinctive'
        },
        protein: {
            flavors: ['Cooked beans', 'Tofu', 'Soy milk', 'Miso'],
            intensity: 'Subtle',
            effects: 'Substantial, nourishing, filling'
        }
    },
    mouthfeel: {
        astringency: {
            flavors: ['Drying', 'Tannic', 'Puckering', 'Brisk'],
            intensity: 'Variable',
            effects: 'Cleansing, structuring, sometimes harsh'
        },
        texture: {
            flavors: ['Silky', 'Creamy', 'Thick', 'Velvety', 'Smooth'],
            intensity: 'Physical sensation',
            effects: 'Body, substance, satisfaction'
        },
        minerality: {
            flavors: ['Clean finish', 'Crisp', 'Mineral water'],
            intensity: 'Subtle',
            effects: 'Refreshing, palate-cleansing, elegant'
        }
    },
    bitter: {
        pleasant_bitter: {
            flavors: ['Cacao', 'Coffee', 'Grapefruit pith', 'Dark chocolate'],
            intensity: 'Controlled',
            effects: 'Complexity, depth, balance'
        },
        herbal_bitter: {
            flavors: ['Dandelion', 'Chicory', 'Artemisia', 'Bitter herbs'],
            intensity: 'Distinctive',
            effects: 'Medicinal, purifying, traditional'
        },
        vegetable_bitter: {
            flavors: ['Kale', 'Endive', 'Radicchio', 'Brussels sprouts'],
            intensity: 'Green',
            effects: 'Fresh, vegetal, stimulating'
        }
    },
    dairy: {
        milk: {
            flavors: ['Fresh cream', 'Milk', 'Butter', 'Condensed milk'],
            intensity: 'Smooth',
            effects: 'Creamy, rich, soothing'
        },
        fermented: {
            flavors: ['Yogurt', 'Cheese', 'Cream cheese', 'Buttermilk'],
            intensity: 'Complex',
            effects: 'Tangy, rich, distinctive'
        },
        buttery: {
            flavors: ['Fresh butter', 'Brown butter', 'Ghee'],
            intensity: 'Rich',
            effects: 'Coating, luxurious, substantial'
        }
    }
};